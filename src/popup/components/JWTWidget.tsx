import jwtDecode from 'jwt-decode';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { setViewType, ViewType } from '../redux/view';
import ObjectViewerWidget from './ObjectViewerWidget';

interface JWTWidgetProps {}

export const JWTWidget: FunctionComponent<JWTWidgetProps> = () => {
    const cookieEntities = useAppSelector((state) => state.cookies.entities);
    const dispatch = useDispatch();
    const jwt = cookieEntities['JWT']?.value;
    if (!jwt || jwt.length === 0) {
        dispatch(setViewType(ViewType.COOKIE));
        return null;
    }

    const decodedJWT = jwtDecode<object>(jwt);
    return (
        <ObjectViewerWidget
            name="JWT"
            object={decodedJWT}
            returnViewType={ViewType.COOKIE}
        />
    );
};
