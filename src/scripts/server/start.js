"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const ctrl = tslib_1.__importStar(require("./controllers"));
const world_1 = require("./world");
const reporter_1 = require("./reporter");
const logger_1 = require("./logger");
const constants_1 = require("../common/constants");
const timing_1 = require("./timing");
const tileUtils_1 = require("../client/tileUtils");
const sprites_1 = require("../generated/sprites");
const paths_1 = require("./paths");
const mainMap_1 = require("./maps/mainMap");
const islandMap_1 = require("./maps/islandMap");
const houseMap_1 = require("./maps/houseMap");
const paletteMap_1 = require("./maps/paletteMap");
const caveMap_1 = require("./maps/caveMap");
const customMap_1 = require("./maps/customMap");
const controllerUtils_1 = require("./controllerUtils");
const entities_1 = require("../common/entities");
function start(world, server) {
    const data = (0, fs_1.readFileSync)((0, paths_1.pathTo)('src', 'ts', 'generated', 'pony.bin'));
    sprites_1.normalSpriteSheet.data = {
        width: 512,
        height: 512,
        data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength),
    };
    (0, tileUtils_1.initializeTileHeightmaps)();
    world.maps.push((0, mainMap_1.createMainMap)(world));
    world.maps.push((0, caveMap_1.createCaveMap)(world));
    // custom map
    if (DEVELOPMENT) { // remove `if` when you're ready to publish your map
        // place sign that will teleport the player to your custom map
        world.addEntity((0, controllerUtils_1.createSign)(75, 69, 'Go to custom map', (_, client) => (0, world_1.goToMap)(world, client, 'custom'), entities_1.signQuestion), world.getMainMap());
        // add map to the world, go to `/src/ts/server/maps/customMap.ts` to customize your map
        world.maps.push((0, customMap_1.createCustomMap)(world));
    }
    if (world.featureFlags.test) {
        const island = (0, islandMap_1.createIslandMap)(world, false);
        island.id = 'public-island';
        world.maps.push(island);
        const house = (0, houseMap_1.createHouseMap)(world, false);
        house.id = 'public-house';
        world.maps.push(house);
    }
    if (BETA) {
        world.maps.push((0, paletteMap_1.createPaletteMap)(world));
    }
    if (DEVELOPMENT) {
        world.controllers.push(new ctrl.TestController(world, world.getMainMap()));
        // world.controllers.push(new ctrl.PerfController(world, {
        // 	count: 2000, moving: 1000, unique: true, spread: false, saying: false, x: 20, y: 20
        // }));
        // world.controllers.push(new ctrl.FakeClientsController(world, server, {
        // 	count: 1000,
        // }));
        world.setTime(12);
    }
    let last = Date.now();
    let frames = 0;
    world.initialize(last);
    if (!DEVELOPMENT) {
        (0, reporter_1.create)(server).info(`Server started`);
    }
    setInterval(() => {
        (0, timing_1.timingReset)();
        (0, timing_1.timingStart)('frame');
        try {
            const now = Date.now();
            world.update(now - last, now);
            last = now;
            frames++;
            if (frames >= constants_1.SERVER_FPS) {
                frames = 0;
                world.sparseUpdate(now);
            }
        }
        catch (e) {
            (0, reporter_1.create)(server).danger(e.message);
            logger_1.logger.error(e);
        }
        (0, timing_1.timingEnd)();
    }, 1000 / constants_1.SERVER_FPS);
    return world;
}
//# sourceMappingURL=start.js.map