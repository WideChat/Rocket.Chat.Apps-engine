"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
/**
 * This exception informs the host system that an
 * app has determined that an user is not allowed
 * to perform a specific action.
 *
 * Currently it is expected to be thrown by the
 * following events:
 * - IPreRoomCreatePrevent
 * - IPreRoomUserJoined
 */
class UserNotAllowedException extends _1.AppsEngineException {
}
exports.UserNotAllowedException = UserNotAllowedException;

//# sourceMappingURL=UserNotAllowedException.js.map
