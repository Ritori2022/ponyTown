"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.give = give;
exports.createBoxOfLanterns = createBoxOfLanterns;
exports.createSign = createSign;
exports.createSignWithText = createSignWithText;
exports.boopLight = boopLight;
exports.createAddLight = createAddLight;
exports.turnOff = turnOff;
exports.turnOn = turnOn;
exports.updateLights = updateLights;
exports.createFenceMaker = createFenceMaker;
exports.createWoodenFenceMaker = createWoodenFenceMaker;
exports.createStoneWallFenceMaker = createStoneWallFenceMaker;
const tslib_1 = require("tslib");
const lodash_1 = require("lodash");
const playerUtils_1 = require("./playerUtils");
const chat_1 = require("./chat");
const interfaces_1 = require("../common/interfaces");
const entities = tslib_1.__importStar(require("../common/entities"));
const entityUtils_1 = require("./entityUtils");
const utils_1 = require("../common/utils");
function give(type, message) {
    return (e, client) => {
        if (client.pony.options && client.pony.options.hold === type) {
            (0, playerUtils_1.unholdItem)(client.pony);
        }
        else {
            if (message) {
                (0, chat_1.sayTo)(client, e, message, 7 /* MessageType.Announcement */);
            }
            (0, playerUtils_1.holdItem)(client.pony, type);
        }
    };
}
function createBoxOfLanterns(x, y) {
    const boxOfLanterns = entities.boxLanterns(x, y);
    boxOfLanterns.interact = give(entities.lanternOn.type);
    (0, entityUtils_1.setEntityName)(boxOfLanterns, 'Box of lanterns');
    return boxOfLanterns;
}
function createSign(x, y, name, interact, create = entities.sign) {
    const entity = create(x, y);
    (0, entityUtils_1.setEntityName)(entity, name);
    entity.interact = interact;
    return entity;
}
function createSignWithText(x, y, name, text, create = entities.sign) {
    return createSign(x, y, name, (entity, client) => (0, chat_1.sayTo)(client, entity, text, 1 /* MessageType.System */), create);
}
function boopLight() {
    setTimeout(() => {
        if ((0, utils_1.hasFlag)(this.state, 4 /* EntityState.On */)) {
            turnOff(this);
            this.lightDelay = Date.now() + 3000;
        }
    }, 300);
}
function createAddLight(world, map, createEntity) {
    return (x, y) => {
        const entity = world.addEntity(createEntity(x, y), map);
        entity.boop = boopLight;
        return entity;
    };
}
function turnOff(entity) {
    (0, entityUtils_1.updateEntityState)(entity, 0 /* EntityState.None */);
}
function turnOn(entity) {
    (0, entityUtils_1.updateEntityState)(entity, (0, interfaces_1.setAnimationToEntityState)(4 /* EntityState.On */, 1));
}
function updateLights(entities, on) {
    for (const entity of entities) {
        if ((0, utils_1.hasFlag)(entity.state, 4 /* EntityState.On */) !== on && Math.random() < 0.2) {
            if (entity.lightDelay === undefined || entity.lightDelay < Date.now()) {
                if (on) {
                    turnOn(entity);
                }
                else {
                    turnOff(entity);
                }
            }
        }
    }
}
function createFenceMaker(world, map, size, poles, beamsH, beamsV) {
    const add = (entity) => world.addEntity(entity, map);
    return (x, y, length, horizontal = true, skipStart = false, skipEnd = false) => {
        const dx = horizontal ? size : 0;
        const dy = horizontal ? 0 : size;
        for (let i = 0; i < length; i++) {
            if (i || !skipStart) {
                add((0, lodash_1.sample)(poles)(x + dx * i, y + dy * i));
            }
            if (horizontal) {
                add((0, lodash_1.sample)(beamsH)(x + dx * i + (size / 2), y));
            }
            else {
                add((0, lodash_1.sample)(beamsV)(x, y + dy * i));
            }
        }
        if (!skipEnd) {
            add((0, lodash_1.sample)(poles)(x + dx * length, y + dy * length));
        }
    };
}
function createWoodenFenceMaker(world, map) {
    return createFenceMaker(world, map, 1, [
        ...(0, utils_1.repeat)(2, entities.woodenFencePole1),
        ...(0, utils_1.repeat)(2, entities.woodenFencePole2),
        ...(0, utils_1.repeat)(2, entities.woodenFencePole3),
        ...(0, utils_1.repeat)(2, entities.woodenFencePole4),
        entities.woodenFencePole5,
    ], [
        ...(0, utils_1.repeat)(5, entities.woodenFenceBeamH1),
        ...(0, utils_1.repeat)(5, entities.woodenFenceBeamH2),
        ...(0, utils_1.repeat)(5, entities.woodenFenceBeamH3),
        entities.woodenFenceBeamH4,
        entities.woodenFenceBeamH5,
        entities.woodenFenceBeamH6,
    ], [
        entities.woodenFenceBeamV1,
        entities.woodenFenceBeamV2,
        entities.woodenFenceBeamV3,
    ]);
}
function createStoneWallFenceMaker(world, map) {
    return createFenceMaker(world, map, 2, [
        entities.stoneWallPole1,
    ], [
        entities.stoneWallBeamH1,
    ], [
        entities.stoneWallBeamV1,
    ]);
}
//# sourceMappingURL=controllerUtils.js.map