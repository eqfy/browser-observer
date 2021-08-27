import VisibilityIcon from '@material-ui/icons/Visibility';
import { IconButton, TextareaAutosize } from '@material-ui/core';
import { EntityState } from '@reduxjs/toolkit';
import React, { FunctionComponent, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
    getCookieInfoFromSetting,
    getCookiesFromBrowser,
    setCookieValue,
} from '../redux/cookies';
import { setViewType, ViewType } from '../redux/view';
import { AppCookie } from '../states/CookieState';
import '../styles/CookiesWidget.less';
import {
    CookieChildrenState,
    processCookieOptions,
} from '../redux/cookiesChildren';
import { getSettingFromStorage } from '../redux/setting';
import { fetchSessionToken } from '../redux/session';
import bgConsole from '../helpers/bgConsole';

interface CookieRowProps {
    cookiesState: EntityState<AppCookie>;
    cookiesChildren: CookieChildrenState;
}

const CookieRows: FunctionComponent<CookieRowProps> = (props) => {
    const {
        cookiesState: { ids: cookieIds, entities: cookieEntities },
        cookiesChildren: { entities: cookieChildrenEntities },
    } = props;
    const dispatch = useAppDispatch();

    const handleJWTClick = () => {
        dispatch(setViewType(ViewType.JWT));
    };

    const debouncedSetCookie = debounce((name: string, value: string) => {
        dispatch(setCookieValue({ name, value }));
    }, 300);

    const handleTextAreaChange = (
        cookie: AppCookie
    ): React.ChangeEventHandler<HTMLTextAreaElement> => (event) => {
        const { name = '' } = cookie;
        debouncedSetCookie(name, event.target.value);
    };

    const showCookieChild = (parentName: string) => {
        const cookieChildInfo = cookieChildrenEntities[parentName];
        if (!cookieChildInfo) return;
        const { children } = cookieChildInfo;
        return children.map((childDetail, index) => {
            const { name, value } = childDetail;
            return (
                <CookieRow
                    name={name}
                    value={value}
                    key={name + ' ' + index}
                    indent={20}
                >
                    <div className="parse-btn-placeholder" />
                </CookieRow>
            );
        });
    };

    return (
        <div className="cookie-row">
            {cookieIds.map((id, index) => {
                const cookie = cookieEntities[id] as AppCookie;
                const {
                    name,
                    value = '',
                    options: { specialInstruction = '', editable = false } = {},
                } = cookie;
                return (
                    <CookieRow
                        name={name}
                        value={value}
                        readonly={!editable}
                        textareaOnChange={handleTextAreaChange(cookie)}
                        key={`${id}_${index}`}
                        endAdornment={
                            specialInstruction === 'JWT' ? (
                                <IconButton
                                    onClick={handleJWTClick}
                                    className="parse-btn"
                                >
                                    <VisibilityIcon className="parse-btn-icon" />
                                </IconButton>
                            ) : null
                        }
                    >
                        {showCookieChild(name)}
                    </CookieRow>
                );
            })}
        </div>
    );
};

interface CookieRow {
    name: string;
    value: string;
    readonly?: boolean;
    indent?: number;
    endAdornment?: React.ReactNode;
    textareaOnChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export const CookieRow: FunctionComponent<CookieRow> = (props) => {
    const {
        name,
        value,
        readonly = true,
        indent = 0,
        endAdornment = null,
        textareaOnChange,
    } = props;
    return (
        <>
            <div className="cookie-row-inner">
                <div className="cookie-name" style={{ paddingLeft: indent }}>
                    {name}
                </div>
                <TextareaAutosize
                    defaultValue={value}
                    rowsMax={2}
                    className="cookie-textarea"
                    onChange={textareaOnChange}
                    readOnly={readonly}
                />
                {endAdornment || <div className="parse-btn-placeholder" />}
            </div>
            {props.children}
        </>
    );
};

const CookieWidget: FunctionComponent = (props) => {
    const dispatch = useAppDispatch();
    const cookies = useAppSelector((state) => state.cookies);
    const cookiesChildren = useAppSelector((state) => state.cookiesChildren);
    const setting = useAppSelector((state) => state.setting);

    useEffect(() => {
        dispatch(getSettingFromStorage())
            .then(() => dispatch(getCookieInfoFromSetting()))
            .then(() => dispatch(getCookiesFromBrowser()))
            .then(() => dispatch(processCookieOptions()))
            .then(() => dispatch(fetchSessionToken()))
            .catch((e) => bgConsole.log(e));
    }, []);

    const loadCookies = () => {
        dispatch(getCookiesFromBrowser())
            .then(() => dispatch(processCookieOptions()))
            .catch((e) => bgConsole.log(e));
    };

    return (
        <div className={'cookies-widget'}>
            <CookieRows
                cookiesState={cookies}
                cookiesChildren={cookiesChildren}
            />
        </div>
    );
};

export default CookieWidget;
