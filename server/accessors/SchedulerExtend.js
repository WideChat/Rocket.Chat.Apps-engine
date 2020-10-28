"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SchedulerExtend {
    constructor(manager, appId) {
        this.manager = manager;
        this.appId = appId;
    }
    registerProcessors(processors = []) {
        this.manager.registerProcessors(processors, this.appId);
    }
}
exports.SchedulerExtend = SchedulerExtend;

//# sourceMappingURL=SchedulerExtend.js.map
