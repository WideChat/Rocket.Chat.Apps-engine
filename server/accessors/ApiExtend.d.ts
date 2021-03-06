import { IApiExtend } from '../../definition/accessors';
import { IApi } from '../../definition/api';
import { AppApiManager } from '../managers/AppApiManager';
export declare class ApiExtend implements IApiExtend {
    private readonly manager;
    private readonly appId;
    constructor(manager: AppApiManager, appId: string);
    provideApi(api: IApi): Promise<void>;
}
