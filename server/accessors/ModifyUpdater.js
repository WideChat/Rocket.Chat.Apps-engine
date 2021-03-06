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
exports.ModifyUpdater = void 0;
const metadata_1 = require("../../definition/metadata");
const rooms_1 = require("../../definition/rooms");
const LivechatUpdater_1 = require("./LivechatUpdater");
const MessageBuilder_1 = require("./MessageBuilder");
const RoomBuilder_1 = require("./RoomBuilder");
const UserUpdater_1 = require("./UserUpdater");
class ModifyUpdater {
    constructor(bridges, appId) {
        this.bridges = bridges;
        this.appId = appId;
        this.livechatUpdater = new LivechatUpdater_1.LivechatUpdater(this.bridges, this.appId);
        this.userUpdater = new UserUpdater_1.UserUpdater(this.bridges, this.appId);
    }
    getLivechatUpdater() {
        return this.livechatUpdater;
    }
    getUserUpdater() {
        return this.userUpdater;
    }
    message(messageId, updater) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield this.bridges.getMessageBridge().getById(messageId, this.appId);
            return new MessageBuilder_1.MessageBuilder(msg);
        });
    }
    room(roomId, updater) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.bridges.getRoomBridge().getById(roomId, this.appId);
            return new RoomBuilder_1.RoomBuilder(room);
        });
    }
    finish(builder) {
        switch (builder.kind) {
            case metadata_1.RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case metadata_1.RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            default:
                throw new Error('Invalid builder passed to the ModifyUpdater.finish function.');
        }
    }
    _finishMessage(builder) {
        const result = builder.getMessage();
        if (!result.id) {
            throw new Error('Invalid message, can\'t update a message without an id.');
        }
        if (!result.sender || !result.sender.id) {
            throw new Error('Invalid sender assigned to the message.');
        }
        return this.bridges.getMessageBridge().update(result, this.appId);
    }
    _finishRoom(builder) {
        const result = builder.getRoom();
        if (!result.id) {
            throw new Error('Invalid room, can not update a room without an id.');
        }
        if (!result.type) {
            throw new Error('Invalid type assigned to the room.');
        }
        if (result.type !== rooms_1.RoomType.LIVE_CHAT) {
            if (!result.creator || !result.creator.id) {
                throw new Error('Invalid creator assigned to the room.');
            }
            if (!result.slugifiedName || !result.slugifiedName.trim()) {
                throw new Error('Invalid slugifiedName assigned to the room.');
            }
        }
        if (!result.displayName || !result.displayName.trim()) {
            throw new Error('Invalid displayName assigned to the room.');
        }
        return this.bridges.getRoomBridge().update(result, builder.getMembersToBeAddedUsernames(), this.appId);
    }
}
exports.ModifyUpdater = ModifyUpdater;

//# sourceMappingURL=ModifyUpdater.js.map
