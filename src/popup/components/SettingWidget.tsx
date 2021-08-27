import React, { FunctionComponent } from 'react';
import { InteractionProps } from 'react-json-view';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
    setSetting,
    SettingState,
    storeSettingIntoStorage,
} from '../redux/setting';
import { ViewType } from '../redux/view';
import ObjectViewerWidget from './ObjectViewerWidget';

export const SettingWidget: FunctionComponent = () => {
    const settingState = useAppSelector((state) => state.setting);
    const dispatch = useAppDispatch();

    const handleOnAdd = (add: InteractionProps) => {
        dispatch(setSetting(add.updated_src as SettingState));
        dispatch(storeSettingIntoStorage());
    };
    const handleOnEdit = (edit: InteractionProps) => {
        dispatch(setSetting(edit.updated_src as SettingState));
        dispatch(storeSettingIntoStorage());
    };

    return (
        <ObjectViewerWidget
            name="Setting"
            object={settingState}
            returnViewType={ViewType.COOKIE}
            handleOnAdd={handleOnAdd}
            handleOnEdit={handleOnEdit}
        />
    );
};
