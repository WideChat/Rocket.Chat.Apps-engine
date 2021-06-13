import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IUIKitIncomingInteractionMessageContainer, IUIKitIncomingInteractionModalContainer } from './UIKitIncomingInteractionContainer';
export declare enum UIKitIncomingInteractionType {
    BLOCK = "blockAction",
    VIEW_SUBMIT = "viewSubmit",
    VIEW_CLOSED = "viewClosed"
}
export interface IUIKitIncomingInteraction {
    type: UIKitIncomingInteractionType;
    container: IUIKitIncomingInteractionModalContainer | IUIKitIncomingInteractionMessageContainer;
    user: IUser;
    appId: string;
    payload: object;
    actionId?: string;
    triggerId?: string;
    room?: IRoom;
    message?: IMessage;
}
