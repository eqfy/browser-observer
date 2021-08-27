import { browser } from 'webextension-polyfill-ts';

export const getCurrUrl = async () =>
    (
        await browser.tabs.query({
            active: true,
            currentWindow: true,
        })
    )[0].url;
