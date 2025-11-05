"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSocialSiteFields = exports.toPonyObjectFields = void 0;
exports.tokenService = tokenService;
exports.isServerOffline = isServerOffline;
exports.toAccountData = toAccountData;
exports.toPonyObject = toPonyObject;
exports.toPonyObjectAdmin = toPonyObjectAdmin;
exports.toSocialSite = toSocialSite;
exports.execAsync = execAsync;
exports.logErrorToFile = logErrorToFile;
exports.getDiskSpace = getDiskSpace;
exports.getCertificateExpirationDate = getCertificateExpirationDate;
exports.getMemoryUsage = getMemoryUsage;
exports.handlePromiseDefault = handlePromiseDefault;
exports.cached = cached;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const child_process_1 = require("child_process");
const lodash_1 = require("lodash");
const adminUtils_1 = require("../common/adminUtils");
const utils_1 = require("../common/utils");
const paths = tslib_1.__importStar(require("./paths"));
function tokenService(socket) {
    return {
        clearTokensForAccount(accountId) {
            socket.clearTokens((_, data) => data.accountId === accountId);
        },
        clearTokensAll() {
            socket.clearTokens(() => true);
        },
        createToken(token) {
            return socket.token(token);
        }
    };
}
function isServerOffline(server) {
    return server.state.dead || !!server.state.settings.isServerOffline || !!server.state.shutdown;
}
function toAccountData(account) {
    const { _id, name, birthdate, birthyear, characterCount, roles, settings, flags } = account;
    return {
        id: _id.toString(),
        name, characterCount,
        birthdate: birthdate && (0, utils_1.formatISODate)(birthdate) || '',
        birthyear,
        settings: (0, utils_1.cloneDeep)(settings || {}),
        supporter: (0, adminUtils_1.supporterLevel)(account) || undefined,
        roles: (roles && roles.length) ? [...roles] : undefined,
        flags: ((0, utils_1.hasFlag)(flags, 4 /* AccountFlags.DuplicatesNotification */) ? 1 /* AccountDataFlags.Duplicates */ : 0) |
            ((0, adminUtils_1.isPastSupporter)(account) ? 4 /* AccountDataFlags.PastSupporter */ : 0),
    };
}
exports.toPonyObjectFields = '_id name info desc site tag lastUsed flags';
function toPonyObject(character) {
    return character ? {
        id: character._id.toString(),
        name: character.name,
        desc: character.desc || '',
        info: character.info || '',
        site: character.site ? character.site.toString() : undefined,
        tag: character.tag || undefined,
        lastUsed: character.lastUsed && character.lastUsed.toISOString(),
        hideSupport: (0, utils_1.hasFlag)(character.flags, 4 /* CharacterFlags.HideSupport */) ? true : undefined,
        respawnAtSpawn: (0, utils_1.hasFlag)(character.flags, 8 /* CharacterFlags.RespawnAtSpawn */) ? true : undefined,
    } : null;
}
function toPonyObjectAdmin(character) {
    return character ? { ...toPonyObject(character), creator: character.creator } : null;
}
exports.toSocialSiteFields = '_id name provider url';
function toSocialSite({ _id, name, provider, url }) {
    return { id: _id.toString(), name, provider, url };
}
/* istanbul ignore next */
function execAsync(command, options) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, options || {}, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                resolve({ stdout, stderr });
            }
        });
    });
}
/* istanbul ignore next */
async function logErrorToFile(message, data) {
    const fileName = `error-${Date.now()}.json`;
    const filePath = paths.pathTo('store', fileName);
    await fs.writeFileAsync(filePath, JSON.stringify({ message, data }, null, 2), 'utf8');
    return fileName;
}
/* istanbul ignore next */
async function getDiskSpace() {
    // NOTE: add your own code here
    return '';
}
/* istanbul ignore next */
async function getCertificateExpirationDate() {
    // NOTE: add your own code here
    return '';
}
/* istanbul ignore next */
async function getMemoryUsage() {
    // NOTE: add your own code here
    return `0%`;
}
/* istanbul ignore next */
function handlePromiseDefault(promise, errorHandler = lodash_1.noop) {
    Promise.resolve(promise).catch(errorHandler);
}
function cached(func, cacheTimeout = 1000) {
    const cacheMap = new Map();
    const cachedFunc = (...args) => {
        const cacheKey = JSON.stringify(args);
        const cache = cacheMap.get(cacheKey);
        if (cache) {
            clearTimeout(cache.timeout);
            cache.timeout = setTimeout(() => cacheMap.delete(cacheKey), cacheTimeout);
            return cache.result;
        }
        else {
            const result = func(...args);
            const timeout = setTimeout(() => cacheMap.delete(cacheKey), cacheTimeout);
            cacheMap.set(cacheKey, { result, timeout });
            return result;
        }
    };
    cachedFunc.clear = (...args) => {
        cacheMap.delete(JSON.stringify(args));
    };
    return cachedFunc;
}
//# sourceMappingURL=serverUtils.js.map