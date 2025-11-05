"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasActiveSupporterInvites = exports.queryAccount = exports.queryAccounts = exports.updateAccounts = exports.updateAccount = exports.findAccount = exports.updateAuth = exports.queryAuths = exports.countAllVisibleAuths = exports.findAllVisibleAuths = exports.findAllAuths = exports.findAuth = exports.findAuthByEmail = exports.findAuthByOpenId = exports.queryCharacter = exports.updateCharacterState = exports.findAllCharacters = exports.checkAccountExists = exports.checkCharacterExists = exports.HideRequest = exports.FriendRequest = exports.SupporterInvite = exports.Account = exports.Character = exports.Session = exports.Origin = exports.Event = exports.Auth = void 0;
exports.iterate = iterate;
exports.nullToUndefined = nullToUndefined;
exports.createCharacter = createCharacter;
exports.characterCount = characterCount;
exports.findCharacter = findCharacter;
exports.findCharacterSafe = findCharacterSafe;
exports.findCharacterById = findCharacterById;
exports.findLatestCharacters = findLatestCharacters;
exports.removeCharacter = removeCharacter;
exports.checkIfAdmin = checkIfAdmin;
exports.findAccountSafe = findAccountSafe;
exports.findFriendIds = findFriendIds;
exports.findFriends = findFriends;
exports.findHideIds = findHideIds;
exports.findHideIdsRev = findHideIdsRev;
exports.findHidesForMerge = findHidesForMerge;
exports.addHide = addHide;
const mongoose_1 = require("mongoose");
const logger_1 = require("./logger");
const accountUtils_1 = require("../common/accountUtils");
const emoji_1 = require("../client/emoji");
const characterUtils_1 = require("./characterUtils");
const swears_1 = require("../common/swears");
// schemas
const originInfo = {
    ip: String,
    country: String,
    last: Date,
};
const mergeInfo = {
    id: String,
    name: String,
    //code: Number,
    date: Date,
    reason: String,
    data: Object,
    split: Boolean,
};
const logEntry = {
    message: String,
    date: Date,
};
const authSchema = new mongoose_1.Schema({
    account: { type: mongoose_1.Schema.Types.ObjectId, index: true, ref: 'Account' },
    openId: String,
    provider: String,
    name: String,
    url: String,
    emails: [String],
    disabled: Boolean,
    banned: Boolean,
    pledged: Number,
    lastUsed: Date,
}, { timestamps: true });
authSchema.index({ updatedAt: 1 });
authSchema.index({ openId: 1, provider: 1 }, { unique: true });
const bannedMuted = {
    mute: Number,
    shadow: Number,
    ban: Number,
};
const originSchema = new mongoose_1.Schema({
    ip: { type: String, index: true },
    country: String,
    ...bannedMuted,
}, { timestamps: true });
originSchema.index({ updatedAt: 1 });
const accountSchema = new mongoose_1.Schema({
    name: String,
    birthdate: Date,
    birthyear: Number,
    // code: Number,
    emails: { type: [String], index: true },
    lastVisit: Date,
    lastUserAgent: String,
    lastBrowserId: String,
    lastOnline: Date,
    lastCharacter: mongoose_1.Schema.Types.ObjectId,
    roles: [String],
    origins: [originInfo],
    note: String,
    noteUpdated: Date,
    ignores: [String],
    // friends: [{ type: Schema.Types.ObjectId, unique: true, ref: 'Account' }],
    flags: Number,
    characterCount: { type: Number, default: 0 },
    // NOTE: use account.markModified('settings') if changed nested field
    settings: { type: mongoose_1.Schema.Types.Mixed, default: () => ({}) },
    counters: { type: mongoose_1.Schema.Types.Mixed, default: () => ({}) },
    patreon: Number,
    supporter: Number,
    supporterLog: [logEntry],
    supporterTotal: Number,
    supporterDeclinedSince: Date,
    merges: [mergeInfo],
    banLog: [logEntry],
    mute: Number,
    shadow: Number,
    ban: Number,
    // auths: [{ type: Schema.Types.ObjectId, ref: 'Auth' }],
    state: Object,
    alert: Object,
    savedMap: String,
}, { timestamps: true });
accountSchema.virtual('auths', {
    ref: 'Auth',
    localField: '_id',
    foreignField: 'account',
});
accountSchema.virtual('characters', {
    ref: 'Character',
    localField: '_id',
    foreignField: 'account',
});
accountSchema.index({ updatedAt: 1 });
const characterSchema = new mongoose_1.Schema({
    account: { type: mongoose_1.Schema.Types.ObjectId, index: true, ref: 'Account' },
    site: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Auth' },
    name: { type: String, index: true },
    desc: String,
    tag: String,
    info: String,
    flags: { type: Number, default: 0 },
    lastUsed: { type: Date, index: true },
    creator: String,
    state: Object,
}, { timestamps: true });
characterSchema.index({ updatedAt: 1 });
characterSchema.index({ createdAt: 1 });
const eventSchema = new mongoose_1.Schema({
    account: { type: mongoose_1.Schema.Types.ObjectId, index: true, ref: 'Account' },
    pony: mongoose_1.Schema.Types.ObjectId,
    type: String,
    server: String,
    message: String,
    desc: String,
    origin: originInfo,
    count: { type: Number, default: 1 },
}, { timestamps: true });
eventSchema.index({ updatedAt: 1 });
const supporterInviteSchema = new mongoose_1.Schema({
    source: { type: mongoose_1.Schema.Types.ObjectId, index: true, ref: 'Account' },
    target: { type: mongoose_1.Schema.Types.ObjectId, index: true, ref: 'Account' },
    name: String,
    info: String,
    active: Boolean,
}, { timestamps: true });
const friendRequestSchema = new mongoose_1.Schema({
    source: { type: mongoose_1.Schema.Types.ObjectId, index: true, ref: 'Account' },
    target: { type: mongoose_1.Schema.Types.ObjectId, index: true, ref: 'Account' },
});
const hideRequestSchema = new mongoose_1.Schema({
    source: { type: mongoose_1.Schema.Types.ObjectId, index: true, ref: 'Account' },
    target: { type: mongoose_1.Schema.Types.ObjectId, index: true, ref: 'Account' },
    name: String,
    date: Date,
});
const sessionSchema = new mongoose_1.Schema({
    _id: String,
    session: String,
});
// models
exports.Auth = (0, mongoose_1.model)('Auth', authSchema);
exports.Event = (0, mongoose_1.model)('Event', eventSchema);
exports.Origin = (0, mongoose_1.model)('Origin', originSchema);
exports.Session = (0, mongoose_1.model)('session', sessionSchema);
exports.Character = (0, mongoose_1.model)('Character', characterSchema);
accountSchema.post('remove', function (doc) {
    Promise.all([
        exports.Character.deleteMany({ account: doc._id }).exec(),
        exports.Event.deleteMany({ account: doc._id }).exec(),
        exports.Auth.deleteMany({ account: doc._id }).exec(),
        exports.FriendRequest.deleteMany({ $or: [{ target: doc._id }, { source: doc._id }] }).exec(),
        exports.HideRequest.deleteMany({ $or: [{ target: doc._id }, { source: doc._id }] }).exec(),
    ]).catch(logger_1.logger.error);
});
exports.Account = (0, mongoose_1.model)('Account', accountSchema);
exports.SupporterInvite = (0, mongoose_1.model)('SupporterInvite', supporterInviteSchema);
exports.FriendRequest = (0, mongoose_1.model)('FriendRequest', friendRequestSchema);
exports.HideRequest = (0, mongoose_1.model)('HideRequest', hideRequestSchema);
function iterate(query, onData) {
    return new Promise(resolve => {
        query.cursor()
            .on('data', onData)
            .on('end', resolve);
    });
}
function throwOnEmpty(message) {
    return item => {
        if (item) {
            return item;
        }
        else {
            throw new Error(message);
        }
    };
}
function nullToUndefined(item) {
    return item === null ? undefined : item;
}
exports.checkCharacterExists = throwOnEmpty('Character does not exist');
exports.checkAccountExists = throwOnEmpty('Account does not exist');
function createCharacter(account) {
    return new exports.Character({ account: account._id, creator: `${account.name} [${account._id}]` });
}
function characterCount(account) {
    return exports.Character.countDocuments({ account }).exec();
}
function findCharacter(pony, account) {
    return exports.Character.findOne({ _id: pony, account }).exec().then(nullToUndefined);
}
function findCharacterSafe(pony, accountId) {
    return findCharacter(pony, accountId)
        .then(exports.checkCharacterExists);
}
function findCharacterById(id) {
    return exports.Character.findById(id).exec().then(nullToUndefined);
}
const findAllCharacters = (account, fields) => exports.Character.find({ account }, fields).lean().exec();
exports.findAllCharacters = findAllCharacters;
function findLatestCharacters(account, count) {
    return exports.Character.find({ account })
        .sort('-lastUsed')
        .limit(count)
        .exec();
}
function removeCharacter(id, account) {
    return exports.Character.findOneAndRemove({ _id: id, account }).exec().then(nullToUndefined);
}
const updateCharacterState = (characterId, serverName, state) => exports.Character.updateOne({ _id: characterId }, { [`state.${serverName}`]: state }).exec().then(nullToUndefined);
exports.updateCharacterState = updateCharacterState;
const queryCharacter = (query, fields) => exports.Character.findOne(query, fields).exec();
exports.queryCharacter = queryCharacter;
const findAuthByOpenId = (openId, provider) => exports.Auth.findOne({ openId, provider }).exec().then(nullToUndefined);
exports.findAuthByOpenId = findAuthByOpenId;
const findAuthByEmail = (emails) => exports.Auth.findOne({ emails: { $in: emails } }).exec().then(nullToUndefined);
exports.findAuthByEmail = findAuthByEmail;
const findAuth = (auth, account, fields) => exports.Auth.findOne({ _id: auth, account }, fields).exec().then(nullToUndefined);
exports.findAuth = findAuth;
const findAllAuths = (account, fields) => exports.Auth.find({ account, fields }).exec();
exports.findAllAuths = findAllAuths;
const findAllVisibleAuths = (account, fields) => exports.Auth.find({ account, disabled: { $ne: true }, banned: { $ne: true } }, fields).lean().exec();
exports.findAllVisibleAuths = findAllVisibleAuths;
const countAllVisibleAuths = (account) => exports.Auth.find({ account, disabled: { $ne: true }, banned: { $ne: true } }).countDocuments().exec();
exports.countAllVisibleAuths = countAllVisibleAuths;
const queryAuths = (query, fields) => exports.Auth.find(query, fields).lean().exec();
exports.queryAuths = queryAuths;
const updateAuth = (id, update) => exports.Auth.updateOne({ _id: id }, update).exec();
exports.updateAuth = updateAuth;
const findAccount = (account, projection) => exports.Account.findById(account, projection).exec().then(nullToUndefined);
exports.findAccount = findAccount;
function checkIfAdmin(account) {
    return exports.Account.findOne({ _id: account }, 'roles').lean().exec()
        .then(a => a && (0, accountUtils_1.isAdmin)(a));
}
function findAccountSafe(account, projection) {
    return (0, exports.findAccount)(account, projection)
        .then(exports.checkAccountExists);
}
const updateAccount = (accountId, update) => exports.Account.updateOne({ _id: accountId }, update).exec();
exports.updateAccount = updateAccount;
const updateAccounts = (query, update) => exports.Account.updateMany(query, update).exec();
exports.updateAccounts = updateAccounts;
const queryAccounts = (query, fields) => exports.Account.find(query, fields).lean().exec();
exports.queryAccounts = queryAccounts;
const queryAccount = (query, fields) => exports.Account.findOne(query, fields).exec().then(nullToUndefined);
exports.queryAccount = queryAccount;
const hasActiveSupporterInvites = (accountId) => exports.SupporterInvite.countDocuments({ target: accountId, active: true }).exec()
    .then(count => count > 0);
