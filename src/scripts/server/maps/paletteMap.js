"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaletteMap = createPaletteMap;
const tslib_1 = require("tslib");
const entities = tslib_1.__importStar(require("../../common/entities"));
const rect_1 = require("../../common/rect");
const serverMap_1 = require("../serverMap");
const world_1 = require("../world");
const account_1 = require("../api/account");
const controllerUtils_1 = require("../controllerUtils");
const entityUtils_1 = require("../entityUtils");
function createPaletteMap(world) {
    const map = (0, serverMap_1.createServerMap)('palette', 0 /* MapType.None */, 10, 10, 2 /* TileType.Grass */);
    map.spawnArea = (0, rect_1.rect)(map.width / 2, map.height / 2, 0, 0);
    function add(entity) {
        world.addEntity(entity, map);
    }
    add((0, controllerUtils_1.createSign)(map.width / 2, map.height / 2, 'Go back', (_, client) => (0, world_1.goToMap)(world, client, '', 'center')));
    const pad = 5;
    let x = pad;
    let y = pad;
    for (const name of account_1.allEntities) {
        const entityOrEntities = entities[name](x, y);
        const ents = Array.isArray(entityOrEntities) ? entityOrEntities : [entityOrEntities];
        for (const entity of ents) {
            add(entity);
            (0, entityUtils_1.setEntityName)(entity, name);
        }
        x += 3;
        if (x > (map.width - pad)) {
            x = pad;
            y += 3;
        }
    }
    return map;
}
//# sourceMappingURL=paletteMap.js.map