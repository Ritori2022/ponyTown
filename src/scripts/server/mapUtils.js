"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.worldForTemplates = void 0;
exports.addSpawnPointIndicators = addSpawnPointIndicators;
exports.generateTileIndicesAndColliders = generateTileIndicesAndColliders;
exports.removePonies = removePonies;
exports.createDirectionSign = createDirectionSign;
exports.pickCandy = pickCandy;
exports.pickGift = pickGift;
exports.pickClover = pickClover;
exports.pickEgg = pickEgg;
exports.pickEntity = pickEntity;
exports.checkLantern = checkLantern;
exports.checkBasket = checkBasket;
exports.checkNotCollecting = checkNotCollecting;
exports.positionClover = positionClover;
exports.createBunny = createBunny;
const tslib_1 = require("tslib");
const positionUtils_1 = require("../common/positionUtils");
const worldMap_1 = require("../common/worldMap");
const serverRegion_1 = require("./serverRegion");
const entities = tslib_1.__importStar(require("../common/entities"));
const tileUtils_1 = require("../client/tileUtils");
const region_1 = require("../common/region");
const constants_1 = require("../common/constants");
const chat_1 = require("./chat");
const entityUtils_1 = require("./entityUtils");
const accountUtils_1 = require("./accountUtils");
const utils_1 = require("../common/utils");
const playerUtils_1 = require("./playerUtils");
const lodash_1 = require("lodash");
const serverMap_1 = require("./serverMap");
const collectableController_1 = require("./controllers/collectableController");
exports.worldForTemplates = {
    featureFlags: {},
    addEntity(entity, map) {
        (0, positionUtils_1.roundPosition)(entity);
        const region = (0, worldMap_1.getRegionGlobal)(map, entity.x, entity.y);
        entity.region = region;
        (0, serverRegion_1.addEntityToRegion)(region, entity, map);
        return entity;
    },
    removeEntity(entity, map) {
        let removed = false;
        if (entity.region) {
            removed = (0, serverRegion_1.removeEntityFromRegion)(entity.region, entity, map);
        }
        return removed;
    },
};
function addSpawnPointIndicators(world, map) {
    const addSpawn = ({ x, y, w, h }) => {
        world.addEntity(entities.spawnPole(x, y), map);
        if (w && h) {
            world.addEntity(entities.spawnPole(x + w, y), map);
            world.addEntity(entities.spawnPole(x, y + h), map);
            world.addEntity(entities.spawnPole(x + w, y + h), map);
        }
    };
    addSpawn(map.spawnArea);
    for (const spawn of Array.from(map.spawns.values())) {
        addSpawn(spawn);
    }
}
function generateTileIndicesAndColliders(map) {
    for (const region of map.regions) {
        (0, serverRegion_1.getRegionTiles)(region); // initialize encodedTiles
        if (region.tilesDirty) {
            (0, tileUtils_1.updateTileIndices)(region, map);
        }
    }
    for (const region of map.regions) {
        if (region.colliderDirty) {
            (0, region_1.generateRegionCollider)(region, map);
        }
    }
}
function removePonies(entities) {
    for (let i = entities.length - 1; i >= 0; i--) {
        if (entities[i].type === constants_1.PONY_TYPE) {
            entities.splice(i, 1);
        }
    }
}
function createDirectionSign(x, y, config) {
    const result = [];
    const options = { sign: {} };
    const lines = [];
    const { w = [], e = [], s = [], n = [] } = config;
    const max = (0, lodash_1.clamp)(Math.max(w.length, e.length, s.length, n.length), 3, 5);
    const skip = 5 - max;
    function parse(entries, arrow, plates, ox) {
        for (let i = 0; i < entries.length; i++) {
            const e = entries[i];
            if (e) {
                lines.push(`${arrow} ${e.name}`);
                const nameplate = plates[i](x + ox / constants_1.tileWidth, y);
                (0, entityUtils_1.setEntityName)(nameplate, e.name);
                result.push(nameplate);
            }
        }
    }
    if (config.r) {
        options.sign.r = config.r;
    }
    const ups = config.r ? entities.directionSignUpsRight : entities.directionSignUpsLeft;
    const downs = config.r ? entities.directionSignDownsLeft : entities.directionSignDownsRight;
    if (config.n) {
        options.sign.n = config.n.map(x => x ? x.icon : -1);
        parse(config.n, '↑', ups.slice(skip), 0);
    }
    if (config.w) {
        options.sign.w = config.w.map(x => x ? x.icon : -1);
        parse(config.w, '←', entities.directionSignLefts.slice(skip), -10);
    }
    if (config.e) {
        options.sign.e = config.e.map(x => x ? x.icon : -1);
        parse(config.e, '→', entities.directionSignRights.slice(skip), 10);
    }
    if (config.s) {
        options.sign.s = config.s.map(x => x ? x.icon : -1);
        parse(config.s, '↓', downs.slice(skip), 0);
    }
    const text = lines.join('\n');
    const entity = entities.directionSign(x, y, options);
    entity.interact = (entity, client) => (0, chat_1.sayTo)(client, entity, text, 1 /* MessageType.System */);
    result.push(entity);
    return result;
}
const patchTypes = [
    entities.cloverPatch3, entities.cloverPatch4, entities.cloverPatch5, entities.cloverPatch6, entities.cloverPatch7
].map(x => x.type);
const eggBasketTypes = entities.eggBaskets.map(b => b.type);
function pickCandy(client) {
    let count = 0;
    (0, accountUtils_1.updateAccountState)(client.account, state => state.candies = count = (0, utils_1.toInt)(state.candies) + 1);
    (0, chat_1.saySystem)(client, `${count} 🍬`);
}
function pickGift(client) {
    let count = 0;
    (0, accountUtils_1.updateAccountState)(client.account, state => state.gifts = count = (0, utils_1.toInt)(state.gifts) + 1);
    (0, chat_1.saySystem)(client, `${count} 🎁`);
    (0, playerUtils_1.holdItem)(client.pony, entities.gift2.type);
}
function pickClover(client) {
    let count = 0;
    (0, accountUtils_1.updateAccountState)(client.account, state => state.clovers = count = (0, utils_1.toInt)(state.clovers) + 1);
    (0, chat_1.saySystem)(client, `${count} 🍀`);
    (0, playerUtils_1.holdItem)(client.pony, entities.cloverPick.type);
}
function pickEgg(client) {
    let count = 0;
    (0, accountUtils_1.updateAccountState)(client.account, state => state.eggs = count = (0, utils_1.toInt)(state.eggs) + 1);
    (0, chat_1.saySystem)(client, `${count} 🥚`);
    if (Math.random() < 0.05) {
        const options = client.pony.options;
        const basketIndex = eggBasketTypes.indexOf(options.hold || 0);
        if (basketIndex >= 0 && basketIndex < (eggBasketTypes.length - 1)) {
            (0, playerUtils_1.holdItem)(client.pony, eggBasketTypes[basketIndex + 1]);
        }
    }
}
function pickEntity(client, entity) {
    (0, playerUtils_1.holdItem)(client.pony, entity.type);
}
function checkLantern(client) {
    const options = client.pony.options;
    const canPick = options.hold === entities.jackoLanternOn.type || options.hold === entities.jackoLanternOff.type;
    if (!canPick) {
        (0, chat_1.saySystem)(client, 'Get a lantern to collect candies');
    }
    return canPick;
}
function checkBasket(client) {
    const options = client.pony.options;
    const canPick = (0, utils_1.includes)(eggBasketTypes, options.hold);
    if (!canPick) {
        (0, chat_1.saySystem)(client, 'Get a basket to collect eggs');
    }
    return canPick;
}
function checkNotCollecting(client) {
    const options = client.pony.options;
    const canPick = (0, utils_1.includes)(eggBasketTypes, options.hold) ||
        options.hold === entities.jackoLanternOn.type ||
        options.hold === entities.jackoLanternOff.type;
    return !canPick;
}
function positionClover(map) {
    const patch = (0, lodash_1.sample)((0, serverMap_1.findEntities)(map, e => (0, utils_1.includes)(patchTypes, e.type)));
    if (patch && patch.bounds) {
        const bounds = patch.bounds;
        const position = {
            x: patch.x + bounds.x / constants_1.tileWidth + (0, lodash_1.random)(0, bounds.w / constants_1.tileWidth, true),
            y: patch.y + bounds.y / constants_1.tileHeight + (0, lodash_1.random)(0, bounds.h / constants_1.tileHeight, true),
        };
        return position;
    }
    else {
        return (0, collectableController_1.randomPosition)(map);
    }
}
function createBunny(waypoints) {
    const { x, y } = waypoints[0];
    const entity = entities.bunny(x, y);
    const bunnySpeed = 2;
    let waypoint = 0;
    let sleepUntil = 0;
    entity.serverUpdate = (_delta, now) => {
        if (sleepUntil > now)
            return;
        const { x, y } = waypoints[waypoint];
        const reachedX = Math.abs(entity.x - x) < 0.2;
        const reachedY = Math.abs(entity.y - y) < 0.2;
        if (reachedX && reachedY) {
            const rand = Math.random();
            (0, entityUtils_1.updateEntityVelocity)(entity, 0, 0, now);
            if (rand < 0.1) {
                (0, entityUtils_1.setEntityAnimation)(entity, 3 /* BunnyAnimation.Clean */);
                sleepUntil = now + 2;
            }
            else if (rand < 0.2) {
                (0, entityUtils_1.setEntityAnimation)(entity, 4 /* BunnyAnimation.Look */);
                sleepUntil = now + 2;
            }
            else if (rand < 0.3) {
                (0, entityUtils_1.setEntityAnimation)(entity, 2 /* BunnyAnimation.Blink */);
                sleepUntil = now + 2;
            }
            else if (rand < 0.6) {
                (0, entityUtils_1.setEntityAnimation)(entity, 0 /* BunnyAnimation.Sit */);
                sleepUntil = now + 2;
            }
            else {
                waypoint = (waypoint + 1) % waypoints.length;
                (0, entityUtils_1.setEntityAnimation)(entity, 0 /* BunnyAnimation.Sit */);
                sleepUntil = now + (0, lodash_1.random)(0.2, 2, true);
            }
        }
        else {
            const vx = reachedX ? 0 : (x < entity.x ? -bunnySpeed : bunnySpeed);
            const vy = reachedY ? 0 : (y < entity.y ? -bunnySpeed : bunnySpeed);
            if (entity.vx !== vx || entity.vy !== vy) {
                (0, entityUtils_1.updateEntityVelocity)(entity, vx, vy, now);
                (0, entityUtils_1.setEntityAnimation)(entity, 1 /* BunnyAnimation.Walk */, vx === 0 ? undefined : vx > 0);
            }
        }
    };
    if (DEVELOPMENT && false) {
        return [entity, ...waypoints.map(({ x, y }) => entities.routePole(x, y))];
    }
    else {
        return [entity];
    }
}
//# sourceMappingURL=mapUtils.js.map