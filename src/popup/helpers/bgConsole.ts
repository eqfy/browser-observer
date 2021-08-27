import { browser } from 'webextension-polyfill-ts';

declare global {
    interface Window {
        console: any;
    }
}

export default browser.extension.getBackgroundPage().console;
