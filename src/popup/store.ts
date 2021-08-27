import { AnyAction, configureStore } from '@reduxjs/toolkit';
import thunk, { ThunkAction } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import cookies from './redux/cookies';
import view from './redux/view';
import cookiesChildren from './redux/cookiesChildren';
import setting from './redux/setting';
import session from './redux/session';
import bgConsole from './helpers/bgConsole';

const logger = createLogger({
    logger: bgConsole, // Log to background page console
});

export const store = configureStore({
    reducer: {
        view: view,
        cookies: cookies,
        cookiesChildren: cookiesChildren,
        setting: setting,
        session: session,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([thunk, logger]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>;
