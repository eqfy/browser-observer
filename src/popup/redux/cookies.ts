import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import { browser, Cookies } from 'webextension-polyfill-ts';
import { getCurrUrl } from '../helpers/url';
import { AppCookie, AppCookieDetails } from '../states/CookieState';
import { AppDispatch, RootState } from '../store';

export const emptyCookie: chrome.cookies.Cookie = {
    domain: '',
    name: '',
    storeId: '',
    value: '',
    session: false,
    hostOnly: false,
    path: '',
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
};

const convertIntoDefautCookie = (
    cookieDetails: AppCookieDetails[]
): AppCookie[] => {
    return cookieDetails.map((cookieDetail) => ({
        ...emptyCookie,
        ...cookieDetail,
    }));
};

// TODO this is actually synchronous
export const getCookieInfoFromSetting = createAsyncThunk<
    AppCookie[],
    void,
    { dispatch: AppDispatch; state: RootState }
>('cookies/loadCookies', async (_arg, thunkAPI) => {
    const {
        setting: { cookieSetting },
    } = thunkAPI.getState();
    return convertIntoDefautCookie(cookieSetting);
});

export const getCookiesFromBrowser = createAsyncThunk<
    AppCookie[],
    void,
    { dispatch: AppDispatch; state: RootState }
>('cookies/getCookies', async (_arg, thunkAPI) => {
    const {
        cookies: { ids, entities },
    } = thunkAPI.getState();
    const currentUrl = await getCurrUrl();
    const cookiePromises = ids.reduce<Promise<Cookies.Cookie>[]>(
        (acc, cookieId) => {
            const cookie = entities[cookieId];
            if (cookie) {
                const { name, url } = cookie;
                acc.push(
                    browser.cookies.get({
                        name,
                        url: url || currentUrl || '',
                    })
                );
            }
            return acc;
        },
        []
    );
    const resultCookies = await resolveCookiePromises(cookiePromises);
    return decorateWithAppId(resultCookies);
});

export const setCookieValue = createAsyncThunk<
    AppCookie,
    { name: string; value: string },
    { dispatch: AppDispatch; state: RootState }
>('cookies/setCookieValue', async (arg, thunkAPI) => {
    const { name, value } = arg;
    const {
        cookies: { entities },
    } = thunkAPI.getState();
    const updatedCookie: AppCookie = {
        ...(entities[name] as AppCookie),
        value,
    };
    const currentUrl = await getCurrUrl();

    await browser.cookies.remove({
        url: updatedCookie.url || currentUrl || '',
        name: updatedCookie.name,
    });

    await browser.cookies.set({
        // Mandatory
        url: updatedCookie.url || currentUrl || '',
        name: updatedCookie.name,
        value: updatedCookie.value,
        // Optional fields
        // Due to typing issues caused by chrome cookie api and mozilla's polyfill,
        // I am manually setting these fields to undefined if they are '' or false
        domain: updatedCookie.domain || undefined,
        expirationDate: updatedCookie.expirationDate || undefined,
        httpOnly: updatedCookie.httpOnly || undefined,
        path: updatedCookie.path || undefined,
        // Interesting case where mozilla polyfill does not have 'unspecified' option
        sameSite:
            updatedCookie.sameSite === 'unspecified'
                ? undefined
                : updatedCookie.sameSite,
        secure: updatedCookie.secure || undefined,
        storeId: updatedCookie.storeId || undefined,
    });
    return updatedCookie;
});

const decorateWithAppId = (cookies: Cookies.Cookie[]): AppCookie[] =>
    cookies.map((cookie) => ({
        ...cookie,
        appId: cookie.name,
    }));

const resolveCookiePromises = async (
    cookiePromises: Promise<Cookies.Cookie>[]
) =>
    Promise.allSettled(cookiePromises).then((cookieResults) =>
        cookieResults
            .filter(
                (
                    cookieResult
                ): cookieResult is PromiseFulfilledResult<Cookies.Cookie> => {
                    return (
                        cookieResult.status === 'fulfilled' &&
                        Boolean(cookieResult.value)
                    );
                }
            )
            .map((cookieResult: PromiseFulfilledResult<Cookies.Cookie>) => {
                return cookieResult.value;
            })
    );

export const cookieAdapter = createEntityAdapter<AppCookie>({
    selectId: (cookie) => cookie.appId,
});

export const cookieSlice = createSlice({
    name: 'cookies',
    initialState: cookieAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getCookieInfoFromSetting.fulfilled,
            cookieAdapter.upsertMany
        );
        builder.addCase(
            getCookiesFromBrowser.fulfilled,
            cookieAdapter.upsertMany
        );
        builder.addCase(setCookieValue.fulfilled, cookieAdapter.upsertOne);
    },
});

export const { } = cookieSlice.actions;

export default cookieSlice.reducer;
