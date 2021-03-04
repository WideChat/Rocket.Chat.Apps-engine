import { IHttp, IPersistence, IRead } from '../accessors';
import { IRoomUserTypingContext } from './IRoomUserTypingContext';
/**
 * Event interface that allows an app to
 * register as a handler of the `IRoomUserTyping`
 * event
 *
 * This event is triggered when user starts/stops typing
 *
 */
export interface IRoomUserTyping {
    executeOnRoomUserTyping(context: IRoomUserTypingContext, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
