"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByAppId = exports.AppManager = void 0;
const AppStatus_1 = require("../definition/AppStatus");
const metadata_1 = require("../definition/metadata");
const users_1 = require("../definition/users");
const bridges_1 = require("./bridges");
const compiler_1 = require("./compiler");
const errors_1 = require("./errors");
const managers_1 = require("./managers");
const AppPermissionManager_1 = require("./managers/AppPermissionManager");
const DisabledApp_1 = require("./misc/DisabledApp");
const AppPermissions_1 = require("./permissions/AppPermissions");
const ProxiedApp_1 = require("./ProxiedApp");
const storage_1 = require("./storage");
class AppManager {
    constructor(rlStorage, logStorage, rlBridges) {
        // Singleton style. There can only ever be one AppManager instance
        if (typeof AppManager.Instance !== 'undefined') {
            throw new Error('There is already a valid AppManager instance.');
        }
        if (rlStorage instanceof storage_1.AppStorage) {
            this.storage = rlStorage;
        }
        else {
            throw new Error('Invalid instance of the AppStorage.');
        }
        if (logStorage instanceof storage_1.AppLogStorage) {
            this.logStorage = logStorage;
        }
        else {
            throw new Error('Invalid instance of the AppLogStorage.');
        }
        if (rlBridges instanceof bridges_1.AppBridges) {
            this.bridges = rlBridges;
        }
        else {
            throw new Error('Invalid instance of the AppBridges');
        }
        this.apps = new Map();
        this.parser = new compiler_1.AppPackageParser();
        this.compiler = new compiler_1.AppCompiler();
        this.accessorManager = new managers_1.AppAccessorManager(this);
        this.listenerManager = new managers_1.AppListenerManager(this);
        this.commandManager = new managers_1.AppSlashCommandManager(this);
        this.apiManager = new managers_1.AppApiManager(this);
        this.externalComponentManager = new managers_1.AppExternalComponentManager();
        this.settingsManager = new managers_1.AppSettingsManager(this);
        this.licenseManager = new managers_1.AppLicenseManager(this);
        this.schedulerManager = new managers_1.AppSchedulerManager(this);
        this.isLoaded = false;
        AppManager.Instance = this;
    }
    /** Gets the instance of the storage connector. */
    getStorage() {
        return this.storage;
    }
    /** Gets the instance of the log storage connector. */
    getLogStorage() {
        return this.logStorage;
    }
    /** Gets the instance of the App package parser. */
    getParser() {
        return this.parser;
    }
    /** Gets the compiler instance. */
    getCompiler() {
        return this.compiler;
    }
    /** Gets the accessor manager instance. */
    getAccessorManager() {
        return this.accessorManager;
    }
    /** Gets the instance of the Bridge manager. */
    getBridges() {
        const handler = {
            get(target, prop, receiver) {
                const reflection = Reflect.get(target, prop, receiver);
                if (typeof prop === 'symbol' || typeof prop === 'number') {
                    return reflection;
                }
                if (typeof target[prop] === 'function' && /^get.+Bridge$/.test(prop)) {
                    return (...args) => {
                        const bridge = reflection.apply(target, args);
                        return AppPermissionManager_1.AppPermissionManager.proxy(bridge);
                    };
                }
                return reflection;
            },
        };
        return new Proxy(this.bridges, handler);
    }
    /** Gets the instance of the listener manager. */
    getListenerManager() {
        return this.listenerManager;
    }
    /** Gets the command manager's instance. */
    getCommandManager() {
        return this.commandManager;
    }
    getLicenseManager() {
        return this.licenseManager;
    }
    /** Gets the api manager's instance. */
    getApiManager() {
        return this.apiManager;
    }
    /** Gets the external component manager's instance. */
    getExternalComponentManager() {
        return this.externalComponentManager;
    }
    /** Gets the manager of the settings, updates and getting. */
    getSettingsManager() {
        return this.settingsManager;
    }
    getSchedulerManager() {
        return this.schedulerManager;
    }
    /** Gets whether the Apps have been loaded or not. */
    areAppsLoaded() {
        return this.isLoaded;
    }
    /**
     * Goes through the entire loading up process.
     * Expect this to take some time, as it goes through a very
     * long process of loading all the Apps up.
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            // You can not load the AppManager system again
            // if it has already been loaded.
            if (this.isLoaded) {
                return;
            }
            const items = yield this.storage.retrieveAll();
            const affs = new Array();
            for (const item of items.values()) {
                const aff = new compiler_1.AppFabricationFulfillment();
                try {
                    aff.setAppInfo(item.info);
                    aff.setImplementedInterfaces(item.implemented);
                    const app = this.getCompiler().toSandBox(this, item);
                    this.apps.set(item.id, app);
                    aff.setApp(app);
                }
                catch (e) {
                    console.warn(`Error while compiling the App "${item.info.name} (${item.id})":`);
                    console.error(e);
                    const app = DisabledApp_1.DisabledApp.createNew(item.info, AppStatus_1.AppStatus.COMPILER_ERROR_DISABLED);
                    app.getLogger().error(e);
                    this.logStorage.storeEntries(app.getID(), app.getLogger());
                    const prl = new ProxiedApp_1.ProxiedApp(this, item, app, () => '');
                    this.apps.set(item.id, prl);
                    aff.setApp(prl);
                }
                affs.push(aff);
            }
            // Let's initialize them
            for (const rl of this.apps.values()) {
                if (AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus())) {
                    // Usually if an App is disabled before it's initialized,
                    // then something (such as an error) occured while
                    // it was compiled or something similar.
                    continue;
                }
                yield this.initializeApp(items.get(rl.getID()), rl, false, true).catch(console.error);
            }
            // Let's ensure the required settings are all set
            for (const rl of this.apps.values()) {
                if (AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus())) {
                    continue;
                }
                if (!this.areRequiredSettingsSet(rl.getStorageItem())) {
                    yield rl.setStatus(AppStatus_1.AppStatus.INVALID_SETTINGS_DISABLED).catch(console.error);
                }
            }
            // Now let's enable the apps which were once enabled
            // but are not currently disabled.
            for (const app of this.apps.values()) {
                if (!AppStatus_1.AppStatusUtils.isDisabled(app.getStatus()) && AppStatus_1.AppStatusUtils.isEnabled(app.getPreviousStatus())) {
                    yield this.enableApp(items.get(app.getID()), app, true, app.getPreviousStatus() === AppStatus_1.AppStatus.MANUALLY_ENABLED).catch(console.error);
                }
                else if (!AppStatus_1.AppStatusUtils.isError(app.getStatus())) {
                    this.listenerManager.lockEssentialEvents(app);
                    yield this.schedulerManager.cancelAllJobs(app.getID());
                }
            }
            this.isLoaded = true;
            return affs;
        });
    }
    unload(isManual) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the AppManager hasn't been loaded yet, then
            // there is nothing to unload
            if (!this.isLoaded) {
                return;
            }
            for (const app of this.apps.values()) {
                if (app.getStatus() === AppStatus_1.AppStatus.INITIALIZED) {
                    this.listenerManager.unregisterListeners(app);
                    this.commandManager.unregisterCommands(app.getID());
                    this.externalComponentManager.unregisterExternalComponents(app.getID());
                    this.apiManager.unregisterApis(app.getID());
                    this.accessorManager.purifyApp(app.getID());
                    yield this.schedulerManager.cancelAllJobs(app.getID());
                }
                else if (!AppStatus_1.AppStatusUtils.isDisabled(app.getStatus())) {
                    yield this.disable(app.getID(), isManual ? AppStatus_1.AppStatus.MANUALLY_DISABLED : AppStatus_1.AppStatus.DISABLED);
                }
                this.listenerManager.releaseEssentialEvents(app);
            }
            // Remove all the apps from the system now that we have unloaded everything
            this.apps.clear();
            this.isLoaded = false;
        });
    }
    /** Gets the Apps which match the filter passed in. */
    get(filter) {
        let rls = new Array();
        if (typeof filter === 'undefined') {
            this.apps.forEach((rl) => rls.push(rl));
            return rls;
        }
        let nothing = true;
        if (typeof filter.enabled === 'boolean' && filter.enabled) {
            this.apps.forEach((rl) => {
                if (AppStatus_1.AppStatusUtils.isEnabled(rl.getStatus())) {
                    rls.push(rl);
                }
            });
            nothing = false;
        }
        if (typeof filter.disabled === 'boolean' && filter.disabled) {
            this.apps.forEach((rl) => {
                if (AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus())) {
                    rls.push(rl);
                }
            });
            nothing = false;
        }
        if (nothing) {
            this.apps.forEach((rl) => rls.push(rl));
        }
        if (typeof filter.ids !== 'undefined') {
            rls = rls.filter((rl) => filter.ids.includes(rl.getID()));
        }
        if (typeof filter.name === 'string') {
            rls = rls.filter((rl) => rl.getName() === filter.name);
        }
        else if (filter.name instanceof RegExp) {
            rls = rls.filter((rl) => filter.name.test(rl.getName()));
        }
        return rls;
    }
    /** Gets a single App by the id passed in. */
    getOneById(appId) {
        return this.apps.get(appId);
    }
    getPermissionsById(appId) {
        const app = this.apps.get(appId);
        if (!app) {
            return [];
        }
        const { permissionsGranted } = app.getStorageItem();
        return permissionsGranted || AppPermissions_1.defaultPermissions;
    }
    enable(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rl = this.apps.get(id);
            if (!rl) {
                throw new Error(`No App by the id "${id}" exists.`);
            }
            if (AppStatus_1.AppStatusUtils.isEnabled(rl.getStatus())) {
                return true;
            }
            if (rl.getStatus() === AppStatus_1.AppStatus.COMPILER_ERROR_DISABLED) {
                throw new Error('The App had compiler errors, can not enable it.');
            }
            const storageItem = yield this.storage.retrieveOne(id);
            if (!storageItem) {
                throw new Error(`Could not enable an App with the id of "${id}" as it doesn't exist.`);
            }
            const isSetup = yield this.runStartUpProcess(storageItem, rl, true, false);
            if (isSetup) {
                storageItem.status = rl.getStatus();
                // This is async, but we don't care since it only updates in the database
                // and it should not mutate any properties we care about
                yield this.storage.update(storageItem).catch();
            }
            return isSetup;
        });
    }
    disable(id, status = AppStatus_1.AppStatus.DISABLED, silent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!AppStatus_1.AppStatusUtils.isDisabled(status)) {
                throw new Error('Invalid disabled status');
            }
            const app = this.apps.get(id);
            if (!app) {
                throw new Error(`No App by the id "${id}" exists.`);
            }
            if (AppStatus_1.AppStatusUtils.isEnabled(app.getStatus())) {
                yield app.call(metadata_1.AppMethod.ONDISABLE, this.accessorManager.getConfigurationModify(app.getID()))
                    .catch((e) => console.warn('Error while disabling:', e));
            }
            this.listenerManager.unregisterListeners(app);
            this.listenerManager.lockEssentialEvents(app);
            this.commandManager.unregisterCommands(app.getID());
            this.externalComponentManager.unregisterExternalComponents(app.getID());
            this.apiManager.unregisterApis(app.getID());
            this.accessorManager.purifyApp(app.getID());
            yield this.schedulerManager.cancelAllJobs(app.getID());
            yield app.setStatus(status, silent);
            const storageItem = yield this.storage.retrieveOne(id);
            app.getStorageItem().marketplaceInfo = storageItem.marketplaceInfo;
            yield app.validateLicense().catch();
            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            storageItem.status = app.getStatus();
            yield this.storage.update(storageItem).catch();
            return true;
        });
    }
    add(appPackage, installationParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { enable = true, marketplaceInfo, permissionsGranted, user } = installationParameters;
            const aff = new compiler_1.AppFabricationFulfillment();
            const result = yield this.getParser().unpackageApp(appPackage);
            aff.setAppInfo(result.info);
            aff.setImplementedInterfaces(result.implemented.getValues());
            const compiled = {
                id: result.info.id,
                info: result.info,
                status: AppStatus_1.AppStatus.UNKNOWN,
                zip: appPackage.toString('base64'),
                // tslint:disable-next-line: max-line-length
                compiled: Object.entries(result.files).reduce((files, [key, value]) => (files[key.replace(/\./gi, '$')] = value, files), {}),
                languageContent: result.languageContent,
                settings: {},
                implemented: result.implemented.getValues(),
                marketplaceInfo,
                permissionsGranted,
            };
            // Now that is has all been compiled, let's get the
            // the App instance from the source.
            const app = this.getCompiler().toSandBox(this, compiled);
            // Create a user for the app
            try {
                yield this.createAppUser(app);
            }
            catch (err) {
                aff.setAppUserError({
                    username: app.getAppUserUsername(),
                    message: 'Failed to create an app user for this app.',
                });
                return aff;
            }
            const created = yield this.storage.create(compiled);
            if (!created) {
                aff.setStorageError('Failed to create the App, the storage did not return it.');
                yield this.removeAppUser(app);
                return aff;
            }
            this.apps.set(app.getID(), app);
            aff.setApp(app);
            // Let everyone know that the App has been added
            yield this.bridges.getAppActivationBridge().appAdded(app).catch(() => {
                // If an error occurs during this, oh well.
            });
            yield this.installApp(created, app, user);
            // Should enable === true, then we go through the entire start up process
            // Otherwise, we only initialize it.
            if (enable) {
                // Start up the app
                yield this.runStartUpProcess(created, app, false, false);
            }
            else {
                yield this.initializeApp(created, app, true);
            }
            return aff;
        });
    }
    remove(id, uninstallationParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = this.apps.get(id);
            const { user } = uninstallationParameters;
            yield this.uninstallApp(app, user);
            // Let everyone know that the App has been removed
            yield this.bridges.getAppActivationBridge().appRemoved(app).catch();
            if (AppStatus_1.AppStatusUtils.isEnabled(app.getStatus())) {
                yield this.disable(id);
            }
            this.listenerManager.unregisterListeners(app);
            this.listenerManager.releaseEssentialEvents(app);
            this.commandManager.unregisterCommands(app.getID());
            this.externalComponentManager.purgeExternalComponents(app.getID());
            this.apiManager.unregisterApis(app.getID());
            this.accessorManager.purifyApp(app.getID());
            yield this.removeAppUser(app);
            yield this.bridges.getPersistenceBridge().purge(app.getID());
            yield this.storage.remove(app.getID());
            yield this.schedulerManager.cancelAllJobs(app.getID());
            // Let everyone know that the App has been removed
            yield this.bridges.getAppActivationBridge().appRemoved(app);
            this.apps.delete(app.getID());
            return app;
        });
    }
    update(appPackage, permissionsGranted) {
        return __awaiter(this, void 0, void 0, function* () {
            const aff = new compiler_1.AppFabricationFulfillment();
            const result = yield this.getParser().unpackageApp(appPackage);
            aff.setAppInfo(result.info);
            aff.setImplementedInterfaces(result.implemented.getValues());
            const old = yield this.storage.retrieveOne(result.info.id);
            if (!old) {
                throw new Error('Can not update an App that does not currently exist.');
            }
            yield this.disable(old.id).catch();
            // TODO: We could show what new interfaces have been added
            const stored = yield this.storage.update({
                createdAt: old.createdAt,
                id: result.info.id,
                info: result.info,
                status: this.apps.get(old.id).getStatus(),
                zip: appPackage.toString('base64'),
                compiled: Object.entries(result.files).reduce((files, [key, value]) => (files[key.replace(/\./gi, '$')] = value, files), {}),
                languageContent: result.languageContent,
                settings: old.settings,
                implemented: result.implemented.getValues(),
                marketplaceInfo: old.marketplaceInfo,
                permissionsGranted,
            });
            // Now that is has all been compiled, let's get the
            // the App instance from the source.
            const app = this.getCompiler().toSandBox(this, stored);
            // Ensure there is an user for the app
            try {
                yield this.ensureAppUser(app);
            }
            catch (err) {
                aff.setAppUserError({
                    username: app.getAppUserUsername(),
                    message: 'Failed to create an app user for this app.',
                });
                return aff;
            }
            // Let everyone know that the App has been updated
            yield this.bridges.getAppActivationBridge().appUpdated(app).catch();
            // Store it temporarily so we can access it else where
            this.apps.set(app.getID(), app);
            aff.setApp(app);
            // Start up the app
            yield this.runStartUpProcess(stored, app, false, true);
            return aff;
        });
    }
    getLanguageContent() {
        const langs = {};
        this.apps.forEach((rl) => {
            const content = rl.getStorageItem().languageContent;
            Object.keys(content).forEach((key) => {
                langs[key] = Object.assign(langs[key] || {}, content[key]);
            });
        });
        return langs;
    }
    changeStatus(appId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (status) {
                case AppStatus_1.AppStatus.MANUALLY_DISABLED:
                case AppStatus_1.AppStatus.MANUALLY_ENABLED:
                    break;
                default:
                    throw new Error('Invalid status to change an App to, must be manually disabled or enabled.');
            }
            const rl = this.apps.get(appId);
            if (!rl) {
                throw new Error('Can not change the status of an App which does not currently exist.');
            }
            if (AppStatus_1.AppStatusUtils.isEnabled(status)) {
                // Then enable it
                if (AppStatus_1.AppStatusUtils.isEnabled(rl.getStatus())) {
                    throw new Error('Can not enable an App which is already enabled.');
                }
                yield this.enable(rl.getID());
            }
            else {
                if (!AppStatus_1.AppStatusUtils.isEnabled(rl.getStatus())) {
                    throw new Error('Can not disable an App which is not enabled.');
                }
                yield this.disable(rl.getID(), AppStatus_1.AppStatus.MANUALLY_DISABLED);
            }
            return rl;
        });
    }
    updateAppsMarketplaceInfo(appsOverview) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(appsOverview.map(({ latest: appInfo }) => __awaiter(this, void 0, void 0, function* () {
                if (!appInfo.subscriptionInfo) {
                    return;
                }
                const app = this.apps.get(appInfo.id);
                if (!app) {
                    return;
                }
                const appStorageItem = app.getStorageItem();
                const subscriptionInfo = appStorageItem.marketplaceInfo && appStorageItem.marketplaceInfo.subscriptionInfo;
                if (subscriptionInfo && subscriptionInfo.license.license === appInfo.subscriptionInfo.license.license) {
                    return;
                }
                appStorageItem.marketplaceInfo.subscriptionInfo = appInfo.subscriptionInfo;
                return this.storage.update(appStorageItem);
            }))).catch();
            const queue = [];
            this.apps.forEach((app) => queue.push(app.validateLicense()
                .then(() => {
                if (app.getStatus() !== AppStatus_1.AppStatus.INVALID_LICENSE_DISABLED) {
                    return;
                }
                return app.setStatus(AppStatus_1.AppStatus.DISABLED);
            })
                .catch((error) => {
                if (!(error instanceof errors_1.InvalidLicenseError)) {
                    console.error(error);
                    return;
                }
                this.commandManager.unregisterCommands(app.getID());
                this.externalComponentManager.unregisterExternalComponents(app.getID());
                this.apiManager.unregisterApis(app.getID());
                return app.setStatus(AppStatus_1.AppStatus.INVALID_LICENSE_DISABLED);
            })
                .then(() => {
                if (app.getStatus() === app.getPreviousStatus()) {
                    return;
                }
                const storageItem = app.getStorageItem();
                storageItem.status = app.getStatus();
                return this.storage.update(storageItem).catch(console.error);
            })));
            yield Promise.all(queue);
        });
    }
    /**
     * Goes through the entire loading up process. WARNING: Do not use. ;)
     *
     * @param appId the id of the application to load
     */
    loadOne(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.apps.get(appId)) {
                return this.apps.get(appId);
            }
            const item = yield this.storage.retrieveOne(appId);
            if (!item) {
                throw new Error(`No App found by the id of: "${appId}"`);
            }
            this.apps.set(item.id, this.getCompiler().toSandBox(this, item));
            const rl = this.apps.get(item.id);
            yield this.initializeApp(item, rl, false);
            if (!this.areRequiredSettingsSet(item)) {
                yield rl.setStatus(AppStatus_1.AppStatus.INVALID_SETTINGS_DISABLED);
            }
            if (!AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus()) && AppStatus_1.AppStatusUtils.isEnabled(rl.getPreviousStatus())) {
                yield this.enableApp(item, rl, false, rl.getPreviousStatus() === AppStatus_1.AppStatus.MANUALLY_ENABLED);
            }
            return this.apps.get(item.id);
        });
    }
    runStartUpProcess(storageItem, app, isManual, silenceStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.getStatus() !== AppStatus_1.AppStatus.INITIALIZED) {
                const isInitialized = yield this.initializeApp(storageItem, app, true, silenceStatus);
                if (!isInitialized) {
                    return false;
                }
            }
            if (!this.areRequiredSettingsSet(storageItem)) {
                yield app.setStatus(AppStatus_1.AppStatus.INVALID_SETTINGS_DISABLED, silenceStatus);
                return false;
            }
            return this.enableApp(storageItem, app, true, isManual, silenceStatus);
        });
    }
    installApp(storageItem, app, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            const read = this.getAccessorManager().getReader(storageItem.id);
            const http = this.getAccessorManager().getHttp(storageItem.id);
            const persistence = this.getAccessorManager().getPersistence(storageItem.id);
            const modifier = this.getAccessorManager().getModifier(storageItem.id);
            const context = { user };
            try {
                yield app.call(metadata_1.AppMethod.ONINSTALL, context, read, http, persistence, modifier);
                result = true;
            }
            catch (e) {
                const status = AppStatus_1.AppStatus.ERROR_DISABLED;
                if (e.name === 'NotEnoughMethodArgumentsError') {
                    app.getLogger().warn('Please report the following error:');
                }
                result = false;
                yield app.setStatus(status);
            }
            return result;
        });
    }
    initializeApp(storageItem, app, saveToDb = true, silenceStatus = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            const configExtend = this.getAccessorManager().getConfigurationExtend(storageItem.id);
            const envRead = this.getAccessorManager().getEnvironmentRead(storageItem.id);
            try {
                yield app.validateLicense();
                yield app.call(metadata_1.AppMethod.INITIALIZE, configExtend, envRead);
                yield app.setStatus(AppStatus_1.AppStatus.INITIALIZED, silenceStatus);
                result = true;
            }
            catch (e) {
                let status = AppStatus_1.AppStatus.ERROR_DISABLED;
                if (e.name === 'NotEnoughMethodArgumentsError') {
                    console.warn('Please report the following error:');
                }
                if (e instanceof errors_1.InvalidLicenseError) {
                    status = AppStatus_1.AppStatus.INVALID_LICENSE_DISABLED;
                }
                this.commandManager.unregisterCommands(storageItem.id);
                this.externalComponentManager.unregisterExternalComponents(storageItem.id);
                this.apiManager.unregisterApis(storageItem.id);
                yield this.schedulerManager.cancelAllJobs(storageItem.id);
                result = false;
                yield app.setStatus(status, silenceStatus);
            }
            if (saveToDb) {
                // This is async, but we don't care since it only updates in the database
                // and it should not mutate any properties we care about
                storageItem.status = app.getStatus();
                yield this.storage.update(storageItem).catch();
            }
            return result;
        });
    }
    /**
     * Determines if the App's required settings are set or not.
     * Should a packageValue be provided and not empty, then it's considered set.
     */
    areRequiredSettingsSet(storageItem) {
        let result = true;
        for (const setk of Object.keys(storageItem.settings)) {
            const sett = storageItem.settings[setk];
            // If it's not required, ignore
            if (!sett.required) {
                continue;
            }
            if (sett.value !== 'undefined' || sett.packageValue !== 'undefined') {
                continue;
            }
            result = false;
        }
        return result;
    }
    enableApp(storageItem, app, saveToDb = true, isManual, silenceStatus = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let enable;
            try {
                yield app.validateLicense();
                enable = (yield app.call(metadata_1.AppMethod.ONENABLE, this.getAccessorManager().getEnvironmentRead(storageItem.id), this.getAccessorManager().getConfigurationModify(storageItem.id)));
                yield app.setStatus(isManual ? AppStatus_1.AppStatus.MANUALLY_ENABLED : AppStatus_1.AppStatus.AUTO_ENABLED, silenceStatus);
            }
            catch (e) {
                enable = false;
                let status = AppStatus_1.AppStatus.ERROR_DISABLED;
                if (e.name === 'NotEnoughMethodArgumentsError') {
                    console.warn('Please report the following error:');
                }
                if (e instanceof errors_1.InvalidLicenseError) {
                    status = AppStatus_1.AppStatus.INVALID_LICENSE_DISABLED;
                }
                console.error(e);
                yield app.setStatus(status, silenceStatus);
            }
            if (enable) {
                this.commandManager.registerCommands(app.getID());
                this.externalComponentManager.registerExternalComponents(app.getID());
                this.apiManager.registerApis(app.getID());
                this.listenerManager.registerListeners(app);
                this.listenerManager.releaseEssentialEvents(app);
            }
            else {
                this.commandManager.unregisterCommands(app.getID());
                this.externalComponentManager.unregisterExternalComponents(app.getID());
                this.apiManager.unregisterApis(app.getID());
                this.listenerManager.lockEssentialEvents(app);
                yield this.schedulerManager.cancelAllJobs(app.getID());
            }
            if (saveToDb) {
                storageItem.status = app.getStatus();
                // This is async, but we don't care since it only updates in the database
                // and it should not mutate any properties we care about
                yield this.storage.update(storageItem).catch();
            }
            return enable;
        });
    }
    createAppUser(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const appUser = yield this.bridges.getUserBridge().getAppUser(app.getID());
            if (appUser) {
                return appUser.id;
            }
            const userData = {
                username: app.getAppUserUsername(),
                name: app.getInfo().name,
                roles: ['app'],
                appId: app.getID(),
                type: users_1.UserType.APP,
                status: 'online',
                isEnabled: true,
            };
            return this.bridges.getUserBridge().create(userData, app.getID(), {
                avatarUrl: app.getInfo().iconFileContent || app.getInfo().iconFile,
                joinDefaultChannels: true,
                sendWelcomeEmail: false,
            });
        });
    }
    removeAppUser(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const appUser = yield this.bridges.getUserBridge().getAppUser(app.getID());
            if (!appUser) {
                return true;
            }
            return this.bridges.getUserBridge().remove(appUser, app.getID());
        });
    }
    ensureAppUser(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const appUser = yield this.bridges.getUserBridge().getAppUser(app.getID());
            if (appUser) {
                return true;
            }
            return !!this.createAppUser(app);
        });
    }
    uninstallApp(app, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            const read = this.getAccessorManager().getReader(app.getID());
            const http = this.getAccessorManager().getHttp(app.getID());
            const persistence = this.getAccessorManager().getPersistence(app.getID());
            const modifier = this.getAccessorManager().getModifier(app.getID());
            const context = { user };
            try {
                yield app.call(metadata_1.AppMethod.ONUNINSTALL, context, read, http, persistence, modifier);
                result = true;
            }
            catch (e) {
                const status = AppStatus_1.AppStatus.ERROR_DISABLED;
                if (e.name === 'NotEnoughMethodArgumentsError') {
                    app.getLogger().warn('Please report the following error:');
                }
                result = false;
                yield app.setStatus(status);
            }
            return result;
        });
    }
}
exports.AppManager = AppManager;
const getPermissionsByAppId = (appId) => {
    if (!AppManager.Instance) {
        console.error('AppManager should be instantiated first');
        return [];
    }
    return AppManager.Instance.getPermissionsById(appId);
};
exports.getPermissionsByAppId = getPermissionsByAppId;

//# sourceMappingURL=AppManager.js.map
