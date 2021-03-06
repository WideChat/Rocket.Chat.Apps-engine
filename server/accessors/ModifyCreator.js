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
exports.ModifyCreator = void 0;
const metadata_1 = require("../../definition/metadata");
const rooms_1 = require("../../definition/rooms");
const uikit_1 = require("../../definition/uikit");
const DiscussionBuilder_1 = require("./DiscussionBuilder");
const LivechatCreator_1 = require("./LivechatCreator");
const LivechatMessageBuilder_1 = require("./LivechatMessageBuilder");
const MessageBuilder_1 = require("./MessageBuilder");
const RoomBuilder_1 = require("./RoomBuilder");
const UploadCreator_1 = require("./UploadCreator");
class ModifyCreator {
    constructor(bridges, appId) {
        this.bridges = bridges;
        this.appId = appId;
        this.livechatCreator = new LivechatCreator_1.LivechatCreator(bridges, appId);
        this.uploadCreator = new UploadCreator_1.UploadCreator(bridges, appId);
    }
    getLivechatCreator() {
        return this.livechatCreator;
    }
    getUploadCreator() {
        return this.uploadCreator;
    }
    getBlockBuilder() {
        return new uikit_1.BlockBuilder(this.appId);
    }
    startMessage(data) {
        if (data) {
            delete data.id;
        }
        return new MessageBuilder_1.MessageBuilder(data);
    }
    startLivechatMessage(data) {
        if (data) {
            delete data.id;
        }
        return new LivechatMessageBuilder_1.LivechatMessageBuilder(data);
    }
    startRoom(data) {
        if (data) {
            delete data.id;
        }
        return new RoomBuilder_1.RoomBuilder(data);
    }
    startDiscussion(data) {
        if (data) {
            delete data.id;
        }
        return new DiscussionBuilder_1.DiscussionBuilder(data);
    }
    finish(builder) {
        switch (builder.kind) {
            case metadata_1.RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case metadata_1.RocketChatAssociationModel.LIVECHAT_MESSAGE:
                return this._finishLivechatMessage(builder);
            case metadata_1.RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            case metadata_1.RocketChatAssociationModel.DISCUSSION:
                return this._finishDiscussion(builder);
            default:
                throw new Error('Invalid builder passed to the ModifyCreator.finish function.');
        }
    }
    _finishMessage(builder) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = builder.getMessage();
            delete result.id;
            if (!result.sender || !result.sender.id) {
                const appUser = yield this.bridges.getUserBridge().getAppUser(this.appId);
                if (!appUser) {
                    throw new Error('Invalid sender assigned to the message.');
                }
                result.sender = appUser;
            }
            return this.bridges.getMessageBridge().create(result, this.appId);
        });
    }
    _finishLivechatMessage(builder) {
        if (builder.getSender() && !builder.getVisitor()) {
            return this._finishMessage(builder.getMessageBuilder());
        }
        const result = builder.getMessage();
        delete result.id;
        if (!result.token && (!result.visitor || !result.visitor.token)) {
            throw new Error('Invalid visitor sending the message');
        }
        result.token = result.visitor ? result.visitor.token : result.token;
        return this.bridges.getLivechatBridge().createMessage(result, this.appId);
    }
    _finishRoom(builder) {
        const result = builder.getRoom();
        delete result.id;
        if (!result.type) {
            throw new Error('Invalid type assigned to the room.');
        }
        if (result.type !== rooms_1.RoomType.LIVE_CHAT) {
            if (!result.creator || !result.creator.id) {
                throw new Error('Invalid creator assigned to the room.');
            }
        }
        if (result.type !== rooms_1.RoomType.DIRECT_MESSAGE) {
            if (result.type !== rooms_1.RoomType.LIVE_CHAT) {
                if (!result.slugifiedName || !result.slugifiedName.trim()) {
                    throw new Error('Invalid slugifiedName assigned to the room.');
                }
            }
            if (!result.displayName || !result.displayName.trim()) {
                throw new Error('Invalid displayName assigned to the room.');
            }
        }
        return this.bridges.getRoomBridge().create(result, builder.getMembersToBeAddedUsernames(), this.appId);
    }
    _finishDiscussion(builder) {
        const room = builder.getRoom();
        delete room.id;
        if (!room.creator || !room.creator.id) {
            throw new Error('Invalid creator assigned to the discussion.');
        }
        if (!room.slugifiedName || !room.slugifiedName.trim()) {
            throw new Error('Invalid slugifiedName assigned to the discussion.');
        }
        if (!room.displayName || !room.displayName.trim()) {
            throw new Error('Invalid displayName assigned to the discussion.');
        }
        if (!room.parentRoom || !room.parentRoom.id) {
            throw new Error('Invalid parentRoom assigned to the discussion.');
        }
        return this.bridges.getRoomBridge().createDiscussion(room, builder.getParentMessage(), builder.getReply(), builder.getMembersToBeAddedUsernames(), this.appId);
    }
}
exports.ModifyCreator = ModifyCreator;

//# sourceMappingURL=ModifyCreator.js.map
