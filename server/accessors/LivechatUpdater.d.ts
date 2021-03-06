import { ILivechatUpdater } from '../../definition/accessors';
import { ILivechatRoom, ILivechatTransferData, IVisitor } from '../../definition/livechat';
import { AppBridges } from '../bridges';
export declare class LivechatUpdater implements ILivechatUpdater {
    private readonly bridges;
    private readonly appId;
    constructor(bridges: AppBridges, appId: string);
    transferVisitor(visitor: IVisitor, transferData: ILivechatTransferData): Promise<boolean>;
    closeRoom(room: ILivechatRoom, comment: string): Promise<boolean>;
    setCustomFields(token: IVisitor['token'], key: string, value: string, overwrite: boolean): Promise<boolean>;
}
