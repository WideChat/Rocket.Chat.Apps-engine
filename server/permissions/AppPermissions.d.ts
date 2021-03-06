import { INetworkingPermission, IPermission, IWorkspaceTokenPermission } from '../../definition/permissions/IPermission';
/**
 * @description
 *
 * App Permission naming rules:
 *
 * 'scope-name': {
 *    'permission-name': { name: 'scope-name.permission-name' }
 * }
 *
 * You can retrive this permission by using:
 * AppPermissions['scope-name']['permission-name'] -> { name: 'scope-name.permission-name' }
 *
 * @example
 *
 * AppPermissions.upload.read // { name: 'upload.read', domains: [] }
 */
export declare const AppPermissions: {
    user: {
        read: {
            name: string;
        };
        write: {
            name: string;
        };
    };
    upload: {
        read: {
            name: string;
        };
        write: {
            name: string;
        };
    };
    ui: {
        interaction: {
            name: string;
        };
    };
    setting: {
        read: {
            name: string;
        };
        write: {
            name: string;
        };
    };
    room: {
        read: {
            name: string;
        };
        write: {
            name: string;
        };
    };
    message: {
        read: {
            name: string;
        };
        write: {
            name: string;
        };
    };
    'livechat-status': {
        read: {
            name: string;
        };
    };
    'livechat-custom-fields': {
        write: {
            name: string;
        };
    };
    'livechat-visitor': {
        read: {
            name: string;
        };
        write: {
            name: string;
        };
    };
    'livechat-message': {
        read: {
            name: string;
        };
        write: {
            name: string;
        };
    };
    'livechat-room': {
        read: {
            name: string;
        };
        write: {
            name: string;
        };
    };
    'livechat-department': {
        read: {
            name: string;
        };
        write: {
            name: string;
        };
        multiple: {
            name: string;
        };
    };
    env: {
        read: {
            name: string;
        };
    };
    cloud: {
        'workspace-token': IWorkspaceTokenPermission;
    };
    scheduler: {
        default: {
            name: string;
        };
    };
    networking: {
        default: INetworkingPermission;
    };
    persistence: {
        default: {
            name: string;
        };
    };
    command: {
        default: {
            name: string;
        };
    };
    apis: {
        default: {
            name: string;
        };
    };
};
export declare const defaultPermissions: Array<IPermission>;
