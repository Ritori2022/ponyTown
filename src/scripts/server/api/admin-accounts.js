"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutAccount = timeoutAccount;
exports.updateAccountCounter = updateAccountCounter;
exports.initLogSwearingAndSpamming = initLogSwearingAndSpamming;
exports.reportSwearingAccount = reportSwearingAccount;
exports.reportSpammingAccount = reportSpammingAccount;
exports.reportInviteLimitAccount = reportInviteLimitAccount;
exports.reportFriendLimitAccount = reportFriendLimitAccount;
exports.updateAccountSafe = updateAccountSafe;
exports.setRole = setRole;
exports.addEmail = addEmail;
exports.removeEmail = removeEmail;
exports.removeIgnore = removeIgnore;
exports.addIgnores = addIgnores;
exports.setAccountState = setAccountState;
exports.findAccounts = findAccounts;
exports.getAccountsByEmail = getAccountsByEmail;
exports.getAccountsByEmails = getAccountsByEmails;
exports.getAccountsByOrigin = getAccountsByOrigin;
exports.removeAccount = removeAccount;
exports.setAccountAlert = setAccountAlert;
const lodash_1 = require("lodash");
const accountUtils_1 = require("../accountUtils");
const db_1 = require("../db");
const internal_1 = require("../internal");
const constants_1 = require("../../common/constants");
const utils_1 = require("../../common/utils");
const adminUtils_1 = require("../../common/adminUtils");
const banLogLimit = 10;
async function updateAccountAndNotify(accountId, update) {
    await (0, db_1.updateAccount)(accountId, update);
    await (0, internal_1.accountChanged)(accountId);
}
async function timeoutAccount(accountId, timeout, message) {
    const account = await (0, db_1.findAccountSafe)(accountId, 'roles mute shadow');
    (0, accountUtils_1.checkIfNotAdmin)(account, `timeout account: ${accountId}`);
    const update = { mute: timeout.getTime() };
    if (!(0, adminUtils_1.isMuted)(account) && !(0, adminUtils_1.isShadowed)(account)) {
        update.$inc = { 'counters.timeouts': 1 };
        if (message) {
            update.$push = {
                banLog: {
                    $each: [{ message, date: new Date() }],
                    $slice: -banLogLimit,
                },
            };
        }
    }
    await updateAccountAndNotify(accountId, update);
}
function incrementAccountCounter(accountId, counter) {
    return updateAccountAndNotify(accountId, { $inc: { [`counters.${counter}`]: 1 } });
}
function updateAccountCounter(accountId, counter, value) {
    return updateAccountAndNotify(accountId, { [`counters.${counter}`]: value });
}
let logSwearing = lodash_1.noop;
let logSpamming = lodash_1.noop;
function initLogSwearingAndSpamming(swearing, spamming) {
    logSwearing = swearing;
    logSpamming = spamming;
}
function reportSwearingAccount(accountId) {
    logSwearing();
    return incrementAccountCounter(accountId, 'swears');
}
function reportSpammingAccount(accountId) {
    logSpamming();
    return incrementAccountCounter(accountId, 'spam');
}
async function reportInviteLimitAccount(accountId) {
    await incrementAccountCounter(accountId, 'inviteLimit');
    const account = await (0, db_1.findAccountSafe)(accountId, 'counters');
    return account.counters && account.counters.inviteLimit || 0;
}
async function reportFriendLimitAccount(accountId) {
    await incrementAccountCounter(accountId, 'friendLimit');
    const account = await (0, db_1.findAccountSafe)(accountId, 'counters');
    return account.counters && account.counters.friendLimit || 0;
}
async function updateAccountSafe(accountId, update) {
    const keys = Object.keys(update);
    const allowAdmin = (0, utils_1.arraysEqual)(keys, ['note']) || (0, utils_1.arraysEqual)(keys, ['supporter']);
    const account = await (0, db_1.findAccountSafe)(accountId);
    if (!allowAdmin) {
        (0, accountUtils_1.checkIfNotAdmin)(account, `update account: ${accountId}`);
    }
    const isNoteUpdate = 'note' in update && update.note !== account.note;
    const accountUpdate = isNoteUpdate ? { ...update, noteUpdated: new Date() } : update;
    await updateAccountAndNotify(accountId, accountUpdate);
}
async function setRole(accountId, role, set, isSuperadmin) {
    if (role === 'superadmin' || !isSuperadmin) {
        throw new Error('Not allowed');
    }
    else {
        await updateAccountAndNotify(accountId, set ? { $addToSet: { roles: [role] } } : { $pull: { roles: role } });
    }
}
function addEmail(accountId, email) {
    return (0, db_1.updateAccount)(accountId, { $addToSet: { emails: [email.trim().toLowerCase()] } });
}
function removeEmail(accountId, email) {
    return (0, db_1.updateAccount)(accountId, { $pull: { emails: email } });
}
function removeIgnore(accountId, ignoredAccount) {
    return updateAccountAndNotify(ignoredAccount, { $pull: { ignores: accountId } });
}
function addIgnores(accountId, ignores) {
    return updateAccountAndNotify(accountId, { $addToSet: { ignores } });
}
function setAccountState(accountId, state) {
    return updateAccountAndNotify(accountId, { state });
}
function isValidCache(entry, query, duration) {
    return entry.query === query && entry.timestamp.getTime() > (0, utils_1.fromNow)(-duration).getTime();
}
async function findAccounts(cache, service, { search, showOnly, not, page, itemsPerPage, force }) {
    const query = JSON.stringify({ search, showOnly, not });
    let found;
    if (force) {
        cache.findAccounts = undefined;
    }
    if (cache.findAccounts && isValidCache(cache.findAccounts, query, 5 * constants_1.MINUTE)) {
        found = cache.findAccounts.result;
    }
    else {
        found = (0, adminUtils_1.filterAccounts)(service.accounts.items, search, showOnly, not);
        cache.findAccounts = {
            query,
            result: found,
            timestamp: new Date(),
        };
    }
    const start = page * itemsPerPage;
    return {
        accounts: found.slice(start, start + itemsPerPage).map(a => a._id),
        page,
        totalItems: found.length,
    };
}
function getAccountsByEmail(service, email) {
    email = email.toLowerCase();
    const name = (0, adminUtils_1.emailName)(email);
    const accounts = service.getAccountsByEmailName(name) || [];
    return accounts.filter(a => (0, utils_1.includes)(a.emails, email)).map(a => a._id);
}
function getAccountsByEmails(service, emails) {
    const pairs = (0, lodash_1.uniq)(emails)
        .map(email => [email, getAccountsByEmail(service, email)])
        .filter(([_, accounts]) => accounts.length > 0);
    return (0, lodash_1.fromPairs)(pairs);
}
function getAccountsByOrigin(service, ip) {
    const origin = service.origins.get(ip);
    return origin && origin.accounts && origin.accounts.map(a => a._id) || [];
}
async function removeAccount(service, accountId) {
    const account = await (0, db_1.findAccount)(accountId);
    if (account) {
        (0, accountUtils_1.checkIfNotAdmin)(account, `remove account: ${accountId}`);
        await account.remove();
        service.removedItem('accounts', accountId);
    }
}
async function setAccountAlert(accountId, message, expires) {
    const update = message ? { alert: { message, expires } } : { $unset: { alert: 1 } };
    await db_1.Account.updateOne({ _id: accountId }, update).exec();
}
//# sourceMappingURL=admin-accounts.js.map