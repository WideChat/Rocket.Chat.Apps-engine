"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInterface = void 0;
var AppInterface;
(function (AppInterface) {
    // Messages
    AppInterface["IPreMessageSentPrevent"] = "IPreMessageSentPrevent";
    AppInterface["IPreMessageSentExtend"] = "IPreMessageSentExtend";
    AppInterface["IPreMessageSentModify"] = "IPreMessageSentModify";
    AppInterface["IPostMessageSent"] = "IPostMessageSent";
    AppInterface["IPreMessageDeletePrevent"] = "IPreMessageDeletePrevent";
    AppInterface["IPostMessageDeleted"] = "IPostMessageDeleted";
    AppInterface["IPreMessageUpdatedPrevent"] = "IPreMessageUpdatedPrevent";
    AppInterface["IPreMessageUpdatedExtend"] = "IPreMessageUpdatedExtend";
    AppInterface["IPreMessageUpdatedModify"] = "IPreMessageUpdatedModify";
    AppInterface["IPostMessageUpdated"] = "IPostMessageUpdated";
    // Rooms
    AppInterface["IPreRoomCreatePrevent"] = "IPreRoomCreatePrevent";
    AppInterface["IPreRoomCreateExtend"] = "IPreRoomCreateExtend";
    AppInterface["IPreRoomCreateModify"] = "IPreRoomCreateModify";
    AppInterface["IPostRoomCreate"] = "IPostRoomCreate";
    AppInterface["IPreRoomDeletePrevent"] = "IPreRoomDeletePrevent";
    AppInterface["IPostRoomDeleted"] = "IPostRoomDeleted";
    AppInterface["IPreRoomUserJoined"] = "IPreRoomUserJoined";
    AppInterface["IPostRoomUserJoined"] = "IPostRoomUserJoined";
    AppInterface["IPreRoomUserLeave"] = "IPreRoomUserLeave";
    AppInterface["IPostRoomUserLeave"] = "IPostRoomUserLeave";
    AppInterface["IRoomUserTyping"] = "IRoomUserTyping";
    // External Components
    AppInterface["IPostExternalComponentOpened"] = "IPostExternalComponentOpened";
    AppInterface["IPostExternalComponentClosed"] = "IPostExternalComponentClosed";
    // Blocks
    AppInterface["IUIKitInteractionHandler"] = "IUIKitInteractionHandler";
    AppInterface["IUIKitLivechatInteractionHandler"] = "IUIKitLivechatInteractionHandler";
    // Livechat
    AppInterface["IPostLivechatRoomStarted"] = "IPostLivechatRoomStarted";
    AppInterface["IPostLivechatRoomClosed"] = "IPostLivechatRoomClosed";
    /**
     * @deprecated please use the AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED method
     */
    AppInterface["ILivechatRoomClosedHandler"] = "ILivechatRoomClosedHandler";
    AppInterface["IPostLivechatAgentAssigned"] = "IPostLivechatAgentAssigned";
    AppInterface["IPostLivechatAgentUnassigned"] = "IPostLivechatAgentUnassigned";
    AppInterface["IPostLivechatRoomTransferred"] = "IPostLivechatRoomTransferred";
    AppInterface["IPostLivechatGuestSaved"] = "IPostLivechatGuestSaved";
    AppInterface["IPostLivechatRoomSaved"] = "IPostLivechatRoomSaved";
    // FileUpload
    AppInterface["IPreFileUpload"] = "IPreFileUpload";
})(AppInterface = exports.AppInterface || (exports.AppInterface = {}));

//# sourceMappingURL=AppInterface.js.map
