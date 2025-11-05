"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIgnorePlayer = void 0;
exports.isMutedOrShadowed = isMutedOrShadowed;
exports.isIgnored = isIgnored;
exports.kickClient = kickClient;
exports.getCounter = getCounter;
exports.createClientAndPony = createClientAndPony;
exports.updateClientCharacter = updateClientCharacter;
exports.createClient = createClient;
exports.resetClientUpdates = resetClientUpdates;
exports.createCharacterState = createCharacterState;
exports.createAndUpdateCharacterState = createAndUpdateCharacterState;
exports.addIgnore = addIgnore;
exports.removeIgnore = removeIgnore;
exports.findClientByEntityId = findClientByEntityId;
exports.cancelEntityExpression = cancelEntityExpression;
exports.setEntityExpression = setEntityExpression;
exports.playerBlush = playerBlush;
exports.parseOrCurrentExpression = parseOrCurrentExpression;
exports.playerSleep = playerSleep;
exports.playerLove = playerLove;
exports.playerCry = playerCry;
exports.interactWith = interactWith;
exports.useHeldItem = useHeldItem;
exports.canPerformAction = canPerformAction;
exports.updateEntityPlayerState = updateEntityPlayerState;
exports.turnHead = turnHead;
exports.boop = boop;
exports.stand = stand;
exports.sit = sit;
exports.lie = lie;
exports.fly = fly;
exports.expressionAction = expressionAction;
exports.holdItem = holdItem;
exports.unholdItem = unholdItem;
exports.holdToy = holdToy;
exports.unholdToy = unholdToy;
exports.getCollectedToysCount = getCollectedToysCount;
exports.getNextToyOrExtra = getNextToyOrExtra;
exports.openGift = openGift;
exports.isGift = isGift;
exports.isHiddenBy = isHiddenBy;
exports.getPlayerState = getPlayerState;
exports.reloadFriends = reloadFriends;
exports.execAction = execAction;
exports.switchTool = switchTool;
exports.teleportTo = teleportTo;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const ag_sockets_1 = require("ag-sockets");
const db_1 = require("./db");
const entities = tslib_1.__importStar(require("../common/entities"));
const adminUtils_1 = require("../common/adminUtils");
const serverUtils_1 = require("./serverUtils");
const utils_1 = require("../common/utils");
const interfaces_1 = require("../common/interfaces");
const expressionEncoder_1 = require("../common/encoders/expressionEncoder");
const constants_1 = require("../common/constants");
const camera_1 = require("../common/camera");
const serverMap_1 = require("./serverMap");
const reporter_1 = require("./reporter");
const accountUtils_1 = require("./accountUtils");
const accountUtils_2 = require("../common/accountUtils");
const originUtils_1 = require("./originUtils");
const characterUtils_1 = require("./characterUtils");
const entityUtils_1 = require("./entityUtils");
const emoji_1 = require("../client/emoji");
const expressionUtils_1 = require("../common/expressionUtils");
const entityUtils_2 = require("../common/entityUtils");
const rect_1 = require("../common/rect");
const friends_1 = require("./services/friends");
const entities_1 = require("../common/entities");
const chat_1 = require("./chat");
function isMutedOrShadowed(client) {
    return client.shadowed || (0, adminUtils_1.isMuted)(client.account);
}
function isIgnored(ignoring, target) {
    return target.ignores.has(ignoring.accountId);
}
function kickClient(client, reason = 'kicked') {
    client.leaveReason = reason;
    client.disconnect(true, true);
}
function getCounter(client, key) {
    return (0, utils_1.toInt)(client.account.state && client.account.state[key]);
}
function createClientAndPony(client, friends, hides, server, world, states) {
    const { account, character } = client.tokenData;
    const origin = client.originalRequest && (0, originUtils_1.getOriginFromHTTP)(client.originalRequest);
    const reporter = (0, reporter_1.create)(server, account._id, character._id, origin);
    const state = (0, characterUtils_1.getAndFixCharacterState)(server, character, world, states);
    client.characterState = state;
    const pony = (0, characterUtils_1.createPony)(account, character, state);
    pony.client = createClient(client, account, friends, hides, character, pony, world.getMainMap(), reporter, origin);
    (0, camera_1.centerCameraOn)(client.camera, pony);
}
function updateClientCharacter(client, character) {
    client.character = character;
    client.characterId = client.character._id.toString();
    client.characterName = (0, emoji_1.replaceEmojis)(client.character.name);
}
function createClient(client, account, friends, hides, character, pony, defaultMap, reporter, origin) {
    updateClientCharacter(client, character);
    client.ip = origin && origin.ip || '';
    client.country = origin && origin.country || '??';
    client.userAgent = client.originalRequest && client.originalRequest.headers['user-agent'];
    client.accountId = account._id.toString();
    client.accountName = account.name;
    client.ignores = new Set(account.ignores);
    client.hides = new Set();
    client.permaHides = new Set(hides);
    client.friends = new Set(friends);
    client.friendsCRC = undefined;
    client.accountSettings = { ...account.settings };
    client.supporterLevel = (0, adminUtils_1.supporterLevel)(account);
    client.isMod = (0, accountUtils_2.isMod)(account);
    client.reporter = reporter;
    client.account = account;
    client.character = character;
    client.pony = pony;
    client.map = defaultMap;
    client.isSwitchingMap = false;
    client.notifications = [];
    client.regions = [];
    client.shadowed = (0, adminUtils_1.isShadowed)(account);
    client.country = origin && origin.country || '??';
    client.camera = (0, camera_1.createCamera)();
    client.camera.w = 800;
    client.camera.h = 600;
    client.safeX = pony.x;
    client.safeY = pony.y;
    client.lastPacket = Date.now();
    client.lastAction = 0;
    client.lastBoopAction = 0;
    client.lastExpressionAction = 0;
    client.lastSays = [];
    client.lastX = pony.x;
    client.lastY = pony.y;
    client.lastTime = 0;
    client.lastVX = 0;
    client.lastVY = 0;
    client.lastMapSwitch = 0;
    client.lastSitX = 0;
    client.lastSitY = 0;
    client.lastSitTime = 0;
    client.sitCount = 0;
    client.lastSwap = 0;
    client.lastMapLoadOrSave = 0;
    client.lastCameraX = 0;
    client.lastCameraY = 0;
    client.lastCameraW = 0;
    client.lastCameraH = 0;
    client.updateQueue = (0, ag_sockets_1.createBinaryWriter)(128);
    client.regionUpdates = [];
    client.saysQueue = [];
    client.unsubscribes = [];
    client.subscribes = [];
    client.positions = [];
    return client;
}
function resetClientUpdates(client) {
    (0, ag_sockets_1.resetWriter)(client.updateQueue);
    client.regionUpdates.length = 0;
    client.saysQueue.length = 0;
    client.unsubscribes.length = 0;
    client.subscribes.length = 0;
}
function createCharacterState(entity, map) {
    const options = entity.options;
    const flags = ((0, utils_1.hasFlag)(entity.state, 2 /* EntityState.FacingRight */) ? 1 /* CharacterStateFlags.Right */ : 0) |
        (options.extra ? 2 /* CharacterStateFlags.Extra */ : 0);
    const state = { x: entity.x, y: entity.y };
    if (flags) {
        state.flags = flags;
    }
    if (map.id) {
        state.map = map.id;
    }
    if (options.hold) {
        state.hold = entities.getEntityTypeName(options.hold);
    }
    if (options.toy) {
        state.toy = options.toy;
    }
    return state;
}
async function createAndUpdateCharacterState(client, server) {
    const state = createCharacterState(client.pony, client.map);
    await (0, characterUtils_1.updateCharacterState)(client.characterId, server.id, state);
}
// utils
function addIgnore(target, accountId) {
    target.account.ignores = target.account.ignores || [];
    target.account.ignores.push(accountId);
    target.ignores.add(accountId);
}
function removeIgnore(target, accountId) {
    if (target.account.ignores) {
        (0, utils_1.removeItem)(target.account.ignores, accountId);
    }
    target.ignores.delete(accountId);
}
const createIgnorePlayer = (updateAccount, handlePromise = serverUtils_1.handlePromiseDefault) => (client, target, ignored) => {
    if (target.accountId === client.accountId)
        return;
    const id = client.accountId;
    const is = isIgnored(client, target);
    if (ignored === is)
        return;
    if (ignored) {
        addIgnore(target, id);
    }
    else {
        removeIgnore(target, id);
    }
    handlePromise(updateAccount(target.accountId, { [ignored ? '$push' : '$pull']: { ignores: id } })
        .then(() => updateEntityPlayerState(client, target.pony))
        .then(() => {
        const { accountId, account, character } = target;
        const message = `${ignored ? 'ignored' : 'unignored'} ${character.name} (${account.name}) [${accountId}]`;
        client.reporter.systemLog(message);
    }), client.reporter.error);
};
exports.createIgnorePlayer = createIgnorePlayer;
function findClientByEntityId(self, entityId) {
    const selected = self.selected;
    if (selected && selected.id === entityId && selected.client) {
        return selected.client;
    }
    if (self.party) { // TODO: remove ?
        const client = self.party.clients.find(c => c.pony.id === entityId);
        if (client) {
            //this.logger.log('client from party');
            return client;
        }
        const pending = self.party.pending.find(c => c.client.pony.id === entityId);
        if (pending) {
            //this.logger.log('pending from party');
            return pending.client;
        }
    }
    const notification = self.notifications.find(c => c.entityId === entityId);
    if (notification) {
        //this.logger.log('sender from notification');
        return notification.sender;
    }
    return undefined;
}
function cancelEntityExpression(entity) {
    if (entity.exprCancellable) {
        setEntityExpression(entity, undefined);
    }
}
function setEntityExpression(entity, expression, timeout = constants_1.EXPRESSION_TIMEOUT, cancellable = false) {
    expression = expression || entity.exprPermanent;
    const expr = (0, expressionEncoder_1.encodeExpression)(expression);
    entity.options.expr = expr;
    if (expression && timeout) {
        entity.exprTimeout = Date.now() + timeout;
    }
    else {
        entity.exprTimeout = undefined;
    }
    const sleeping = expression !== undefined && (0, utils_1.hasFlag)(expression.extra, 2 /* ExpressionExtra.Zzz */);
    entity.exprCancellable = cancellable || sleeping;
    (0, entityUtils_1.updateEntityExpression)(entity);
}
function playerBlush(pony, args = '') {
    const expr = parseOrCurrentExpression(pony, args) || (0, expressionUtils_1.expression)(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 2 /* Muzzle.Neutral */);
    expr.extra |= 1 /* ExpressionExtra.Blush */;
    setEntityExpression(pony, expr, constants_1.DAY, !!pony.exprCancellable);
}
function parseOrCurrentExpression(pony, message) {
    return (0, expressionUtils_1.parseExpression)(message)
        || (0, expressionEncoder_1.decodeExpression)((!pony.options || pony.options.expr == null) ? expressionEncoder_1.EMPTY_EXPRESSION : pony.options.expr);
}
function playerSleep(pony, args = '') {
    if (pony.vx === 0 && pony.vy === 0) {
        const base = parseOrCurrentExpression(pony, args) || (0, expressionUtils_1.expression)(6 /* Eye.Closed */, 6 /* Eye.Closed */, 2 /* Muzzle.Neutral */);
        const muzzle = interfaces_1.CLOSED_MUZZLES.indexOf(base.muzzle) !== -1 ? base.muzzle : 2 /* Muzzle.Neutral */;
        const expr = { ...base, muzzle, left: 6 /* Eye.Closed */, right: 6 /* Eye.Closed */, extra: 2 /* ExpressionExtra.Zzz */ };
        setEntityExpression(pony, expr, 0, true);
    }
}
function playerLove(pony, args = '') {
    const expr = parseOrCurrentExpression(pony, args) || (0, expressionUtils_1.expression)(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 0 /* Muzzle.Smile */);
    expr.extra |= 16 /* ExpressionExtra.Hearts */;
    setEntityExpression(pony, expr, constants_1.DAY, !!pony.exprCancellable);
}
function playerCry(pony, args = '') {
    const expr = (0, expressionUtils_1.parseExpression)(args) || (0, expressionUtils_1.expression)(15 /* Eye.Sad */, 15 /* Eye.Sad */, 1 /* Muzzle.Frown */);
    expr.extra = expr.extra | 4 /* ExpressionExtra.Cry */;
    setEntityExpression(pony, expr, 0);
}
const fruitTypes = entities.fruits.map(f => f.type);
function interactWith(client, target) {
    if (target) {
        const pony = client.pony;
        if (target.interact && (!target.interactRange || (0, utils_1.distance)(pony, target) < target.interactRange)) {
            target.interact(target, client);
        }
        else if (target.triggerBounds && target.trigger) {
            if ((0, utils_1.containsPointWitBorder)(target.x, target.y, target.triggerBounds, pony.x, pony.y, 3)) {
                target.trigger(target, client);
            }
            else {
                DEVELOPMENT && console.warn(`outside trigger bounds ` +
                    `(bounds: ${target.x} ${target.y} ${JSON.stringify(target.triggerBounds)} point: ${pony.x} ${pony.y})`);
            }
        }
        else if (target.interactAction) {
            switch (target.interactAction) {
                case 1 /* InteractAction.Toolbox */: {
                    switchTool(client, false);
                    break;
                }
                case 2 /* InteractAction.GiveLantern */: {
                    if (client.pony.options.hold === entities.lanternOn.type) {
                        unholdItem(pony);
                    }
                    else {
                        holdItem(pony, entities.lanternOn.type);
                    }
                    break;
                }
                case 3 /* InteractAction.GiveFruits */: {
                    const index = fruitTypes.indexOf(client.pony.options.hold || 0) + 1;
                    holdItem(client.pony, fruitTypes[index % fruitTypes.length]);
                    break;
                }
                case 4 /* InteractAction.GiveCookie1 */: {
                    const hold = client.pony.options.hold;
                    let cookie = hold;
                    while (hold === cookie) {
                        cookie = (0, lodash_1.sample)(entities.candies1Types);
                    }
                    holdItem(client.pony, cookie);
                    break;
                }
                case 5 /* InteractAction.GiveCookie2 */: {
                    const hold = client.pony.options.hold;
                    let cookie = hold;
                    while (hold === cookie) {
                        cookie = (0, lodash_1.sample)(entities.candies2Types);
                    }
                    holdItem(client.pony, cookie);
                    break;
                }
                default:
                    (0, utils_1.invalidEnum)(target.interactAction);
            }
        }
    }
}
function useHeldItem(client) {
    const hold = client.pony.options.hold || 0;
    if (isGift(hold)) {
        openGift(client);
    }
}
function canPerformAction(client) {
    return client.lastAction < Date.now();
}
function updateEntityPlayerState(client, entity) {
    const playerState = getPlayerState(client, entity);
    (0, entityUtils_1.pushUpdateEntityToClient)(client, { entity, flags: 1024 /* UpdateFlags.PlayerState */, playerState });
}
// actions
function turnHead(client) {
    if (canPerformAction(client)) {
        (0, entityUtils_1.updateEntityState)(client.pony, client.pony.state ^ 4 /* EntityState.HeadTurned */);
    }
}
const purpleGrapeTypes = entities.grapesPurple.map(x => x.type);
const greenGrapeTypes = entities.grapesGreen.map(x => x.type);
function boop(client, now) {
    if (canPerformAction(client) && (0, entityUtils_2.canBoop2)(client.pony) && client.lastBoopAction < now) {
        cancelEntityExpression(client.pony);
        (0, entityUtils_1.sendAction)(client.pony, 1 /* Action.Boop */);
        if (!client.shadowed && ((0, entityUtils_2.isPonySitting)(client.pony) || (0, entityUtils_2.isPonyStanding)(client.pony))) {
            const boopRect = (0, entityUtils_2.getBoopRect)(client.pony);
            const boopBounds = (0, rect_1.withBorder)(boopRect, 1);
            const entities = (0, serverMap_1.findEntitiesInBounds)(client.map, boopBounds);
            const entity = entities.find(e => (0, entityUtils_1.canBoopEntity)(e, boopRect));
            if (entity) {
                if (entity.boop) {
                    entity.boop(client);
                }
                else if (entity.type === constants_1.PONY_TYPE) {
                    const clientHold = client.pony.options.hold || 0;
                    if ((0, entityUtils_1.isHoldingGrapes)(entity) && clientHold !== entities_1.grapeGreen.type && clientHold !== entities_1.grapePurple.type) {
                        let index = purpleGrapeTypes.indexOf(entity.options.hold || 0);
                        if (index !== -1) {
                            holdItem(client.pony, entities_1.grapePurple.type);
                            if (index === (purpleGrapeTypes.length - 1)) {
                                unholdItem(entity);
                            }
                            else {
                                holdItem(entity, purpleGrapeTypes[index + 1]);
                            }
                        }
                        else {
                            let index = greenGrapeTypes.indexOf(entity.options.hold || 0);
                            if (index !== -1) {
                                holdItem(client.pony, entities_1.grapeGreen.type);
                                if (index === (greenGrapeTypes.length - 1)) {
                                    unholdItem(entity);
                                }
                                else {
                                    holdItem(entity, greenGrapeTypes[index + 1]);
                                }
                            }
                        }
                    }
                }
            }
        }
        client.lastBoopAction = now + 500;
    }
}
function stand(client) {
    if (canPerformAction(client) && (0, entityUtils_2.canStand)(client.pony, client.map)) {
        if (!(0, entityUtils_2.isPonyFlying)(client.pony)) {
            cancelEntityExpression(client.pony);
        }
        (0, entityUtils_1.updateEntityState)(client.pony, (0, entityUtils_2.setPonyState)(client.pony.state, 0 /* EntityState.PonyStanding */));
    }
}
const SIT_MAX_TIME = 2 * constants_1.SECOND;
const SIT_MAX_DIST = 1;
const SIT_MAX_COUNT = 5;
function checkSuspiciousSitting(client) {
    const now = Date.now();
    const { x, y } = client.pony;
    const dist = (0, utils_1.distanceXY)(x, y, client.lastSitX, client.lastSitY);
    if ((now - client.lastSitTime) < SIT_MAX_TIME && dist < SIT_MAX_DIST && (0, entityUtils_1.findPlayersThetCanBeSitOn)(client.map, client.pony)) {
        client.sitCount++;
        if (client.sitCount > SIT_MAX_COUNT) {
            client.reporter.warn(`Suspicious sitting`);
            client.sitCount = 0;
        }
    }
    else {
        client.sitCount = 1;
    }
    client.lastSitX = x;
    client.lastSitY = y;
    client.lastSitTime = now;
}
function sit(client, settings) {
    if (canPerformAction(client) && (0, entityUtils_2.canSit)(client.pony, client.map)) {
        (0, entityUtils_1.updateEntityState)(client.pony, (0, entityUtils_2.setPonyState)(client.pony.state, 48 /* EntityState.PonySitting */));
        if (settings.reportSitting) {
            checkSuspiciousSitting(client);
        }
    }
}
function lie(client) {
    if (canPerformAction(client) && (0, entityUtils_2.canLie)(client.pony, client.map)) {
        (0, entityUtils_1.updateEntityState)(client.pony, (0, entityUtils_2.setPonyState)(client.pony.state, 64 /* EntityState.PonyLying */));
    }
}
function fly(client) {
    if (canPerformAction(client) && client.pony.canFly && !(0, entityUtils_2.isPonyFlying)(client.pony)) {
        cancelEntityExpression(client.pony);
        (0, entityUtils_1.updateEntityState)(client.pony, (0, entityUtils_2.setPonyState)(client.pony.state, 80 /* EntityState.PonyFlying */));
        client.pony.inTheAirDelay = constants_1.FLY_DELAY;
    }
}
function expressionAction(client, action) {
    if (canPerformAction(client) && (0, interfaces_1.isExpressionAction)(action) && client.lastExpressionAction < Date.now()) {
        cancelEntityExpression(client.pony);
        (0, entityUtils_1.sendAction)(client.pony, action);
        client.lastExpressionAction = Date.now() + 500;
    }
}
// hold
function holdItem(entity, hold) {
    if (entity.options && entity.options.hold !== hold) {
        (0, entityUtils_1.updateEntityOptions)(entity, { hold });
    }
}
function unholdItem(entity) {
    if (entity.options && entity.options.hold) {
        (0, entityUtils_1.updateEntityOptions)(entity, { hold: 0 });
        delete entity.options.hold;
    }
}
// toy
function holdToy(entity, toy) {
    if (entity.options && entity.options.toy !== toy) {
        (0, entityUtils_1.updateEntityOptions)(entity, { toy });
    }
}
function unholdToy(entity) {
    if (entity.options && entity.options.toy) {
        (0, entityUtils_1.updateEntityOptions)(entity, { toy: 0 });
        delete entity.options.toy;
    }
}
// gifts and toys
const giftTypes = [entities.gift2.type];
const toys = [
    // hat
    { type: 0, multiplier: 20 },
    { type: 0, multiplier: 10 },
    { type: 0, multiplier: 5 },
    { type: 0, multiplier: 1 }, // pink
    // snowpony
    { type: 0, multiplier: 20 },
    { type: 0, multiplier: 10 }, // clothes
    { type: 0, multiplier: 1 }, // evil
    // gift
    { type: 0, multiplier: 20 },
    { type: 0, multiplier: 10 },
    { type: 0, multiplier: 10 },
    { type: 0, multiplier: 5 },
    { type: 0, multiplier: 1 },
    // hanging thing
    { type: 0, multiplier: 20 }, // bell
    { type: 0, multiplier: 10 }, // mistletoe
    { type: 0, multiplier: 5 }, // cookie
    { type: 0, multiplier: 1 }, // spider
    // teddy
    { type: 0, multiplier: 20 }, // brown
    { type: 0, multiplier: 10 }, // brown angel
    { type: 0, multiplier: 20 }, // black
    { type: 0, multiplier: 10 }, // black angel
    { type: 0, multiplier: 5 }, // brown clothes
    { type: 0, multiplier: 5 }, // black clothes
    { type: 0, multiplier: 1 }, // white santa
    // xmas tree
    { type: 0, multiplier: 10 },
    { type: 0, multiplier: 5 },
    // deer
    { type: 0, multiplier: 5 },
    { type: 0, multiplier: 1 }, // with clothes
    // candy horns
    { type: 0, multiplier: 10 }, // one
    { type: 0, multiplier: 2 }, // two
    { type: 0, multiplier: 1 }, // two (alt)
    // star
    { type: 0, multiplier: 5 },
    // halo
    { type: 0, multiplier: 5 },
];
toys.forEach((toy, i) => toy.type = i + 1);
const toyTypes = (0, utils_1.flatten)(toys.map(x => (0, utils_1.array)(x.multiplier, x.type)));
function hasToyUnlocked(type, collectedToys) {
    const index = toys.findIndex(t => t.type === type);
    return (0, utils_1.hasFlag)(collectedToys, 1 << index);
}
function unlockToy(type, collectedToys) {
    const index = toys.findIndex(t => t.type === type);
    return collectedToys | (1 << index);
}
function getCollectedToysCount(client) {
    const stateToys = (0, utils_1.toInt)((client.account.state || {}).toys);
    const total = toys.length;
    let collected = 0;
    for (let i = 0, bit = 1; i < total; i++, bit <<= 1) {
        if (stateToys & bit) {
            collected++;
        }
    }
    return { collected, total };
}
function getNextToyOrExtra(client) {
    const collectedToys = (0, utils_1.toInt)((client.account.state || {}).toys);
    const options = client.pony.options || {};
    const extra = !!options.extra;
    const toy = (0, utils_1.toInt)(options.toy);
    if (extra) {
        return { extra: false, toy: 0 };
    }
    else {
        for (let i = toys.findIndex(t => t.type === toy) + 1; i < toys.length; i++) {
            const type = toys[i].type;
            if (hasToyUnlocked(type, collectedToys)) {
                return { extra: false, toy: type };
            }
        }
        return { extra: true, toy: 0 };
    }
}
function openGift(client) {
    const options = client.pony.options || {};
    if (isGift(options.hold)) {
        let toyType = 0;
        do {
            toyType = (0, lodash_1.sample)(toyTypes);
        } while (toyType === options.toy);
        (0, entityUtils_1.sendAction)(client.pony, 12 /* Action.HoldPoof */);
        unholdItem(client.pony);
        setTimeout(() => holdToy(client.pony, toyType), 200);
        const state = client.account.state || {};
        if (!hasToyUnlocked(toyType, (0, utils_1.toInt)(state.toys))) {
            (0, accountUtils_1.updateAccountState)(client.account, state => {
                state.toys = unlockToy(toyType, (0, utils_1.toInt)(state.toys));
            });
        }
    }
}
function isGift(type) {
    return type !== undefined && (0, utils_1.includes)(giftTypes, type);
}
function isHiddenBy(a, b) {
    return a.hides.has(b.accountId) || b.hides.has(a.accountId) ||
        a.permaHides.has(b.accountId) || b.permaHides.has(a.accountId);
}
function getPlayerState(client, entity) {
    let state = 0 /* EntityPlayerState.None */;
    if (entity.client !== undefined) {
        if (isIgnored(client, entity.client)) {
            state |= 1 /* EntityPlayerState.Ignored */;
        }
        if (isHiddenBy(client, entity.client)) {
            state |= 2 /* EntityPlayerState.Hidden */;
        }
        if ((0, friends_1.isOnlineFriend)(client, entity.client)) {
            state |= 4 /* EntityPlayerState.Friend */;
        }
    }
    return state;
}
async function reloadFriends(client) {
    const friends = await (0, db_1.findFriendIds)(client.accountId);
    client.friends = new Set(friends);
    client.friendsCRC = undefined;
    client.actionParam(0, 23 /* Action.FriendsCRC */, undefined);
}
function execAction(client, action, settings) {
    switch (action) {
        case 1 /* Action.Boop */:
            boop(client, Date.now());
            break;
        case 2 /* Action.TurnHead */:
            turnHead(client);
            break;
        case 10 /* Action.Stand */:
            stand(client);
            break;
        case 6 /* Action.Sit */:
            sit(client, settings);
            break;
        case 7 /* Action.Lie */:
            lie(client);
            break;
        case 8 /* Action.Fly */:
            fly(client);
            break;
        case 14 /* Action.Drop */:
            unholdItem(client.pony);
            break;
        case 13 /* Action.Sleep */:
            playerSleep(client.pony);
            break;
        case 16 /* Action.Blush */:
            playerBlush(client.pony);
            break;
        case 17 /* Action.Cry */:
            playerCry(client.pony);
            break;
        case 18 /* Action.Love */:
            playerLove(client.pony);
            break;
        case 15 /* Action.DropToy */:
            unholdToy(client.pony);
            (0, entityUtils_1.updateEntityOptions)(client.pony, { extra: false });
            break;
        case 26 /* Action.Magic */:
            if (client.pony.canMagic) {
                const has = (0, utils_1.hasFlag)(client.pony.state, 8 /* EntityState.Magic */);
                (0, entityUtils_1.updateEntityState)(client.pony, (0, utils_1.setFlag)(client.pony.state, 8 /* EntityState.Magic */, !has));
            }
            break;
        case 29 /* Action.SwitchTool */:
            switchTool(client, false);
            break;
        case 30 /* Action.SwitchToolRev */:
            switchTool(client, true);
            break;
        case 31 /* Action.SwitchToPlaceTool */:
            holdItem(client.pony, entities.hammer.type);
            break;
        case 32 /* Action.SwitchToTileTool */:
            holdItem(client.pony, entities.shovel.type);
            break;
        default:
            if ((0, interfaces_1.isExpressionAction)(action)) {
                expressionAction(client, action);
            }
            else {
                throw new Error(`Invalid action (${action})`);
            }
            break;
    }
}
function switchTool(client, reverse) {
    const hold = client.pony.options.hold || 0;
    const index = entities_1.tools.findIndex(t => t.type === hold);
    const unholdIndex = reverse ? 0 : entities_1.tools.length - 1;
    if (index === unholdIndex) {
        unholdItem(client.pony);
    }
    else {
        const newIndex = reverse ? (index === -1 ? entities_1.tools.length - 1 : index - 1) : ((index + 1) % entities_1.tools.length);
        const tool = entities_1.tools[newIndex];
        holdItem(client.pony, tool.type);
        (0, chat_1.saySystem)(client, tool.text);
    }
}
function teleportTo(client, x, y) {
    (0, entityUtils_1.fixPosition)(client.pony, client.map, x, y, true);
    client.safeX = client.pony.x;
    client.safeY = client.pony.y;
    client.lastTime = 0;
}
//# sourceMappingURL=playerUtils.js.map