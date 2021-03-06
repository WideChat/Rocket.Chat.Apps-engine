import { IModify, IModifyCreator, IModifyDeleter, IModifyExtender, IModifyUpdater, INotifier, ISchedulerModify, IUIController } from '../../definition/accessors';
import { AppBridges } from '../bridges';
export declare class Modify implements IModify {
    private readonly bridges;
    private readonly appId;
    private creator;
    private deleter;
    private updater;
    private extender;
    private notifier;
    private uiController;
    private scheduler;
    constructor(bridges: AppBridges, appId: string);
    getCreator(): IModifyCreator;
    getDeleter(): IModifyDeleter;
    getUpdater(): IModifyUpdater;
    getExtender(): IModifyExtender;
    getNotifier(): INotifier;
    getUiController(): IUIController;
    getScheduler(): ISchedulerModify;
}
