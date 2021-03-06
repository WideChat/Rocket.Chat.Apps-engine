import { ISchedulerExtend } from '../../definition/accessors';
import { IProcessor } from '../../definition/scheduler';
import { AppSchedulerManager } from '../managers/AppSchedulerManager';
export declare class SchedulerExtend implements ISchedulerExtend {
    private readonly manager;
    private readonly appId;
    constructor(manager: AppSchedulerManager, appId: string);
    registerProcessors(processors?: Array<IProcessor>): Promise<void>;
}
