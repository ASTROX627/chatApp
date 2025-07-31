"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectInviteLink = void 0;
const detectInviteLink = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.includes("/invite/");
    }
    catch (error) {
        return false;
    }
};
exports.detectInviteLink = detectInviteLink;
