import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';

interface SessionState {
    session?: object;
    sessionId?: string;
}

const initialState: SessionState = {};

export const fetchSessionToken = createAsyncThunk<
    SessionState,
    void,
    { dispatch: AppDispatch; state: RootState }
>('session/fetchSession', async (_arg, thunkAPI) => {
    const {
        cookies: { entities },
        setting: { sessionSetting },
        session: { sessionId: oldSessionId, session: oldSession },
    } = thunkAPI.getState();
    const jwtCookie = entities['JWT'];
    const sessionIdCookie = entities['OTSESSIONAABQRN'];
    if (!jwtCookie || !sessionIdCookie || !sessionSetting)
        return { oldSessionId };
    const jwt = jwtCookie.value;
    const sessionId = sessionIdCookie.value;

    if (
        jwt.length === 0 ||
        sessionId.length === 0 ||
        sessionId === oldSessionId
    )
        return { sessionId: oldSessionId, session: oldSession };
    const url = sessionSetting[sessionSetting.currentEnvironment] + sessionId;
    const resp = await fetch(url, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });
    const jsonResp = await resp.json();
    return { session: jsonResp, sessionId: sessionId };
});

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<SessionState>) =>
            action.payload,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSessionToken.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { setSession } = sessionSlice.actions;

export default sessionSlice.reducer;
