import isObjectLike from 'lodash/isObjectLike';
import React, { FunctionComponent } from 'react';
import { useAppSelector } from '../hooks';
import { ViewType } from '../redux/view';
import { SessionSetting } from '../states/DefaultSetting';
import ObjectViewerWidget from './ObjectViewerWidget';

const parseSession = (sessionToken: any, sessionSetting?: SessionSetting) => {
    if (!sessionToken) return {};
    let newSessionToken = { ...sessionToken };
    sessionSetting?.attributes?.every((attribute) => {
        if (!isObjectLike(sessionToken[attribute.name])) {
            if (attribute.type === 'JSON') {
                newSessionToken[attribute.name] = {
                    ...JSON.parse(sessionToken[attribute.name] as string),
                };
            } else if (attribute.type === 'string') {
                newSessionToken[attribute.name] = (sessionToken[
                    attribute.name
                ] as string).split(attribute.separator || ',');
            }
        }
        if (attribute.pinned) {
            newSessionToken = newSessionToken[attribute.name];
            return false;
        }
    });

    return newSessionToken;
};

export const SessionWidget: FunctionComponent = () => {
    const session = useAppSelector((state) => state.session.session);
    const sessionSetting = useAppSelector(
        (state) => state.setting.sessionSetting
    );

    return (
        <ObjectViewerWidget
            name="Session"
            object={parseSession(session, sessionSetting)}
            returnViewType={ViewType.COOKIE}
            sorted={true}
        />
    );
};
