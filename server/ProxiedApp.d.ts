/// <reference types="node" />
import * as vm from 'vm';
import { IAppAccessors, ILogger } from '../definition/accessors';
import { App } from '../definition/App';
import { AppStatus } from '../definition/AppStatus';
import { IApp } from '../definition/IApp';
import { AppMethod, IAppAuthorInfo, IAppInfo } from '../definition/metadata';
import { AppManager } from './AppManager';
import { AppConsole } from './logging';
import { AppLicenseValidationResult } from './marketplace/license';
import { IAppStorageItem } from './storage';
export declare const ROCKETCHAT_APP_EXECUTION_PREFIX = "$RocketChat_App$";
export declare class ProxiedApp implements IApp {
    private readonly manager;
    private storageItem;
    private readonly app;
    private readonly customRequire;
    private previousStatus;
    private latestLicenseValidationResult;
    constructor(manager: AppManager, storageItem: IAppStorageItem, app: App, customRequire: (mod: string) => {});
    getApp(): App;
    getStorageItem(): IAppStorageItem;
    setStorageItem(item: IAppStorageItem): void;
    getPreviousStatus(): AppStatus;
    getImplementationList(): {
        [inter: string]: boolean;
    };
    hasMethod(method: AppMethod): boolean;
    makeContext(data: object): vm.Context;
    setupLogger(method: AppMethod): AppConsole;
    runInContext(codeToRun: string, context: vm.Context): any;
    call(method: AppMethod, ...args: Array<any>): Promise<any>;
    getStatus(): AppStatus;
    setStatus(status: AppStatus, silent?: boolean): Promise<void>;
    getName(): string;
    getNameSlug(): string;
    getAppUserUsername(): string;
    getID(): string;
    getVersion(): string;
    getDescription(): string;
    getRequiredApiVersion(): string;
    getAuthorInfo(): IAppAuthorInfo;
    getInfo(): IAppInfo;
    getLogger(): ILogger;
    getAccessors(): IAppAccessors;
    getEssentials(): IAppInfo['essentials'];
    getLatestLicenseValidationResult(): AppLicenseValidationResult;
    validateLicense(): Promise<void>;
}
