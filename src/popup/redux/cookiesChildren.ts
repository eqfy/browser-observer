import {
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
} from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import getPropertyFromPath from 'lodash/get';
import { AppCookie } from '../states/CookieState';
import { AppThunk } from '../store';

interface ChildDetails {
    value: any;
    name: string;
    pinned?: boolean;
}

interface CookieChild {
    name: string;
    children: ChildDetails[];
}

export type CookieChildrenState = EntityState<CookieChild>;

export const processCookieOptions = (): AppThunk => (dispatch, getState) => {
    const {
        cookies: { ids, entities },
    } = getState();
    const cookieChildren = ids.reduce<CookieChild[]>((acc, id) => {
        const cookie = entities[id] as AppCookie;
        acc.push(getCookieChild(cookie));
        return acc;
    }, []);
    dispatch(setCookieChildren(cookieChildren));
};

const getCookieChild = (cookie: AppCookie) => {
    // Return if cookie has no children
    if (
        !cookie.options?.children?.length ||
        cookie.options?.children?.length <= 0
    )
        return { name: cookie.name || '', children: [] };

    // Return if cookie has no body in object form
    const { children, specialInstruction } = cookie.options;
    let cookieValue: object | undefined;
    if (specialInstruction === 'JWT') {
        cookieValue = jwtDecode<object>(cookie.value);
    }
    if (!cookieValue) return { name: cookie.name, children: [] };

    // Find children in the cookieValue
    const objectChildren = children.reduce<ChildDetails[]>((acc, child) => {
        const childValue = getPropertyFromPath(cookieValue, child.path);
        if (!childValue) return acc;

        const childName = child.name || child.path.toString();
        acc.push({
            value: childValue,
            name: childName,
        });
        return acc;
    }, []);
    return {
        name: cookie.name,
        children: objectChildren,
    };
};

const cookieChildrenAdapter = createEntityAdapter<CookieChild>({
    selectId: (cookie) => cookie.name,
});

export const cookiesChildrenSlice = createSlice({
    name: 'view',
    initialState: cookieChildrenAdapter.getInitialState(),
    reducers: {
        setCookieChildren: (state, action: PayloadAction<CookieChild[]>) => {
            cookieChildrenAdapter.upsertMany(state, action.payload);
        },
    },
});

export const { setCookieChildren } = cookiesChildrenSlice.actions;

export default cookiesChildrenSlice.reducer;
