import { IAppAccessors, IEnvironmentRead, IHttp, IRead } from '../../definition/accessors';
import { IApiEndpointMetadata } from '../../definition/api';
import { AppManager } from '../AppManager';
export declare class AppAccessors implements IAppAccessors {
    private readonly appId;
    private accessorManager;
    private apiManager;
    constructor(manager: AppManager, appId: string);
    get environmentReader(): IEnvironmentRead;
    get reader(): IRead;
    get http(): IHttp;
    get providedApiEndpoints(): Array<IApiEndpointMetadata>;
}
