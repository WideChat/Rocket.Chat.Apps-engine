import { IDiscussionBuilder, ILivechatCreator, ILivechatMessageBuilder, IMessageBuilder, IModifyCreator, IRoomBuilder, IUploadCreator } from '../../definition/accessors';
import { ILivechatMessage } from '../../definition/livechat/ILivechatMessage';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { BlockBuilder } from '../../definition/uikit';
import { AppBridges } from '../bridges';
export declare class ModifyCreator implements IModifyCreator {
    private readonly bridges;
    private readonly appId;
    private livechatCreator;
    private uploadCreator;
    constructor(bridges: AppBridges, appId: string);
    getLivechatCreator(): ILivechatCreator;
    getUploadCreator(): IUploadCreator;
    getBlockBuilder(): BlockBuilder;
    startMessage(data?: IMessage): IMessageBuilder;
    startLivechatMessage(data?: ILivechatMessage): ILivechatMessageBuilder;
    startRoom(data?: IRoom): IRoomBuilder;
    startDiscussion(data?: Partial<IRoom>): IDiscussionBuilder;
    finish(builder: IMessageBuilder | ILivechatMessageBuilder | IRoomBuilder | IDiscussionBuilder): Promise<string>;
    private _finishMessage;
    private _finishLivechatMessage;
    private _finishRoom;
    private _finishDiscussion;
}
