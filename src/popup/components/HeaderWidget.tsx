import { Button, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import React, {
    ChangeEventHandler,
    FunctionComponent,
    useRef,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import {
    setSetting,
    storeSettingIntoStorage,
    useDefaultSetting,
} from '../redux/setting';
import { setViewType, ViewType } from '../redux/view';
import '../styles/HeaderWidget.less';

const HeaderWidget: FunctionComponent = () => {
    const settingState = useAppSelector((state) => state.setting);
    const dispatch = useDispatch();

    const [showButton, setShowButton] = useState(false);

    const handleViewSettingClick = () => {
        dispatch(setViewType(ViewType.SETTING));
    };

    const handleExportSettingClick = () => {
        const settingFileName = 'setting.json';
        const jsonFile = new File(
            [JSON.stringify(settingState)],
            settingFileName,
            { type: 'application/json' }
        );
        const fileURL = URL.createObjectURL(jsonFile);
        const link = document.createElement('a');
        link.setAttribute('href', fileURL);
        link.setAttribute('download', settingFileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const inputEl = useRef<HTMLInputElement>(null);
    const handleImportSettingClick = () => {
        if (inputEl && inputEl.current) {
            inputEl.current.click();
        }
    };
    const handleSettingImport: ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;
        fileList[0].text().then((value) => {
            const setting = JSON.parse(value);
            dispatch(setSetting(setting));
        });
    };

    const handleDefaultSettingClick = () => {
        dispatch(useDefaultSetting());
        dispatch(storeSettingIntoStorage());
    };

    const handleViewSessionClick = () => {
        dispatch(setViewType(ViewType.SESSION));
    };

    const handleSettingButtonClick = () => {
        setShowButton((prevState) => !prevState);
    };

    return (
        <div className="header-widget">
            {showButton ? (
                <>
                    <Button
                        onClick={handleViewSettingClick}
                        size="small"
                        className="header-btn"
                    >
                        View settings
                    </Button>{' '}
                    <Button
                        onClick={handleExportSettingClick}
                        size="small"
                        className="header-btn"
                    >
                        Export settings
                    </Button>{' '}
                    <Button
                        onClick={handleImportSettingClick}
                        size="small"
                        className="header-btn"
                    >
                        Import settings
                        <input
                            ref={inputEl}
                            accept="application/json"
                            type="file"
                            className="import-input"
                            onChange={handleSettingImport}
                        />
                    </Button>{' '}
                    <Button
                        onClick={handleDefaultSettingClick}
                        size="small"
                        className="header-btn"
                    >
                        Use default settings
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        onClick={handleViewSessionClick}
                        size="small"
                        className="header-btn"
                    >
                        View session
                    </Button>{' '}
                </>
            )}
            <IconButton onClick={handleSettingButtonClick} size="small">
                <SettingsIcon />
            </IconButton>
        </div>
    );
};

export default HeaderWidget;
