export interface CookieObjectChild {
    path: string[];
    name?: string;
}

export interface AppCookieOptions {
    editable?: boolean;
    children?: CookieObjectChild[];
    specialInstruction?: string;
}

type AppCookieWrapper<T> = {
    [P in keyof T]: T[P];
} & {
    options?: AppCookieOptions;
    url?: string;
    appId: string;
};

export type AppCookieDetails = AppCookieWrapper<chrome.cookies.Details>;
export type AppCookie = AppCookieWrapper<chrome.cookies.Cookie>;
