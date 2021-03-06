import { ILoggerStorageEntry } from '../logging';
import { AppConsole } from '../logging/AppConsole';
export interface IAppLogStorageFindOptions {
    sort?: {
        [field: string]: number;
    };
    skip?: number;
    limit?: number;
    fields?: {
        [field: string]: number;
    };
}
export declare abstract class AppLogStorage {
    private readonly engine;
    constructor(engine: string);
    getEngine(): string;
    abstract find(query: {
        [field: string]: any;
    }, options?: IAppLogStorageFindOptions): Promise<Array<ILoggerStorageEntry>>;
    abstract storeEntries(appId: string, logger: AppConsole): Promise<ILoggerStorageEntry>;
    abstract getEntriesFor(appId: string): Promise<Array<ILoggerStorageEntry>>;
    abstract removeEntriesFor(appId: string): Promise<void>;
}
