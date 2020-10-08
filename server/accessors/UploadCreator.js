"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class UploadCreator {
    constructor(bridges, appId) {
        this.bridges = bridges;
        this.appId = appId;
    }
    uploadBuffer(buffer, descriptor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!descriptor.hasOwnProperty('user') && !descriptor.visitorToken) {
                descriptor.user = yield this.bridges.getUserBridge().getAppUser(this.appId);
            }
            const details = {
                name: descriptor.filename,
                size: buffer.length,
                rid: descriptor.room.id,
                userId: descriptor.user && descriptor.user.id,
                visitorToken: descriptor.visitorToken,
            };
            return this.bridges.getUploadBridge().createUpload(details, buffer, this.appId);
        });
    }
}
exports.UploadCreator = UploadCreator;

//# sourceMappingURL=UploadCreator.js.map
