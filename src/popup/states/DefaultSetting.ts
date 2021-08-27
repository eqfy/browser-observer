import { AppCookieDetails } from './CookieState';

export const defaultCookieSetting: AppCookieDetails[] = [
    {
        name: 'OTSESSIONAABQRN',
        appId: 'OTSESSIONAABQRN',
        url: '',
    },
    {
        name: 'OTSESSIONAABQRD',
        appId: 'OTSESSIONAABQRD',
        url: '',
    },
    {
        name: 'JWT',
        appId: 'JWT',
        url: '',
        options: {
            specialInstruction: 'JWT',
            children: [
                {
                    path: ['sub'],
                    name: 'UserUUID',
                },
                {
                    path: ['company'],
                    name: 'CompanyUUID',
                },
                {
                    path: ['act', 'context'],
                    name: 'ActingAsType',
                },
                {
                    path: ['act', 'sub'],
                    name: 'ProxiedUserUUID',
                },
                {
                    path: ['act', 'company'],
                    name: 'ProxiedCompanyUUID',
                },
            ],
        },
    },
    {
        name: 'route',
        appId: 'route',
        url: '',
        options: {
            editable: true,
        },
    },
];

export enum EnvironmentType {
    INTEGRATION = 'INTEGRATION',
    TEST = 'TEST',
}

export interface SessionAttribute {
    name: string;
    type: 'JSON' | 'string';
    separator?: string;
    pinned?: boolean; // If a session attribute is pinned, it will show up as the only thing in the SessionWidget
}

export type SessionSetting = {
    [env in EnvironmentType]: string;
} & {
    currentEnvironment: EnvironmentType;
    attributes?: SessionAttribute[];
};

export const defaultSessionSetting: SessionSetting = {
    [EnvironmentType.INTEGRATION]: 'https://integration.com',
    [EnvironmentType.TEST]: 'https://test.com',
    currentEnvironment: EnvironmentType.INTEGRATION,
    attributes: [
        {
            name: 'UIPermissions',
            type: 'JSON',
            pinned: true,
        },
        {
            name: 'UserPermissions',
            type: 'string',
            separator: ',',
        },
        {
            name: 'RoleList',
            type: 'string',
            separator: ',',
        },
        {
            name: 'EntitySettings',
            type: 'string',
            separator: '|',
        },
    ],
};
