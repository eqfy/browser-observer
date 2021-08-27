import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { browser } from 'webextension-polyfill-ts';

import { AppCookieDetails } from '../states/CookieState';
import {
    defaultCookieSetting,
    defaultSessionSetting,
    SessionSetting,
} from '../states/DefaultSetting';
import { AppDispatch, RootState } from '../store';
import { getCookieInfoFromSetting } from './cookies';

export interface SettingState {
    cookieSetting: AppCookieDetails[];
    sessionSetting?: SessionSetting;
}

const initialState: SettingState = {
    cookieSetting: [],
};

const defaultState: SettingState = {
    cookieSetting: defaultCookieSetting,
    sessionSetting: defaultSessionSetting,
};

const settingStateTypeGuard = (
    settingState: any
): settingState is SettingState => {
    // FIXME This type guard isn't too useful
    return (
        settingState &&
        settingState.cookieSetting &&
        Array.isArray(settingState.cookieSetting)
    );
};

export const getSettingFromStorage = createAsyncThunk<
    SettingState,
    void,
    { dispatch: AppDispatch; state: RootState }
>('setting/loadSetting', async (_arg, thunkAPI) => {
    const {
        setting: {
            cookieSetting: oldCookieSetting,
            sessionSetting: oldSessionSetting,
        },
    } = thunkAPI.getState();
    const storageItems = await browser.storage.sync.get('setting');
    let isInvalidSetting = false;
    let setting = storageItems.setting;

    if (!setting || !settingStateTypeGuard(setting)) {
        isInvalidSetting = true;
    }
    if (isInvalidSetting) {
        if (oldCookieSetting.length === 0) {
            setting.cookieSetting = defaultState.cookieSetting;
        }
        if (!oldSessionSetting) {
            setting.sessionSetting = defaultState.sessionSetting;
        }
    }
    return setting as SettingState;
});

export const storeSettingIntoStorage = createAsyncThunk<
    void,
    void,
    { dispatch: AppDispatch; state: RootState }
>('setting/storeSetting', async (_arg, thunkAPI) => {
    const { getState, dispatch } = thunkAPI;
    const { setting } = getState();
    await browser.storage.sync.set({
        setting: setting,
    });
    dispatch(getCookieInfoFromSetting());
});

export const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        setSetting: (_state, action: PayloadAction<SettingState>) => {
            return action.payload;
        },
        setCookieSetting: (
            state,
            action: PayloadAction<AppCookieDetails[]>
        ) => {
            state.cookieSetting = action.payload;
        },
        useDefaultSetting: () => {
            return defaultState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getSettingFromStorage.fulfilled, (_state, action) => {
            return action.payload;
        });
        builder.addCase(storeSettingIntoStorage.fulfilled, () => {});
    },
});

export const {
    setSetting,
    setCookieSetting,
    useDefaultSetting,
} = settingSlice.actions;

export default settingSlice.reducer;
