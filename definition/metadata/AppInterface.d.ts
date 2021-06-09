export declare enum AppInterface {
    IPreMessageSentPrevent = "IPreMessageSentPrevent",
    IPreMessageSentExtend = "IPreMessageSentExtend",
    IPreMessageSentModify = "IPreMessageSentModify",
    IPostMessageSent = "IPostMessageSent",
    IPreMessageDeletePrevent = "IPreMessageDeletePrevent",
    IPostMessageDeleted = "IPostMessageDeleted",
    IPreMessageUpdatedPrevent = "IPreMessageUpdatedPrevent",
    IPreMessageUpdatedExtend = "IPreMessageUpdatedExtend",
    IPreMessageUpdatedModify = "IPreMessageUpdatedModify",
    IPostMessageUpdated = "IPostMessageUpdated",
    IPreRoomCreatePrevent = "IPreRoomCreatePrevent",
    IPreRoomCreateExtend = "IPreRoomCreateExtend",
    IPreRoomCreateModify = "IPreRoomCreateModify",
    IPostRoomCreate = "IPostRoomCreate",
    IPreRoomDeletePrevent = "IPreRoomDeletePrevent",
    IPostRoomDeleted = "IPostRoomDeleted",
    IPreRoomUserJoined = "IPreRoomUserJoined",
    IPostRoomUserJoined = "IPostRoomUserJoined",
    IPreRoomUserLeave = "IPreRoomUserLeave",
    IPostRoomUserLeave = "IPostRoomUserLeave",
    IRoomUserTyping = "IRoomUserTyping",
    IPostExternalComponentOpened = "IPostExternalComponentOpened",
    IPostExternalComponentClosed = "IPostExternalComponentClosed",
    IUIKitInteractionHandler = "IUIKitInteractionHandler",
    IUIKitLivechatInteractionHandler = "IUIKitLivechatInteractionHandler",
    IPostLivechatRoomStarted = "IPostLivechatRoomStarted",
    IPostLivechatRoomClosed = "IPostLivechatRoomClosed",
    /**
     * @deprecated please use the AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED method
     */
    ILivechatRoomClosedHandler = "ILivechatRoomClosedHandler",
    IPostLivechatAgentAssigned = "IPostLivechatAgentAssigned",
    IPostLivechatAgentUnassigned = "IPostLivechatAgentUnassigned",
    IPostLivechatRoomTransferred = "IPostLivechatRoomTransferred",
    IPostLivechatGuestSaved = "IPostLivechatGuestSaved",
    IPostLivechatRoomSaved = "IPostLivechatRoomSaved",
    IPreFileUpload = "IPreFileUpload"
}