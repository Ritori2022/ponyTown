"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudController = void 0;
const tslib_1 = require("tslib");
const constants_1 = require("../../common/constants");
const utils_1 = require("../../common/utils");
const entities_1 = require("../../common/entities");
const sprites = tslib_1.__importStar(require("../../generated/sprites"));
const entityUtils_1 = require("../entityUtils");
const timing_1 = require("../timing");
const spriteWidth = sprites.cloud.shadow.w / constants_1.tileWidth;
const cloudVX = -0.5;
class CloudController {
    constructor(world, map, cloudCount) {
        this.world = world;
        this.map = map;
        this.cloudCount = cloudCount;
        this.clouds = [];
        this.initialized = false;
    }
    initialize() {
        if (this.initialized)
            return;
        for (let i = 0; i < this.cloudCount; i++) {
            this.addCloud(false, this.world.now / 1000);
        }
        this.initialized = true;
    }
    update(_, now) {
        (0, timing_1.timingStart)('CloudController.update()');
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            const cloud = this.clouds[i];
            if (cloud.x < -spriteWidth) {
                this.clouds.splice(i, 1);
                this.world.removeEntity(cloud, this.map);
            }
        }
        if (this.clouds.length < this.cloudCount) {
            this.addCloud(true, now);
        }
        (0, timing_1.timingEnd)();
    }
    addCloud(end, timestamp) {
        const x = end ? this.map.width + spriteWidth : this.map.width * Math.random();
        const y = this.map.height * Math.random();
        const entity = (0, entities_1.cloud)(x, y);
        if (!this.clouds.some(c => (0, utils_1.entitiesIntersect)(c, entity))) {
            this.clouds.push(this.world.addEntity(entity, this.map));
            (0, entityUtils_1.updateEntityVelocity)(entity, cloudVX, 0, timestamp);
        }
    }
}
exports.CloudController = CloudController;
//# sourceMappingURL=cloudController.js.map