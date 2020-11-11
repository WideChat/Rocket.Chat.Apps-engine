"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloneDeep = require("lodash.clonedeep");
const path = require("path");
const vm = require("vm");
var AllowedInternalModules;
(function (AllowedInternalModules) {
    AllowedInternalModules[AllowedInternalModules["path"] = 0] = "path";
    AllowedInternalModules[AllowedInternalModules["url"] = 1] = "url";
    AllowedInternalModules[AllowedInternalModules["crypto"] = 2] = "crypto";
    AllowedInternalModules[AllowedInternalModules["buffer"] = 3] = "buffer";
})(AllowedInternalModules || (AllowedInternalModules = {}));
class Utilities {
    static deepClone(item) {
        return cloneDeep(item);
    }
    static deepFreeze(item) {
        Object.freeze(item);
        Object.getOwnPropertyNames(item).forEach((prop) => {
            // tslint:disable-next-line:max-line-length
            if (item.hasOwnProperty(prop) && item[prop] !== null && (typeof item[prop] === 'object' || typeof item[prop] === 'function') && !Object.isFrozen(item[prop])) {
                Utilities.deepFreeze(item[prop]);
            }
        });
        return item;
    }
    static deepCloneAndFreeze(item) {
        return Utilities.deepFreeze(Utilities.deepClone(item));
    }
    /**
     * Keeps compatibility with apps compiled and stored in the database
     * with previous Apps-Engine versions
     */
    static transformFallbackModuleForCustomRequire(moduleName) {
        return path.normalize(moduleName).replace(/\.\.?\//g, '').replace(/^\//, '') + '.ts';
    }
    static transformModuleForCustomRequire(moduleName) {
        return path.normalize(moduleName).replace(/\.\.?\//g, '').replace(/^\//, '') + '.js';
    }
    static allowedInternalModuleRequire(moduleName) {
        return moduleName in AllowedInternalModules;
    }
    static buildCustomRequire(files, currentPath = '.') {
        return function _requirer(mod) {
            // Keep compatibility with apps importing apps-ts-definition
            if (mod.startsWith('@rocket.chat/apps-ts-definition/')) {
                mod = path.normalize(mod);
                mod = mod.replace('@rocket.chat/apps-ts-definition/', '../../definition/');
                return require(mod);
            }
            if (mod.startsWith('@rocket.chat/apps-engine/definition/')) {
                mod = path.normalize(mod);
                mod = mod.replace('@rocket.chat/apps-engine/definition/', '../../definition/');
                return require(mod);
            }
            if (Utilities.allowedInternalModuleRequire(mod)) {
                return require(mod);
            }
            if (currentPath !== '.') {
                mod = path.join(currentPath, mod);
            }
            const transformedModule = Utilities.transformModuleForCustomRequire(mod);
            const fallbackModule = Utilities.transformFallbackModuleForCustomRequire(mod);
            const filename = files[transformedModule] ? transformedModule : files[fallbackModule] ? fallbackModule : undefined;
            let fileExport;
            if (filename) {
                fileExport = {};
                const context = vm.createContext({
                    require: Utilities.buildCustomRequire(files, path.dirname(filename) + '/'),
                    console,
                    exports: fileExport,
                    process: {},
                });
                vm.runInContext(files[filename], context);
            }
            return fileExport;
        };
    }
}
exports.Utilities = Utilities;

//# sourceMappingURL=Utilities.js.map