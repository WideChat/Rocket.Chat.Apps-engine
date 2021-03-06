"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppMethod = void 0;
var AppMethod;
(function (AppMethod) {
    AppMethod["_API_EXECUTOR"] = "apiExecutor";
    AppMethod["_CONSTRUCTOR"] = "constructor";
    AppMethod["_COMMAND_EXECUTOR"] = "executor";
    AppMethod["_COMMAND_PREVIEWER"] = "previewer";
    AppMethod["_COMMAND_PREVIEW_EXECUTOR"] = "executePreviewItem";
    AppMethod["_JOB_PROCESSOR"] = "jobProcessor";
    AppMethod["INITIALIZE"] = "initialize";
    AppMethod["ONENABLE"] = "onEnable";
    AppMethod["ONDISABLE"] = "onDisable";
    AppMethod["ONINSTALL"] = "onInstall";
    AppMethod["ONUNINSTALL"] = "onUninstall";
    AppMethod["ONSETTINGUPDATED"] = "onSettingUpdated";
    AppMethod["SETSTATUS"] = "setStatus";
    // Message handlers
    AppMethod["CHECKPREMESSAGESENTPREVENT"] = "checkPreMessageSentPrevent";
    AppMethod["EXECUTEPREMESSAGESENTPREVENT"] = "executePreMessageSentPrevent";
    AppMethod["CHECKPREMESSAGESENTEXTEND"] = "checkPreMessageSentExtend";
    AppMethod["EXECUTEPREMESSAGESENTEXTEND"] = "executePreMessageSentExtend";
    AppMethod["CHECKPREMESSAGESENTMODIFY"] = "checkPreMessageSentModify";
    AppMethod["EXECUTEPREMESSAGESENTMODIFY"] = "executePreMessageSentModify";
    AppMethod["CHECKPOSTMESSAGESENT"] = "checkPostMessageSent";
    AppMethod["EXECUTEPOSTMESSAGESENT"] = "executePostMessageSent";
    AppMethod["CHECKPREMESSAGEDELETEPREVENT"] = "checkPreMessageDeletePrevent";
    AppMethod["EXECUTEPREMESSAGEDELETEPREVENT"] = "executePreMessageDeletePrevent";
    AppMethod["CHECKPOSTMESSAGEDELETED"] = "checkPostMessageDeleted";
    AppMethod["EXECUTEPOSTMESSAGEDELETED"] = "executePostMessageDeleted";
    AppMethod["CHECKPREMESSAGEUPDATEDPREVENT"] = "checkPreMessageUpdatedPrevent";
    AppMethod["EXECUTEPREMESSAGEUPDATEDPREVENT"] = "executePreMessageUpdatedPrevent";
    AppMethod["CHECKPREMESSAGEUPDATEDEXTEND"] = "checkPreMessageUpdatedExtend";
    AppMethod["EXECUTEPREMESSAGEUPDATEDEXTEND"] = "executePreMessageUpdatedExtend";
    AppMethod["CHECKPREMESSAGEUPDATEDMODIFY"] = "checkPreMessageUpdatedModify";
    AppMethod["EXECUTEPREMESSAGEUPDATEDMODIFY"] = "executePreMessageUpdatedModify";
    AppMethod["CHECKPOSTMESSAGEUPDATED"] = "checkPostMessageUpdated";
    AppMethod["EXECUTEPOSTMESSAGEUPDATED"] = "executePostMessageUpdated";
    // Room handlers
    AppMethod["CHECKPREROOMCREATEPREVENT"] = "checkPreRoomCreatePrevent";
    AppMethod["EXECUTEPREROOMCREATEPREVENT"] = "executePreRoomCreatePrevent";
    AppMethod["CHECKPREROOMCREATEEXTEND"] = "checkPreRoomCreateExtend";
    AppMethod["EXECUTEPREROOMCREATEEXTEND"] = "executePreRoomCreateExtend";
    AppMethod["CHECKPREROOMCREATEMODIFY"] = "checkPreRoomCreateModify";
    AppMethod["EXECUTEPREROOMCREATEMODIFY"] = "executePreRoomCreateModify";
    AppMethod["CHECKPOSTROOMCREATE"] = "checkPostRoomCreate";
    AppMethod["EXECUTEPOSTROOMCREATE"] = "executePostRoomCreate";
    AppMethod["CHECKPREROOMDELETEPREVENT"] = "checkPreRoomDeletePrevent";
    AppMethod["EXECUTEPREROOMDELETEPREVENT"] = "executePreRoomDeletePrevent";
    AppMethod["CHECKPOSTROOMDELETED"] = "checkPostRoomDeleted";
    AppMethod["EXECUTEPOSTROOMDELETED"] = "executePostRoomDeleted";
    AppMethod["EXECUTE_PRE_ROOM_USER_JOINED"] = "executePreRoomUserJoined";
    AppMethod["EXECUTE_POST_ROOM_USER_JOINED"] = "executePostRoomUserJoined";
    AppMethod["EXECUTE_PRE_ROOM_USER_LEAVE"] = "executePreRoomUserLeave";
    AppMethod["EXECUTE_POST_ROOM_USER_LEAVE"] = "executePostRoomUserLeave";
    AppMethod["EXECUTE_ON_ROOM_USER_TYPING"] = "executeOnRoomUserTyping";
    // External Component handlers
    AppMethod["EXECUTEPOSTEXTERNALCOMPONENTOPENED"] = "executePostExternalComponentOpened";
    AppMethod["EXECUTEPOSTEXTERNALCOMPONENTCLOSED"] = "executePostExternalComponentClosed";
    // Blockit handlers
    AppMethod["UIKIT_BLOCK_ACTION"] = "executeBlockActionHandler";
    AppMethod["UIKIT_VIEW_SUBMIT"] = "executeViewSubmitHandler";
    AppMethod["UIKIT_VIEW_CLOSE"] = "executeViewClosedHandler";
    AppMethod["UIKIT_LIVECHAT_BLOCK_ACTION"] = "executeLivechatBlockActionHandler";
    // Livechat
    AppMethod["EXECUTE_POST_LIVECHAT_ROOM_STARTED"] = "executePostLivechatRoomStarted";
    /**
     * @deprecated please use the AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED method
     */
    AppMethod["EXECUTE_LIVECHAT_ROOM_CLOSED_HANDLER"] = "executeLivechatRoomClosedHandler";
    AppMethod["EXECUTE_POST_LIVECHAT_ROOM_CLOSED"] = "executePostLivechatRoomClosed";
    AppMethod["EXECUTE_POST_LIVECHAT_AGENT_ASSIGNED"] = "executePostLivechatAgentAssigned";
    AppMethod["EXECUTE_POST_LIVECHAT_AGENT_UNASSIGNED"] = "executePostLivechatAgentUnassigned";
    AppMethod["EXECUTE_POST_LIVECHAT_ROOM_TRANSFERRED"] = "executePostLivechatRoomTransferred";
    AppMethod["EXECUTE_POST_LIVECHAT_GUEST_SAVED"] = "executePostLivechatGuestSaved";
    AppMethod["EXECUTE_POST_LIVECHAT_ROOM_SAVED"] = "executePostLivechatRoomSaved";
    // FileUpload
    AppMethod["EXECUTE_PRE_FILE_UPLOAD"] = "executePreFileUpload";
})(AppMethod = exports.AppMethod || (exports.AppMethod = {}));

//# sourceMappingURL=AppMethod.js.map
