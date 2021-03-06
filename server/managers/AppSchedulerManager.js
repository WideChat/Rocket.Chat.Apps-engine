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
exports.AppSchedulerManager = void 0;
const metadata_1 = require("../../definition/metadata");
function createProcessorId(jobId, appId) {
    return jobId.includes(`_${appId}`) ? jobId : `${jobId}_${appId}`;
}
class AppSchedulerManager {
    constructor(manager) {
        this.manager = manager;
        this.bridge = this.manager.getBridges().getSchedulerBridge();
        this.accessors = this.manager.getAccessorManager();
        this.registeredProcessors = new Map();
    }
    registerProcessors(processors = [], appId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.registeredProcessors.get(appId)) {
                this.registeredProcessors.set(appId, {});
            }
            yield this.bridge.registerProcessors(processors.map((processor) => {
                const processorId = createProcessorId(processor.id, appId);
                this.registeredProcessors.get(appId)[processorId] = processor;
                return {
                    id: processorId,
                    processor: this.wrapProcessor(appId, processorId).bind(this),
                    startupSetting: processor.startupSetting,
                };
            }), appId);
        });
    }
    wrapProcessor(appId, processorId) {
        return (jobContext) => __awaiter(this, void 0, void 0, function* () {
            const processor = this.registeredProcessors.get(appId)[processorId];
            if (!processor) {
                throw new Error(`Processor ${processorId} not available`);
            }
            const app = this.manager.getOneById(appId);
            const context = app.makeContext({
                processor,
                args: [
                    jobContext,
                    this.accessors.getReader(appId),
                    this.accessors.getModifier(appId),
                    this.accessors.getHttp(appId),
                    this.accessors.getPersistence(appId),
                ],
            });
            const logger = app.setupLogger(metadata_1.AppMethod._JOB_PROCESSOR);
            logger.debug(`Job processor ${processor.id} is being executed...`);
            try {
                const codeToRun = `processor.processor.apply(null, args)`;
                yield app.runInContext(codeToRun, context);
                logger.debug(`Job processor ${processor.id} was sucessfully executed`);
            }
            catch (e) {
                logger.error(e);
                logger.debug(`Job processor ${processor.id} was unsuccessful`);
                throw e;
            }
            finally {
                yield this.manager.getLogStorage().storeEntries(appId, logger);
            }
        });
    }
    scheduleOnce(job, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bridge.scheduleOnce(Object.assign(Object.assign({}, job), { id: createProcessorId(job.id, appId) }), appId);
        });
    }
    scheduleRecurring(job, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bridge.scheduleRecurring(Object.assign(Object.assign({}, job), { id: createProcessorId(job.id, appId) }), appId);
        });
    }
    cancelJob(jobId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bridge.cancelJob(createProcessorId(jobId, appId), appId);
        });
    }
    cancelAllJobs(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bridge.cancelAllJobs(appId);
        });
    }
    cancelJobByDataQuery(data, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bridge.cancelJobByDataQuery(data, appId);
        });
    }
}
exports.AppSchedulerManager = AppSchedulerManager;

//# sourceMappingURL=AppSchedulerManager.js.map
