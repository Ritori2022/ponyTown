"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRemovePony = exports.createSavePony = void 0;
const clientUtils_1 = require("../../client/clientUtils");
const serverUtils_1 = require("../serverUtils");
const security_1 = require("../../common/security");
const color_1 = require("../../common/color");
const cmUtils_1 = require("../cmUtils");
const userError_1 = require("../userError");
const errors_1 = require("../../common/errors");
const compressPony_1 = require("../../common/compressPony");
const accountUtils_1 = require("../accountUtils");
const constants_1 = require("../../common/constants");
function colorToText(c) {
    return c ? (0, color_1.colorToHexRGB)(c) : '';
}
const createSavePony = (findCharacter, findAuth, characterCount, updateCharacterCount, createCharacter, log, isSuspiciousName, isSuspiciousPony) => async (account, data, reporter) => {
    if (!data || !data.info || typeof data.name !== 'string') {
        throw new userError_1.UserError('Invalid data', { data });
    }
    const originalName = data.name;
    data.name = (0, clientUtils_1.cleanName)(data.name);
    if (!(0, clientUtils_1.validatePonyName)(data.name)) {
        throw new userError_1.UserError('Invalid name', { desc: JSON.stringify(originalName), data });
    }
    let [character, auth] = await Promise.all([
        data.id ? findCharacter(data.id, account._id) : undefined,
        data.site ? findAuth(data.site, account._id, '_id') : undefined,
    ]).catch(error => {
        throw new userError_1.UserError('Invalid data', { error, data });
    });
    let suspicious = [];
    let created = false;
    let nameChanged = false;
    let oldName;
    try {
        if (!character) {
            character = createCharacter(account);
            created = true;
        }
        const deco = (0, compressPony_1.decompressPony)(data.info);
        const info = (0, compressPony_1.compressPony)(deco);
        // if (data.info !== info) {
        // 	reporter.danger(`Pony info does not match after re-compression`, `original: ${data.info}\nre-compressed: ${info}`);
        // }
        const badCM = (0, cmUtils_1.isBadCM)(deco.cm && deco.cm.map(colorToText) || [], (0, color_1.colorToHexRGB)(deco.coatFill));
        const forbiddenName = (0, security_1.isForbiddenName)(data.name);
        const flags = (badCM ? 1 /* CharacterFlags.BadCM */ : 0) |
            (data.hideSupport ? 4 /* CharacterFlags.HideSupport */ : 0) |
            (data.respawnAtSpawn ? 8 /* CharacterFlags.RespawnAtSpawn */ : 0) |
            (forbiddenName ? 16 /* CharacterFlags.ForbiddenName */ : 0);
        nameChanged = character.name !== data.name;
        oldName = character.name;
        if (nameChanged && isSuspiciousName(data.name)) {
            suspicious.push('name');
        }
        if (character.info !== data.info && isSuspiciousPony(deco)) {
            suspicious.push('look');
        }
        character.desc = typeof data.desc === 'string' ? data.desc.substr(0, constants_1.PLAYER_DESC_MAX_LENGTH) : '';
        character.name = data.name;
        character.tag = data.tag;
        character.site = auth ? auth._id : null;
        character.info = info;
        character.flags = flags;
        character.lastUsed = new Date();
    }
    catch (error) {
        const message = DEVELOPMENT ? `${errors_1.CHARACTER_SAVING_ERROR} (${error})` : errors_1.CHARACTER_SAVING_ERROR;
        throw new userError_1.UserError(message, { error, data: { pony: data }, desc: `info: "${data.info}"` });
    }
    const count = created ? await characterCount(account._id) : 0;
    if (count >= (0, accountUtils_1.getCharacterLimit)(account)) {
        throw new userError_1.UserError(errors_1.CHARACTER_LIMIT_ERROR);
    }
    await character.save();
    if (created) {
        await updateCharacterCount(account._id);
    }
    if (suspicious.length) {
        reporter.setPony(character._id.toString());
        reporter.warn('Suspicious pony created', `"${character.name}" (${suspicious.join(', ')})`);
    }
    if (created) {
        log(account._id, `created pony "${character.name}"`);
    }
    else if (nameChanged) {
        log(account._id, `renamed pony "${oldName}" => "${character.name}"`);
    }
    return (0, serverUtils_1.toPonyObject)(character);
};
exports.createSavePony = createSavePony;
const createRemovePony = (kickFromAllServersByCharacter, removeCharacter, updateCharacterCount, removedCharacter, logRemovedCharacter) => async (ponyId, accountId) => {
    if (!ponyId || typeof ponyId !== 'string') {
        throw new Error(`Invalid ponyId (${ponyId})`);
    }
    await kickFromAllServersByCharacter(ponyId);
    const character = await removeCharacter(ponyId, accountId);
    await updateCharacterCount(accountId);
    if (character) {
        logRemovedCharacter(character);
        removedCharacter(ponyId);
    }
    return {};
};
exports.createRemovePony = createRemovePony;
//# sourceMappingURL=pony.js.map