"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignAuth = assignAuth;
exports.removeAuth = removeAuth;
const db_1 = require("../db");
const accountUtils_1 = require("../accountUtils");
async function assignAuth(authId, accountId) {
    const auth = await db_1.Auth.findById(authId).exec();
    if (!auth)
        return;
    const [src, dest] = await Promise.all([
        db_1.Account.findById(auth.account).exec(),
        db_1.Account.findById(accountId).exec(),
    ]);
    src && (0, accountUtils_1.checkIfNotAdmin)(src, `assign auth from ${src._id}`);
    dest && (0, accountUtils_1.checkIfNotAdmin)(dest, `assign auth to ${dest._id}`);
    await db_1.Auth.updateOne({ _id: authId }, { account: accountId }).exec();
}
async function removeAuth(service, authId) {
    const auth = await db_1.Auth.findById(authId).exec();
    if (!auth)
        return;
    if (auth.account) {
        const account = await db_1.Account.findById(auth.account).exec();
        account && (0, accountUtils_1.checkIfNotAdmin)(account, `remove auth from ${account._id}`);
    }
    await db_1.Auth.deleteOne({ _id: authId }).exec();
    service.auths.removed(authId);
}
//# sourceMappingURL=admin-auths.js.map