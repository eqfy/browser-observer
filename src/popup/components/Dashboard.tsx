import React, { FunctionComponent } from 'react';
import bgConsole from '../helpers/bgConsole';
import { useAppSelector } from '../hooks';
import { ViewType } from '../redux/view';

import '../styles/Dashboard.less';
import CookieWidget from './CookieWidget';
import HeaderWidget from './HeaderWidget';
import { JWTWidget } from './JWTWidget';
import ObjectViewerWidget from './ObjectViewerWidget';
import { SessionWidget } from './SessionWidget';
import { SettingWidget } from './SettingWidget';

const DashBoard: FunctionComponent = () => {
    const viewState = useAppSelector((state) => state.view);

    const showView = () => {
        switch (viewState.viewType) {
            case ViewType.COOKIE:
                return <CookieWidget />;
            case ViewType.JWT:
                return <JWTWidget />;
            case ViewType.SESSION:
                return <SessionWidget />;
            case ViewType.SETTING:
                return <SettingWidget />;
            default:
                bgConsole.log('Not implemented');
                return null;
        }
    };

    return (
        <div className="dashboard-root">
            <HeaderWidget />
            {showView()}
            <div className="dashboard-footer">
                Browser Observer is a development tool for easy viewing/editing
                of cookies and has tools for decoding common tokens like JWTs.
            </div>
        </div>
    );
};

export default DashBoard;
