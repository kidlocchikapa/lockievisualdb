"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const crypto = require("crypto");
async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${derived}`;
}
async function comparePassword(password, stored) {
    if (!stored || !stored.includes(':'))
        return false;
    const [salt, hash] = stored.split(':');
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    try {
        return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=password.util.js.map