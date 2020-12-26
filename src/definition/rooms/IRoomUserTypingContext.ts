/**
 * The context of execution for the following events:
 * - IRoomUserTyping
 */
export interface IRoomUserTypingContext {
    /**
     * The roomId the room
     */
    roomId: string;
    /**
     * The username of the user who is typing/stopped typing
     */
    username: string;
    /**
     * The user typing status
     */
    typing: boolean;
    /**
     * Extra data
     */
    data: { [key: string]: any };
}