exports.hasActiveSupporterInvites = hasActiveSupporterInvites;
// friend requests
async function findFriendIds(accountId) {
    const accountIdString = accountId.toString();
    const friendRequests = await exports.FriendRequest
        .find({ $or: [{ source: accountId }, { target: accountId }] }, 'source target')
        .lean()
        .exec();
    const friendIds = friendRequests
        .map((f) => f.source.toString() === accountIdString ? f.target.toString() : f.source.toString());
    return friendIds;
}
async function findFriends(accountId, withCharacters) {
    const friendIds = await findFriendIds(accountId);
    const accounts = await exports.Account.find({ _id: { $in: friendIds } }, '_id name lastOnline lastCharacter').lean().exec();
    let characters = [];
    if (withCharacters) {
        const characterIds = accounts.map(a => a.lastCharacter).filter(id => id);
        characters = await exports.Character.find({ _id: { $in: characterIds } }, '_id name info').lean().exec();
    }
    return accounts.map(a => {
        const characterId = a.lastCharacter && a.lastCharacter.toString();
        const character = characterId && characters.find(c => c._id.toString() === characterId);
        const name = character && (0, characterUtils_1.filterForbidden)((0, emoji_1.replaceEmojis)(character.name));
        const nameFiltered = name && (0, swears_1.filterName)(name);
        return {
            accountId: a._id.toString(),
            accountName: a.name,
            name,
            pony: character && character.info,
            nameBad: name !== nameFiltered,
        };
    });
}
// hide requests
async function findHideIds(accountId) {
    const hideRequests = await exports.HideRequest.find({ source: accountId }, 'target').lean().exec();
    return hideRequests.map(f => f.target.toString());
}
async function findHideIdsRev(accountId) {
    const hideRequests = await exports.HideRequest.find({ target: accountId }, 'source').lean().exec();
    return hideRequests.map(f => f.source.toString());
}
async function findHidesForMerge(accountId) {
    const hideRequests = await exports.HideRequest
        .find({ source: accountId }, '_id name date')
        .lean()
        .exec();
    return hideRequests.map(f => ({
        id: f._id.toString(),
        name: f.name,
        date: f.date.toString(),
    }));
}
async function addHide(source, target, name) {
    if (source.toString() === target.toString())
        return;
    const existing = await exports.HideRequest.findOne({ source, target }, '_id').lean().exec();
    if (!existing) {
        await exports.HideRequest.create({ source, target, name, date: new Date() });
    }
}
//# sourceMappingURL=db.js.map