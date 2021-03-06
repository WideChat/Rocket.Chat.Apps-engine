import { IExternalComponent } from '../../definition/externalComponent';
import { ILivechatEventContext, ILivechatRoom, ILivechatTransferEventContext, IVisitor } from '../../definition/livechat';
import { IMessage } from '../../definition/messages';
import { AppInterface } from '../../definition/metadata';
import { IRoom, IRoomUserJoinedContext, IRoomUserLeaveContext, IRoomUserTypingContext } from '../../definition/rooms';
import { IUIKitIncomingInteraction, IUIKitResponse } from '../../definition/uikit';
import { IUIKitLivechatIncomingInteraction } from '../../definition/uikit/livechat';
import { IFileUploadContext } from '../../definition/uploads/IFileUploadContext';
import { IUser } from '../../definition/users';
import { AppManager } from '../AppManager';
import { ProxiedApp } from '../ProxiedApp';
declare type EventData = (IMessage | IRoom | IUser | IVisitor | ILivechatRoom | IUIKitIncomingInteraction | IUIKitLivechatIncomingInteraction | IExternalComponent | ILivechatEventContext | IRoomUserJoinedContext | IRoomUserLeaveContext | ILivechatTransferEventContext | IFileUploadContext | IRoomUserTypingContext);
declare type EventReturn = (void | boolean | IMessage | IRoom | IUser | IUIKitResponse | ILivechatRoom);
export declare class AppListenerManager {
    private readonly manager;
    private am;
    private listeners;
    /**
     * Locked events are those who are listed in an app's
     * "essentials" list but the app is disabled.
     *
     * They will throw a EssentialAppDisabledException upon call
     */
    private lockedEvents;
    constructor(manager: AppManager);
    registerListeners(app: ProxiedApp): void;
    unregisterListeners(app: ProxiedApp): void;
    releaseEssentialEvents(app: ProxiedApp): void;
    lockEssentialEvents(app: ProxiedApp): void;
    getListeners(int: AppInterface): Array<ProxiedApp>;
    isEventBlocked(event: AppInterface): boolean;
    executeListener(int: AppInterface, data: EventData): Promise<EventReturn>;
    private executePreMessageSentPrevent;
    private executePreMessageSentExtend;
    private executePreMessageSentModify;
    private executePostMessageSent;
    private executePreMessageDeletePrevent;
    private executePostMessageDelete;
    private executePreMessageUpdatedPrevent;
    private executePreMessageUpdatedExtend;
    private executePreMessageUpdatedModify;
    private executePostMessageUpdated;
    private executePreRoomCreatePrevent;
    private executePreRoomCreateExtend;
    private executePreRoomCreateModify;
    private executePostRoomCreate;
    private executePreRoomDeletePrevent;
    private executePostRoomDeleted;
    private executePreRoomUserJoined;
    private executePostRoomUserJoined;
    private executePreRoomUserLeave;
    private executeOnRoomUserTyping;
    private executePostRoomUserLeave;
    private executePostExternalComponentOpened;
    private executePostExternalComponentClosed;
    private executeUIKitInteraction;
    private executeUIKitLivechatInteraction;
    private executePostLivechatRoomStarted;
    private executeLivechatRoomClosedHandler;
    private executePostLivechatRoomClosed;
    private executePostLivechatAgentAssigned;
    private executePostLivechatAgentUnassigned;
    private executePostLivechatRoomTransferred;
    private executePostLivechatGuestSaved;
    private executePostLivechatRoomSaved;
    private executePreFileUpload;
}
export {};
