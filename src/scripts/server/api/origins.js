"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOriginStats = getOriginStats;
exports.removeAllOrigins = removeAllOrigins;
exports.removeOrigins = removeOrigins;
exports.addOrigin = addOrigin;
exports.clearOriginsForAccount = clearOriginsForAccount;
exports.clearOriginsForAccounts = clearOriginsForAccounts;
exports.clearOrigins = clearOrigins;
const tslib_1 = require("tslib");
const Bluebird = tslib_1.__importStar(require("bluebird"));
const lodash_1 = require("lodash");
const constants_1 = require("../../common/constants");
const utils_1 = require("../../common/utils");
const db_1 = require("../db");
async function getOriginStats(accounts) {
    let totalOrigins = 0;
    let totalOriginsIP4 = 0;
    let totalOriginsIP6 = 0;
    const distribution = [];
    const uniques = new Set();
    const duplicates = new Set();
    for (const account of accounts) {
        if (account.origins) {
            for (const origin of account.origins) {
                totalOrigins++;
                if (uniques.has(origin.ip)) {
                    duplicates.add(origin.ip);
                }
                else {
                    uniques.add(origin.ip);
                }
                if (origin.ip.indexOf(':') !== -1) {
                    totalOriginsIP6++;
                }
                else {
                    totalOriginsIP4++;
                }
            }
        }
        const count = account.origins ? account.origins.length : 0;
        while (distribution.length <= count) {
            distribution.push(0);
        }
        distribution[count]++;
    }
    const uniqueOrigins = uniques.size;
    const duplicateOrigins = duplicates.size;
    const singleOrigins = uniqueOrigins - duplicateOrigins;
    return {
        uniqueOrigins, duplicateOrigins, singleOrigins, totalOrigins, totalOriginsIP4, totalOriginsIP6, distribution
    };
}
function removeAllOrigins(service, accountId) {
    service.removeOriginsFromAccount(accountId);
    return (0, db_1.updateAccount)(accountId, { origins: [] });
}
function removeOrigins(service, accountId, ips) {
    service.removeOriginsFromAccount(accountId, ips);
    return (0, db_1.updateAccount)(accountId, { $pull: { origins: { ip: { $in: ips } } } });
}
function addOrigin(accountId, { ip, country }) {
    return (0, db_1.updateAccount)(accountId, { $push: { origins: { ip, country, last: new Date() } } });
}
async function clearOriginsForAccount(service, accountId, options) {
    const account = service.accounts.get(accountId);
    if (account) {
        const { ips } = getOriginsToRemove(account, options);
        await removeOrigins(service, accountId, ips);
    }
}
async function clearOriginsForAccounts(service, accounts, options) {
    await Bluebird.map(accounts, id => clearOriginsForAccount(service, id, options), { concurrency: 4 });
}
async function clearOrigins(service, count, andHigher, options) {
    const origins = service.accounts.items
        .filter(a => a.originsRefs && (andHigher ? a.originsRefs.length >= count : a.originsRefs.length === count))
        .map(a => getOriginsToRemove(a, options))
        .filter(({ ips }) => !!ips.length);
    await Bluebird.map(origins, o => removeOrigins(service, o.accountId, o.ips), { concurrency: 4 });
}
const isBanned = (origin) => origin.ban || origin.mute || origin.shadow;
function getOriginsToRemove(account, { old, singles, trim, veryOld, country }) {
    const date = (0, utils_1.fromNow)((veryOld ? -90 : -14) * constants_1.DAY).getTime();
    const originsRefs = account.originsRefs || [];
    const filtered = country ?
        originsRefs.filter(({ origin }) => origin.country === country) :
        originsRefs.filter(({ last, origin }) => {
            return (!old || (!last || last.getTime() < date))
                && (!singles || origin.accounts.length === 1)
                && !isBanned(origin);
        });
    const ips = filtered.map(({ origin }) => origin.ip);
    if (trim) {
        ips.push(...(0, lodash_1.difference)(originsRefs.map(({ origin }) => origin.ip), ips).slice(10));
    }
    return { accountId: account._id, ips };
}
//# sourceMappingURL=origins.js.map