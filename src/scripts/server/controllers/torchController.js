"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TorchController = void 0;
const timeUtils_1 = require("../../common/timeUtils");
const timing_1 = require("../timing");
const controllerUtils_1 = require("../controllerUtils");
const utils_1 = require("../../common/utils");
class TorchController {
    constructor(world, map) {
        this.world = world;
        this.map = map;
        this.lights = [];
    }
    initialize() {
        this.lights = [];
        for (const region of this.map.regions) {
            for (const entity of region.entities) {
                if ((0, utils_1.hasFlag)(entity.flags, 1024 /* EntityFlags.OnOff */)) {
                    this.lights.push(entity);
                }
            }
        }
    }
    update() {
        (0, timing_1.timingStart)('TorchController.update()');
        (0, timing_1.timingEnd)();
    }
    sparseUpdate() {
        (0, timing_1.timingStart)('TorchController.sparseUpdate()');
        (0, controllerUtils_1.updateLights)(this.lights, (0, timeUtils_1.isNight)(this.world.time));
        (0, timing_1.timingEnd)();
    }
}
exports.TorchController = TorchController;
//# sourceMappingURL=torchController.js.map