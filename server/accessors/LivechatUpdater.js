"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivechatUpdater = void 0;
class LivechatUpdater {
    constructor(bridges, appId) {
        this.bridges = bridges;
        this.appId = appId;
    }
    transferVisitor(visitor, transferData) {
        return this.bridges.getLivechatBridge().transferVisitor(visitor, transferData, this.appId);
    }
    closeRoom(room, comment) {
        return this.bridges.getLivechatBridge().closeRoom(room, comment, this.appId);
    }
    setCustomFields(token, key, value, overwrite) {
        return this.bridges.getLivechatBridge().setCustomFields({ token, key, value, overwrite }, this.appId)
            .then((result) => result > 0);
    }
}
exports.LivechatUpdater = LivechatUpdater;

//# sourceMappingURL=LivechatUpdater.js.map
