import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ViewState {
    viewType: ViewType;
}

export enum ViewType {
    'COOKIE',
    'OBJECT_VIEWER',
    'JWT',
    'SESSION',
    'SETTING',
}

const initialState: ViewState = {
    viewType: ViewType.COOKIE,
};

export const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        setViewType: (state, action: PayloadAction<ViewType>) => {
            state.viewType = action.payload;
        },
    },
});

export const { setViewType } = viewSlice.actions;

export default viewSlice.reducer;
