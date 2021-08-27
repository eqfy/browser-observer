import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { FunctionComponent } from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';
import { useAppDispatch } from '../hooks';
import { setViewType, ViewType } from '../redux/view';
import '../styles/ObjectViewerWidget.less';

interface ObjectViewerProps {
    name: string;
    returnViewType: ViewType;
    object?: Object;
    collapsed?: boolean;
    sorted?: boolean;
    handleOnAdd?: (add: InteractionProps) => any;
    handleOnEdit?: (edit: InteractionProps) => any;
}

const ObjectViewerWidget: FunctionComponent<ObjectViewerProps> = (props) => {
    const {
        name,
        object = {},
        collapsed = false,
        returnViewType,
        sorted = false,
        handleOnAdd,
        handleOnEdit,
    } = props;
    const dispatch = useAppDispatch();
    const handleReturnBtnClick = () => {
        dispatch(setViewType(returnViewType));
    };

    return (
        <div className="object-viewer">
            <div className="object-viewer-header">
                <IconButton
                    className="return-button"
                    onClick={handleReturnBtnClick}
                >
                    <ArrowBackIcon className="return-button-icon" />
                </IconButton>
                <span>{name}</span>
            </div>
            <div className="object-viewer-body">
                <ReactJson
                    src={object}
                    onEdit={handleOnEdit}
                    onAdd={handleOnAdd}
                    collapsed={collapsed}
                    sortKeys={sorted}
                />
            </div>
        </div>
    );
};

export default ObjectViewerWidget;
