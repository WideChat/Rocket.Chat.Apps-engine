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
exports.AppListenerManager = void 0;
const exceptions_1 = require("../../definition/exceptions");
const metadata_1 = require("../../definition/metadata");
const uikit_1 = require("../../definition/uikit");
const livechat_1 = require("../../definition/uikit/livechat");
const UIKitInteractionContext_1 = require("../../definition/uikit/UIKitInteractionContext");
const accessors_1 = require("../accessors");
const Message_1 = require("../messages/Message");
const Utilities_1 = require("../misc/Utilities");
const Room_1 = require("../rooms/Room");
class AppListenerManager {
    constructor(manager) {
        this.manager = manager;
        this.am = manager.getAccessorManager();
        this.listeners = new Map();
        this.lockedEvents = new Map();
        Object.keys(metadata_1.AppInterface).forEach((intt) => {
            this.listeners.set(intt, new Array());
            this.lockedEvents.set(intt, new Set());
        });
    }
    registerListeners(app) {
        this.unregisterListeners(app);
        Object.entries(app.getImplementationList()).forEach(([event, isImplemented]) => {
            if (!isImplemented) {
                return;
            }
            this.listeners.get(event).push(app.getID());
        });
    }
    unregisterListeners(app) {
        this.listeners.forEach((apps, int) => {
            if (apps.includes(app.getID())) {
                const where = apps.indexOf(app.getID());
                this.listeners.get(int).splice(where, 1);
            }
        });
    }
    releaseEssentialEvents(app) {
        if (!app.getEssentials()) {
            return;
        }
        app.getEssentials().forEach((event) => {
            const lockedEvent = this.lockedEvents.get(event);
            if (!lockedEvent) {
                return;
            }
            lockedEvent.delete(app.getID());
        });
    }
    lockEssentialEvents(app) {
        if (!app.getEssentials()) {
            return;
        }
        app.getEssentials().forEach((event) => {
            const lockedEvent = this.lockedEvents.get(event);
            if (!lockedEvent) {
                return;
            }
            lockedEvent.add(app.getID());
        });
    }
    getListeners(int) {
        const results = new Array();
        for (const appId of this.listeners.get(int)) {
            results.push(this.manager.getOneById(appId));
        }
        return results;
    }
    isEventBlocked(event) {
        const lockedEventList = this.lockedEvents.get(event);
        return !!(lockedEventList && lockedEventList.size);
    }
    executeListener(int, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEventBlocked(int)) {
                throw new exceptions_1.EssentialAppDisabledException('There is one or more apps that are essential to this event but are disabled');
            }
            switch (int) {
                // Messages
                case metadata_1.AppInterface.IPreMessageSentPrevent:
                    return this.executePreMessageSentPrevent(data);
                case metadata_1.AppInterface.IPreMessageSentExtend:
                    return this.executePreMessageSentExtend(data);
                case metadata_1.AppInterface.IPreMessageSentModify:
                    return this.executePreMessageSentModify(data);
                case metadata_1.AppInterface.IPostMessageSent:
                    this.executePostMessageSent(data);
                    return;
                case metadata_1.AppInterface.IPreMessageDeletePrevent:
                    return this.executePreMessageDeletePrevent(data);
                case metadata_1.AppInterface.IPostMessageDeleted:
                    this.executePostMessageDelete(data);
                    return;
                case metadata_1.AppInterface.IPreMessageUpdatedPrevent:
                    return this.executePreMessageUpdatedPrevent(data);
                case metadata_1.AppInterface.IPreMessageUpdatedExtend:
                    return this.executePreMessageUpdatedExtend(data);
                case metadata_1.AppInterface.IPreMessageUpdatedModify:
                    return this.executePreMessageUpdatedModify(data);
                case metadata_1.AppInterface.IPostMessageUpdated:
                    this.executePostMessageUpdated(data);
                    return;
                // Rooms
                case metadata_1.AppInterface.IPreRoomCreatePrevent:
                    return this.executePreRoomCreatePrevent(data);
                case metadata_1.AppInterface.IPreRoomCreateExtend:
                    return this.executePreRoomCreateExtend(data);
                case metadata_1.AppInterface.IPreRoomCreateModify:
                    return this.executePreRoomCreateModify(data);
                case metadata_1.AppInterface.IPostRoomCreate:
                    this.executePostRoomCreate(data);
                    return;
                case metadata_1.AppInterface.IPreRoomDeletePrevent:
                    return this.executePreRoomDeletePrevent(data);
                case metadata_1.AppInterface.IPostRoomDeleted:
                    this.executePostRoomDeleted(data);
                    return;
                case metadata_1.AppInterface.IPreRoomUserJoined:
                    return this.executePreRoomUserJoined(data);
                case metadata_1.AppInterface.IPostRoomUserJoined:
                    return this.executePostRoomUserJoined(data);
                case metadata_1.AppInterface.IPreRoomUserLeave:
                    return this.executePreRoomUserLeave(data);
                case metadata_1.AppInterface.IPostRoomUserLeave:
                    return this.executePostRoomUserLeave(data);
                case metadata_1.AppInterface.IRoomUserTyping:
                    return this.executeOnRoomUserTyping(data);
                // External Components
                case metadata_1.AppInterface.IPostExternalComponentOpened:
                    this.executePostExternalComponentOpened(data);
                    return;
                case metadata_1.AppInterface.IPostExternalComponentClosed:
                    this.executePostExternalComponentClosed(data);
                    return;
                case metadata_1.AppInterface.IUIKitInteractionHandler:
                    return this.executeUIKitInteraction(data);
                case metadata_1.AppInterface.IUIKitLivechatInteractionHandler:
                    return this.executeUIKitLivechatInteraction(data);
                // Livechat
                case metadata_1.AppInterface.IPostLivechatRoomStarted:
                    return this.executePostLivechatRoomStarted(data);
                /**
                 * @deprecated please prefer the AppInterface.IPostLivechatRoomClosed event
                 */
                case metadata_1.AppInterface.ILivechatRoomClosedHandler:
                    return this.executeLivechatRoomClosedHandler(data);
                case metadata_1.AppInterface.IPostLivechatRoomClosed:
                    return this.executePostLivechatRoomClosed(data);
                case metadata_1.AppInterface.IPostLivechatRoomSaved:
                    return this.executePostLivechatRoomSaved(data);
                case metadata_1.AppInterface.IPostLivechatAgentAssigned:
                    return this.executePostLivechatAgentAssigned(data);
                case metadata_1.AppInterface.IPostLivechatAgentUnassigned:
                    return this.executePostLivechatAgentUnassigned(data);
                case metadata_1.AppInterface.IPostLivechatRoomTransferred:
                    return this.executePostLivechatRoomTransferred(data);
                case metadata_1.AppInterface.IPostLivechatGuestSaved:
                    return this.executePostLivechatGuestSaved(data);
                // FileUpload
                case metadata_1.AppInterface.IPreFileUpload:
                    return this.executePreFileUpload(data);
                default:
                    console.warn('An invalid listener was called');
                    return;
            }
        });
    }
    // Messages
    executePreMessageSentPrevent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let prevented = false;
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreMessageSentPrevent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGESENTPREVENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGESENTPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGESENTPREVENT)) {
                    prevented = (yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGESENTPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                    if (prevented) {
                        return prevented;
                    }
                }
            }
            return prevented;
        });
    }
    executePreMessageSentExtend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = data;
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreMessageSentExtend)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGESENTEXTEND)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGESENTEXTEND, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGESENTEXTEND)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGESENTEXTEND, cfMsg, new accessors_1.MessageExtender(msg), // This mutates the passed in object
                    this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
            return msg;
        });
    }
    executePreMessageSentModify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = data;
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreMessageSentModify)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGESENTMODIFY)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGESENTMODIFY, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGESENTMODIFY)) {
                    msg = (yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGESENTMODIFY, cfMsg, new accessors_1.MessageBuilder(msg), this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                }
            }
            return data;
        });
    }
    executePostMessageSent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostMessageSent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPOSTMESSAGESENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPOSTMESSAGESENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTMESSAGESENT)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTMESSAGESENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
                }
            }
        });
    }
    executePreMessageDeletePrevent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let prevented = false;
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreMessageDeletePrevent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGEDELETEPREVENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGEDELETEPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGEDELETEPREVENT)) {
                    prevented = (yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGEDELETEPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                    if (prevented) {
                        return prevented;
                    }
                }
            }
            return prevented;
        });
    }
    executePostMessageDelete(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostMessageDeleted)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPOSTMESSAGEDELETED)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPOSTMESSAGEDELETED, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTMESSAGEDELETED)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTMESSAGEDELETED, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
                }
            }
        });
    }
    executePreMessageUpdatedPrevent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let prevented = false;
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreMessageUpdatedPrevent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGEUPDATEDPREVENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGEUPDATEDPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGEUPDATEDPREVENT)) {
                    prevented = (yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGEUPDATEDPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                    if (prevented) {
                        return prevented;
                    }
                }
            }
            return prevented;
        });
    }
    executePreMessageUpdatedExtend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = data;
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreMessageUpdatedExtend)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGEUPDATEDEXTEND)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGEUPDATEDEXTEND, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGEUPDATEDEXTEND)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGEUPDATEDEXTEND, cfMsg, new accessors_1.MessageExtender(msg), // This mutates the passed in object
                    this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
            return msg;
        });
    }
    executePreMessageUpdatedModify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = data;
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreMessageUpdatedModify)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREMESSAGEUPDATEDMODIFY)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREMESSAGEUPDATEDMODIFY, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREMESSAGEUPDATEDMODIFY)) {
                    msg = (yield app.call(metadata_1.AppMethod.EXECUTEPREMESSAGEUPDATEDMODIFY, cfMsg, new accessors_1.MessageBuilder(msg), this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                }
            }
            return data;
        });
    }
    executePostMessageUpdated(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfMsg = new Message_1.Message(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostMessageUpdated)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPOSTMESSAGEUPDATED)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPOSTMESSAGEUPDATED, cfMsg, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTMESSAGEUPDATED)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTMESSAGEUPDATED, cfMsg, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
                }
            }
        });
    }
    // Rooms
    executePreRoomCreatePrevent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfRoom = new Room_1.Room(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            let prevented = false;
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreRoomCreatePrevent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREROOMCREATEPREVENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREROOMCREATEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREROOMCREATEPREVENT)) {
                    prevented = (yield app.call(metadata_1.AppMethod.EXECUTEPREROOMCREATEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                    if (prevented) {
                        return prevented;
                    }
                }
            }
            return prevented;
        });
    }
    executePreRoomCreateExtend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = data;
            const cfRoom = new Room_1.Room(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreRoomCreateExtend)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREROOMCREATEEXTEND)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREROOMCREATEEXTEND, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREROOMCREATEEXTEND)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPREROOMCREATEEXTEND, cfRoom, new accessors_1.RoomExtender(room), // This mutates the passed in object
                    this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
            return data;
        });
    }
    executePreRoomCreateModify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let room = data;
            const cfRoom = new Room_1.Room(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreRoomCreateModify)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREROOMCREATEMODIFY)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREROOMCREATEMODIFY, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREROOMCREATEMODIFY)) {
                    room = (yield app.call(metadata_1.AppMethod.EXECUTEPREROOMCREATEMODIFY, cfRoom, new accessors_1.RoomBuilder(room), this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                }
            }
            return data;
        });
    }
    executePostRoomCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfRoom = new Room_1.Room(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostRoomCreate)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPOSTROOMCREATE)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPOSTROOMCREATE, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTROOMCREATE)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTROOMCREATE, cfRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    executePreRoomDeletePrevent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfRoom = new Room_1.Room(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            let prevented = false;
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreRoomDeletePrevent)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPREROOMDELETEPREVENT)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPREROOMDELETEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPREROOMDELETEPREVENT)) {
                    prevented = (yield app.call(metadata_1.AppMethod.EXECUTEPREROOMDELETEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId)));
                    if (prevented) {
                        return prevented;
                    }
                }
            }
            return prevented;
        });
    }
    executePostRoomDeleted(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfRoom = new Room_1.Room(Utilities_1.Utilities.deepCloneAndFreeze(data), this.manager);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostRoomDeleted)) {
                const app = this.manager.getOneById(appId);
                let continueOn = true;
                if (app.hasMethod(metadata_1.AppMethod.CHECKPOSTROOMDELETED)) {
                    continueOn = (yield app.call(metadata_1.AppMethod.CHECKPOSTROOMDELETED, cfRoom, this.am.getReader(appId), this.am.getHttp(appId)));
                }
                if (continueOn && app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTROOMDELETED)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTROOMDELETED, cfRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    executePreRoomUserJoined(externalData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Utilities_1.Utilities.deepClone(externalData);
            data.room = new Room_1.Room(Utilities_1.Utilities.deepFreeze(data.room), this.manager);
            Utilities_1.Utilities.deepFreeze(data.joiningUser);
            if (data.inviter) {
                Utilities_1.Utilities.deepFreeze(data.inviter);
            }
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreRoomUserJoined)) {
                const app = this.manager.getOneById(appId);
                if (app.hasMethod(metadata_1.AppMethod.EXECUTE_PRE_ROOM_USER_JOINED)) {
                    yield app.call(metadata_1.AppMethod.EXECUTE_PRE_ROOM_USER_JOINED, data, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    executePostRoomUserJoined(externalData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Utilities_1.Utilities.deepClone(externalData);
            data.room = new Room_1.Room(Utilities_1.Utilities.deepFreeze(data.room), this.manager);
            Utilities_1.Utilities.deepFreeze(data.joiningUser);
            if (data.inviter) {
                Utilities_1.Utilities.deepFreeze(data.inviter);
            }
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostRoomUserJoined)) {
                const app = this.manager.getOneById(appId);
                if (app.hasMethod(metadata_1.AppMethod.EXECUTE_POST_ROOM_USER_JOINED)) {
                    yield app.call(metadata_1.AppMethod.EXECUTE_POST_ROOM_USER_JOINED, data, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
                }
            }
        });
    }
    executePreRoomUserLeave(externalData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Utilities_1.Utilities.deepClone(externalData);
            data.room = new Room_1.Room(Utilities_1.Utilities.deepFreeze(data.room), this.manager);
            Utilities_1.Utilities.deepFreeze(data.leavingUser);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreRoomUserLeave)) {
                const app = this.manager.getOneById(appId);
                if (app.hasMethod(metadata_1.AppMethod.EXECUTE_PRE_ROOM_USER_LEAVE)) {
                    yield app.call(metadata_1.AppMethod.EXECUTE_PRE_ROOM_USER_LEAVE, data, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    executeOnRoomUserTyping(externalData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Utilities_1.Utilities.deepClone(externalData);
            Utilities_1.Utilities.deepFreeze(data.roomId);
            Utilities_1.Utilities.deepFreeze(data.typing);
            Utilities_1.Utilities.deepFreeze(data.username);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IRoomUserTyping)) {
                const app = this.manager.getOneById(appId);
                if (app.hasMethod(metadata_1.AppMethod.EXECUTE_ON_ROOM_USER_TYPING)) {
                    yield app.call(metadata_1.AppMethod.EXECUTE_ON_ROOM_USER_TYPING, data, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    executePostRoomUserLeave(externalData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Utilities_1.Utilities.deepClone(externalData);
            data.room = new Room_1.Room(Utilities_1.Utilities.deepFreeze(data.room), this.manager);
            Utilities_1.Utilities.deepFreeze(data.leavingUser);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostRoomUserLeave)) {
                const app = this.manager.getOneById(appId);
                if (app.hasMethod(metadata_1.AppMethod.EXECUTE_POST_ROOM_USER_LEAVE)) {
                    yield app.call(metadata_1.AppMethod.EXECUTE_POST_ROOM_USER_LEAVE, data, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
                }
            }
        });
    }
    // External Components
    executePostExternalComponentOpened(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfExternalComponent = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostExternalComponentOpened)) {
                const app = this.manager.getOneById(appId);
                if (app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTEXTERNALCOMPONENTOPENED)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTEXTERNALCOMPONENTOPENED, cfExternalComponent, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    executePostExternalComponentClosed(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfExternalComponent = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostExternalComponentClosed)) {
                const app = this.manager.getOneById(appId);
                if (app.hasMethod(metadata_1.AppMethod.EXECUTEPOSTEXTERNALCOMPONENTCLOSED)) {
                    yield app.call(metadata_1.AppMethod.EXECUTEPOSTEXTERNALCOMPONENTCLOSED, cfExternalComponent, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
                }
            }
        });
    }
    executeUIKitInteraction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { appId, type } = data;
            const method = ((interactionType) => {
                switch (interactionType) {
                    case uikit_1.UIKitIncomingInteractionType.BLOCK:
                        return metadata_1.AppMethod.UIKIT_BLOCK_ACTION;
                    case uikit_1.UIKitIncomingInteractionType.VIEW_SUBMIT:
                        return metadata_1.AppMethod.UIKIT_VIEW_SUBMIT;
                    case uikit_1.UIKitIncomingInteractionType.VIEW_CLOSED:
                        return metadata_1.AppMethod.UIKIT_VIEW_CLOSE;
                }
            })(type);
            const app = this.manager.getOneById(appId);
            if (!app.hasMethod(method)) {
                return;
            }
            const interactionContext = ((interactionType, interactionData) => {
                const { actionId, message, user, room, triggerId, container, } = interactionData;
                switch (interactionType) {
                    case uikit_1.UIKitIncomingInteractionType.BLOCK: {
                        const { value, blockId } = interactionData.payload;
                        return new UIKitInteractionContext_1.UIKitBlockInteractionContext({
                            appId,
                            actionId,
                            blockId,
                            user,
                            room,
                            triggerId,
                            value,
                            message,
                            container: container,
                        });
                    }
                    case uikit_1.UIKitIncomingInteractionType.VIEW_SUBMIT: {
                        const { view } = interactionData.payload;
                        return new UIKitInteractionContext_1.UIKitViewSubmitInteractionContext({
                            appId,
                            actionId,
                            view,
                            room,
                            triggerId,
                            user,
                        });
                    }
                    case uikit_1.UIKitIncomingInteractionType.VIEW_CLOSED: {
                        const { view, isCleared } = interactionData.payload;
                        return new UIKitInteractionContext_1.UIKitViewCloseInteractionContext({
                            appId,
                            actionId,
                            view,
                            room,
                            isCleared,
                            user,
                        });
                    }
                }
            })(type, data);
            return app.call(method, interactionContext, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
        });
    }
    executeUIKitLivechatInteraction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { appId, type } = data;
            const method = ((interactionType) => {
                switch (interactionType) {
                    case uikit_1.UIKitIncomingInteractionType.BLOCK:
                        return metadata_1.AppMethod.UIKIT_LIVECHAT_BLOCK_ACTION;
                }
            })(type);
            const app = this.manager.getOneById(appId);
            if (!app.hasMethod(method)) {
                return;
            }
            const interactionContext = ((interactionType, interactionData) => {
                const { actionId, message, visitor, room, triggerId, container, } = interactionData;
                switch (interactionType) {
                    case uikit_1.UIKitIncomingInteractionType.BLOCK: {
                        const { value, blockId } = interactionData.payload;
                        return new livechat_1.UIKitLivechatBlockInteractionContext({
                            appId,
                            actionId,
                            blockId,
                            visitor,
                            room,
                            triggerId,
                            value,
                            message,
                            container: container,
                        });
                    }
                }
            })(type, data);
            return app.call(method, interactionContext, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
        });
    }
    // Livechat
    executePostLivechatRoomStarted(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfLivechatRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostLivechatRoomStarted)) {
                const app = this.manager.getOneById(appId);
                if (!app.hasMethod(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_ROOM_STARTED)) {
                    continue;
                }
                yield app.call(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_ROOM_STARTED, cfLivechatRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
            }
        });
    }
    executeLivechatRoomClosedHandler(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfLivechatRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.ILivechatRoomClosedHandler)) {
                const app = this.manager.getOneById(appId);
                if (!app.hasMethod(metadata_1.AppMethod.EXECUTE_LIVECHAT_ROOM_CLOSED_HANDLER)) {
                    continue;
                }
                yield app.call(metadata_1.AppMethod.EXECUTE_LIVECHAT_ROOM_CLOSED_HANDLER, cfLivechatRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
            }
        });
    }
    executePostLivechatRoomClosed(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfLivechatRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostLivechatRoomClosed)) {
                const app = this.manager.getOneById(appId);
                if (!app.hasMethod(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED)) {
                    continue;
                }
                yield app.call(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED, cfLivechatRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
            }
        });
    }
    executePostLivechatAgentAssigned(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfLivechatRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostLivechatAgentAssigned)) {
                const app = this.manager.getOneById(appId);
                if (!app.hasMethod(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_AGENT_ASSIGNED)) {
                    continue;
                }
                yield app.call(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_AGENT_ASSIGNED, cfLivechatRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
            }
        });
    }
    executePostLivechatAgentUnassigned(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfLivechatRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostLivechatAgentUnassigned)) {
                const app = this.manager.getOneById(appId);
                if (!app.hasMethod(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_AGENT_UNASSIGNED)) {
                    continue;
                }
                yield app.call(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_AGENT_UNASSIGNED, cfLivechatRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
            }
        });
    }
    executePostLivechatRoomTransferred(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfLivechatRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostLivechatRoomTransferred)) {
                const app = this.manager.getOneById(appId);
                if (!app.hasMethod(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_ROOM_TRANSFERRED)) {
                    continue;
                }
                yield app.call(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_ROOM_TRANSFERRED, cfLivechatRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
            }
        });
    }
    executePostLivechatGuestSaved(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfLivechatRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostLivechatGuestSaved)) {
                const app = this.manager.getOneById(appId);
                if (!app.hasMethod(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_GUEST_SAVED)) {
                    continue;
                }
                yield app.call(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_GUEST_SAVED, cfLivechatRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
            }
        });
    }
    executePostLivechatRoomSaved(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cfLivechatRoom = Utilities_1.Utilities.deepCloneAndFreeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPostLivechatRoomSaved)) {
                const app = this.manager.getOneById(appId);
                if (!app.hasMethod(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_ROOM_SAVED)) {
                    continue;
                }
                yield app.call(metadata_1.AppMethod.EXECUTE_POST_LIVECHAT_ROOM_SAVED, cfLivechatRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
            }
        });
    }
    // FileUpload
    executePreFileUpload(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = Object.freeze(data);
            for (const appId of this.listeners.get(metadata_1.AppInterface.IPreFileUpload)) {
                const app = this.manager.getOneById(appId);
                if (app.hasMethod(metadata_1.AppMethod.EXECUTE_PRE_FILE_UPLOAD)) {
                    yield app.call(metadata_1.AppMethod.EXECUTE_PRE_FILE_UPLOAD, context, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId), this.am.getModifier(appId));
                }
            }
        });
    }
}
exports.AppListenerManager = AppListenerManager;

//# sourceMappingURL=AppListenerManager.js.map
