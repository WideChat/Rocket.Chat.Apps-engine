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
exports.Notifier = void 0;
const INotifier_1 = require("../../definition/accessors/INotifier");
const MessageBuilder_1 = require("./MessageBuilder");
class Notifier {
    constructor(userBridge, msgBridge, appId) {
        this.userBridge = userBridge;
        this.msgBridge = msgBridge;
        this.appId = appId;
    }
    notifyUser(user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.sender || !message.sender.id) {
                const appUser = yield this.userBridge.getAppUser(this.appId);
                message.sender = appUser;
            }
            yield this.msgBridge.notifyUser(user, message, this.appId);
        });
    }
    notifyRoom(room, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.sender || !message.sender.id) {
                const appUser = yield this.userBridge.getAppUser(this.appId);
                message.sender = appUser;
            }
            yield this.msgBridge.notifyRoom(room, message, this.appId);
        });
    }
    typing(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options.scope = options.scope || INotifier_1.TypingScope.Room;
            if (!options.username) {
                const appUser = yield this.userBridge.getAppUser(this.appId);
                options.username = appUser && appUser.name || '';
            }
            this.msgBridge.typing(Object.assign(Object.assign({}, options), { isTyping: true }), this.appId);
            return () => this.msgBridge.typing(Object.assign(Object.assign({}, options), { isTyping: false }), this.appId);
        });
    }
    stopTyping(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options.scope = options.scope || INotifier_1.TypingScope.Room;
            if (!options.username) {
                const appUser = yield this.userBridge.getAppUser(this.appId);
                options.username = appUser && appUser.name || '';
            }
            this.msgBridge.typing(Object.assign(Object.assign({}, options), { isTyping: false }), this.appId);
            return;
        });
    }
    getMessageBuilder() {
        return new MessageBuilder_1.MessageBuilder();
    }
}
exports.Notifier = Notifier;

//# sourceMappingURL=Notifier.js.map
