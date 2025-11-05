"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlyingCritterController = void 0;
exports.findClosestTree = findClosestTree;
exports.findTrees = findTrees;
exports.updateTreehidingEntities = updateTreehidingEntities;
const lodash_1 = require("lodash");
const serverMap_1 = require("../serverMap");
const timing_1 = require("../timing");
const utils_1 = require("../../common/utils");
const entityUtils_1 = require("../entityUtils");
const collectableController_1 = require("./collectableController");
class FlyingCritterController {
    constructor(world, map, critter, speed, limit, isActive, spawnOnStart = false) {
        this.world = world;
        this.map = map;
        this.critter = critter;
        this.speed = speed;
        this.limit = limit;
        this.isActive = isActive;
        this.spawnOnStart = spawnOnStart;
        this.entities = [];
    }
    initialize() {
        if (this.spawnOnStart) {
            for (let i = 0; i < this.limit; i++) {
                const { x, y } = (0, collectableController_1.randomPosition)(this.map);
                this.entities.push(this.world.addEntity(this.critter(x, y), this.map));
            }
        }
    }
    update(_, now) {
        (0, timing_1.timingStart)('FlyingCritterController.update()');
        updateTreehidingEntities(this.entities, this.world, this.map, this.limit, this.speed, now, this.critter, this.isActive);
        (0, timing_1.timingEnd)();
    }
}
exports.FlyingCritterController = FlyingCritterController;
function isTreeCrown(entity) {
    return (0, utils_1.hasFlag)(entity.serverFlags || 0, 1 /* ServerFlags.TreeCrown */);
}
function findClosestTree(map, x, y) {
    return (0, serverMap_1.findClosestEntity)(map, x, y, isTreeCrown);
}
function findTrees(map) {
    return (0, serverMap_1.findEntities)(map, isTreeCrown);
}
function updateTreehidingEntities(entities, world, map, limit, speed, timestamp, create, isActive) {
    const offsetY = -2;
    if (isActive()) {
        // release new critter
        if (entities.length < limit && Math.random() < 0.1) {
            const trees = findTrees(map);
            const tree = (0, lodash_1.sample)(trees);
            if (tree) {
                const entity = create(tree.x, tree.y + offsetY);
                entities.push(world.addEntity(entity, map));
                (0, entityUtils_1.moveRandomly)(map, entity, speed, 1, timestamp);
            }
        }
        for (const entity of entities) {
            (0, entityUtils_1.moveRandomly)(map, entity, speed, 0.02, timestamp);
        }
    }
    else if (entities.length) {
        // head to tree and disappear
        const trees = findTrees(map);
        for (let i = entities.length - 1; i >= 0; i--) {
            const e = entities[i];
            e.targetTree = e.targetTree || (0, entityUtils_1.findClosest)(e.x, e.y, trees);
            if ((0, utils_1.distanceXY)(e.x, e.y, e.targetTree.x, e.targetTree.y + offsetY) < 0.1) {
                entities.splice(i, 1);
                world.removeEntity(e, map);
            }
            else {
                (0, entityUtils_1.moveTowards)(e, e.targetTree.x, e.targetTree.y + offsetY, speed, timestamp);
            }
        }
    }
}
//# sourceMappingURL=flyingCritterController.js.map