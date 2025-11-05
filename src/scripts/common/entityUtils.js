"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIT_ON_BOUNDS_OFFSET = exports.SIT_ON_BOUNDS_HEIGHT = exports.SIT_ON_BOUNDS_WIDTH = void 0;
exports.releaseEntity = releaseEntity;
exports.addChatBubble = addChatBubble;
exports.updateEntityVelocity = updateEntityVelocity;
exports.compareEntities = compareEntities;
exports.sortEntities = sortEntities;
exports.closestEntity = closestEntity;
exports.getBoopRect = getBoopRect;
exports.isMoving = isMoving;
exports.isDrawable = isDrawable;
exports.canLand = canLand;
exports.canStand = canStand;
exports.canSit = canSit;
exports.canLie = canLie;
exports.entityInRange = entityInRange;
exports.getInteractBounds = getInteractBounds;
exports.getSitOnBounds = getSitOnBounds;
exports.isIdleAnimation = isIdleAnimation;
exports.isIdle = isIdle;
exports.canBoop = canBoop;
exports.canBoop2 = canBoop2;
exports.isHidden = isHidden;
exports.isIgnored = isIgnored;
exports.isFriend = isFriend;
exports.isInTheAir = isInTheAir;
exports.isFlying = isFlying;
exports.isFacingRight = isFacingRight;
exports.hasHeadTurned = hasHeadTurned;
exports.isHeadFacingRight = isHeadFacingRight;
exports.getPonyState = getPonyState;
exports.setPonyState = setPonyState;
exports.isSittingState = isSittingState;
exports.isLyingState = isLyingState;
exports.isPonyWalking = isPonyWalking;
exports.isPonyTrotting = isPonyTrotting;
exports.isPonySitting = isPonySitting;
exports.isPonyStanding = isPonyStanding;
exports.isPonyLying = isPonyLying;
exports.isPonyFlying = isPonyFlying;
exports.isPonyLandedOrCanLand = isPonyLandedOrCanLand;
exports.isDecal = isDecal;
exports.isCritter = isCritter;
const timsort_1 = require("timsort");
const utils_1 = require("./utils");
const ponyAnimations_1 = require("../client/ponyAnimations");
const pony_1 = require("./pony");
const positionUtils_1 = require("./positionUtils");
const paletteManager_1 = require("../graphics/paletteManager");
const rect_1 = require("./rect");
const worldMap_1 = require("./worldMap");
const constants_1 = require("./constants");
const collision_1 = require("./collision");
function releaseEntity(entity) {
    if ((0, pony_1.isPony)(entity)) {
        (0, pony_1.releasePony)(entity);
    }
    if (entity.palettes !== undefined) {
        for (const palette of entity.palettes) {
            (0, paletteManager_1.releasePalette)(palette);
        }
    }
}
function addChatBubble(map, entity, says) {
    entity.says = says;
    (0, utils_1.pushUniq)(map.entitiesWithChat, entity);
}
function updateEntityVelocity(map, entity, vx, vy) {
    const wasMoving = isMoving(entity);
    entity.vx = vx;
    entity.vy = vy;
    const isMovingNow = isMoving(entity);
    (0, worldMap_1.addOrRemoveFromEntityList)(map.entitiesMoving, entity, wasMoving, isMovingNow);
}
function compareEntities(a, b) {
    return ((0, positionUtils_1.toScreenY)(a.y) - (0, positionUtils_1.toScreenY)(b.y))
        || (a.order - b.order)
        || (b.id - a.id)
        || ((0, positionUtils_1.toScreenX)(a.x) - (0, positionUtils_1.toScreenX)(b.x))
        || ((0, positionUtils_1.toScreenY)(a.z) - (0, positionUtils_1.toScreenY)(b.z));
}
function sortEntities(entities) {
    (0, timsort_1.sort)(entities, compareEntities);
}
function closestEntity(point, entities) {
    return entities.reduce((best, entity) => (0, utils_1.distance)(point, entity) < (0, utils_1.distance)(point, best) ? entity : best, entities[0]);
}
function getBoopRect(entity) {
    const right = (0, utils_1.hasFlag)(entity.state, 2 /* EntityState.FacingRight */);
    const sitting = isPonySitting(entity);
    return (0, rect_1.rect)(entity.x + (right ? 0.6 : -0.9) * (sitting ? 0.6 : 1), entity.y - 0.2, 0.3, 0.4);
}
function isMoving(entity) {
    return entity.vx !== 0 || entity.vy !== 0;
}
function isDrawable(entity) {
    return entity.type === constants_1.PONY_TYPE || entity.draw !== undefined;
}
function canLand(entity, map) {
    return !(0, collision_1.isStaticCollision)(entity, map, true);
}
function canStand(entity, map) {
    return !isPonyStanding(entity) && isPonyLandedOrCanLand(entity, map);
}
function canSit(entity, map) {
    return !isPonySitting(entity) && isPonyLandedOrCanLand(entity, map) && !isMoving(entity);
}
function canLie(entity, map) {
    return !isPonyLying(entity) && isPonyLandedOrCanLand(entity, map) && !isMoving(entity);
}
function entityInRange(entity, player) {
    return (!entity.interactRange || (0, utils_1.distance)(player, entity) < entity.interactRange);
}
function getInteractBounds(pony) {
    const boundsWidth = 1;
    const boundsHeight = 1;
    const boundsOffset = 0.5 + (isPonySitting(pony) ? -0.3 : (isPonyLying(pony) ? -0.2 : 0));
    return (0, rect_1.rect)((0, positionUtils_1.toScreenX)(isFacingRight(pony) ? (pony.x + boundsOffset) : (pony.x - boundsOffset - boundsWidth)), (0, positionUtils_1.toScreenY)(pony.y - boundsHeight / 2), (0, positionUtils_1.toScreenX)(boundsWidth), (0, positionUtils_1.toScreenY)(boundsHeight));
}
exports.SIT_ON_BOUNDS_WIDTH = 1.2;
exports.SIT_ON_BOUNDS_HEIGHT = 0.5;
exports.SIT_ON_BOUNDS_OFFSET = 0.4;
function getSitOnBounds(pony) {
    const width = exports.SIT_ON_BOUNDS_WIDTH;
    const height = exports.SIT_ON_BOUNDS_HEIGHT;
    const offset = isFacingRight(pony) ? -exports.SIT_ON_BOUNDS_OFFSET : (exports.SIT_ON_BOUNDS_OFFSET - exports.SIT_ON_BOUNDS_WIDTH);
    return (0, rect_1.rect)((0, positionUtils_1.toScreenX)(pony.x + offset), (0, positionUtils_1.toScreenY)(pony.y - exports.SIT_ON_BOUNDS_HEIGHT / 2), (0, positionUtils_1.toScreenX)(width), (0, positionUtils_1.toScreenY)(height));
}
// pony state
function isIdleAnimation(animation) {
    return animation === ponyAnimations_1.stand || animation === ponyAnimations_1.sit || animation === ponyAnimations_1.lie || animation === ponyAnimations_1.fly ||
        animation === ponyAnimations_1.flyBug || animation === ponyAnimations_1.swim;
}
function isIdle(pony) {
    return !isMoving(pony) && isIdleAnimation(pony.ponyState.animation);
}
function canBoop(pony) {
    return isIdle(pony);
}
function canBoop2(entity) {
    return !isMoving(entity) && (isPonyStanding(entity) || isPonySitting(entity) || isPonyLying(entity) || isPonyFlying(entity));
}
// entity player state
function isHidden(entity) {
    return (entity.playerState & 2 /* EntityPlayerState.Hidden */) !== 0;
}
function isIgnored(entity) {
    return (entity.playerState & 1 /* EntityPlayerState.Ignored */) !== 0;
}
function isFriend(entity) {
    return (entity.playerState & 4 /* EntityPlayerState.Friend */) !== 0;
}
function isInTheAir(entity) {
    return isFlying(entity) && (entity.inTheAirDelay === undefined || entity.inTheAirDelay <= 0);
}
// entity state
function isFlying(entity) {
    return (entity.state & 1 /* EntityState.Flying */) !== 0;
}
function isFacingRight(entity) {
    return (entity.state & 2 /* EntityState.FacingRight */) !== 0;
}
function hasHeadTurned(entity) {
    return (entity.state & 4 /* EntityState.HeadTurned */) !== 0;
}
function isHeadFacingRight(entity) {
    const headTurned = hasHeadTurned(entity);
    const facingRight = isFacingRight(entity);
    return facingRight ? !headTurned : headTurned;
}
function getPonyState(state) {
    return state & 240 /* EntityState.PonyStateMask */;
}
function setPonyState(state, set) {
    state = (state & ~240 /* EntityState.PonyStateMask */) | set;
    state = (0, utils_1.setFlag)(state, 1 /* EntityState.Flying */, set === 80 /* EntityState.PonyFlying */);
    return state;
}
function isSittingState(state) {
    return getPonyState(state) === 48 /* EntityState.PonySitting */;
}
function isLyingState(state) {
    return getPonyState(state) === 64 /* EntityState.PonyLying */;
}
function isPonyWalking(entity) {
    return getPonyState(entity.state) === 16 /* EntityState.PonyWalking */;
}
function isPonyTrotting(entity) {
    return getPonyState(entity.state) === 32 /* EntityState.PonyTrotting */;
}
function isPonySitting(entity) {
    return getPonyState(entity.state) === 48 /* EntityState.PonySitting */;
}
function isPonyStanding(entity) {
    return getPonyState(entity.state) === 0 /* EntityState.PonyStanding */;
}
function isPonyLying(entity) {
    return getPonyState(entity.state) === 64 /* EntityState.PonyLying */;
}
function isPonyFlying(entity) {
    return getPonyState(entity.state) === 80 /* EntityState.PonyFlying */;
}
function isPonyLandedOrCanLand(entity, map) {
    return !isPonyFlying(entity) || canLand(entity, map);
}
// entity flags
function isDecal(entity) {
    return (entity.flags & 2 /* EntityFlags.Decal */) !== 0;
}
function isCritter(entity) {
    return (entity.flags & 4 /* EntityFlags.Critter */) !== 0;
}
//# sourceMappingURL=entityUtils.js.map