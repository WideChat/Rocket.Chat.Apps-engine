/// <reference types="node" />
import { AllowedInternalModules } from '../compiler/modules';
export declare class Utilities {
    static deepClone<T>(item: T): T;
    static deepFreeze<T>(item: any): T;
    static deepCloneAndFreeze<T>(item: T): T;
    /**
     * Keeps compatibility with apps compiled and stored in the database
     * with previous Apps-Engine versions
     */
    static transformFallbackModuleForCustomRequire(moduleName: string): string;
    static transformModuleForCustomRequire(moduleName: string): string;
    static allowedInternalModuleRequire(moduleName: string): moduleName is AllowedInternalModules;
    static shouldLog(setting: number, level: number): boolean;
    static getConsole(setting?: number): {
        debug: (...args: any) => void;
        log: (...args: any) => void;
        info: (...args: any) => void;
        warn: (...args: any) => void;
        error: (...args: any) => void;
        memory: any;
        assert(condition?: boolean, ...data: any[]): void;
        assert(value: any, message?: string, ...optionalParams: any[]): void;
        clear(): void;
        clear(): void;
        count(label?: string): void;
        count(label?: string): void;
        countReset(label?: string): void;
        countReset(label?: string): void;
        dir(item?: any, options?: any): void;
        dir(obj: any, options?: NodeJS.InspectOptions): void;
        dirxml(...data: any[]): void;
        dirxml(...data: any[]): void;
        exception(message?: string, ...optionalParams: any[]): void;
        group(...data: any[]): void;
        group(...label: any[]): void;
        groupCollapsed(...data: any[]): void;
        groupCollapsed(...label: any[]): void;
        groupEnd(): void;
        groupEnd(): void;
        table(tabularData?: any, properties?: string[]): void;
        table(tabularData: any, properties?: string[]): void;
        time(label?: string): void;
        time(label?: string): void;
        timeEnd(label?: string): void;
        timeEnd(label?: string): void;
        timeLog(label?: string, ...data: any[]): void;
        timeLog(label?: string, ...data: any[]): void;
        timeStamp(label?: string): void;
        timeStamp(label?: string): void;
        trace(...data: any[]): void;
        trace(message?: any, ...optionalParams: any[]): void;
        Console: NodeJS.ConsoleConstructor;
        markTimeline(label?: string): void;
        profile(label?: string): void;
        profileEnd(label?: string): void;
        timeline(label?: string): void;
        timelineEnd(label?: string): void;
    };
    static buildCustomRequire(files: {
        [s: string]: string;
    }, appId: string, logSetting?: number, currentPath?: string): (mod: string) => {};
}
