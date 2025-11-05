"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colliders = colliders;
exports.updateColliders = updateColliders;
require("../lib");
const chai_1 = require("chai");
const serverMap_1 = require("../../server/serverMap");
const mocks_1 = require("../mocks");
const collision_1 = require("../../common/collision");
const constants_1 = require("../../common/constants");
const region_1 = require("../../common/region");
const mixins_1 = require("../../common/mixins");
const tileUtils_1 = require("../../client/tileUtils");
function colliders(x, y, w, h, tall = true, exact = false) {
    return [{ x, y, w, h, tall, exact }];
}
function updateColliders(map) {
    for (const region of map.regions) {
        (0, tileUtils_1.updateTileIndices)(region, map);
    }
    for (const region of map.regions) {
        (0, region_1.generateRegionCollider)(region, map);
    }
}
describe('collision', () => {
    describe('updatePosition()', () => {
        let map;
        let ent;
        beforeEach(() => {
            map = (0, serverMap_1.createServerMap)('', 0, 10, 10, 1 /* TileType.Dirt */);
            ent = (0, mocks_1.entity)(1, 0, 0, constants_1.PONY_TYPE);
            ent.colliders = colliders(0, 0, constants_1.tileWidth, constants_1.tileHeight);
        });
        it('does not update position if not moving', () => {
            (0, collision_1.updatePosition)(ent, 1, map);
            (0, chai_1.expect)(ent.x).equal(0);
            (0, chai_1.expect)(ent.y).equal(0);
        });
        it('updates position if moving', () => {
            ent.vx = 2;
            ent.vy = 1;
            (0, collision_1.updatePosition)(ent, 1, map);
            (0, chai_1.expect)(ent.x).equal(2);
            (0, chai_1.expect)(ent.y).equal(1);
        });
        it('updates position if moving and not colliding', () => {
            ent.vx = 2;
            ent.vy = 1;
            ent.flags |= 64 /* EntityFlags.CanCollide */;
            (0, collision_1.updatePosition)(ent, 1, map);
            (0, chai_1.expect)(ent.x).equal(2);
            (0, chai_1.expect)(ent.y).equal(1);
        });
        it('clips move if colliding', () => {
            (0, mocks_1.setupCollider)(map, 9, 1);
            ent.x = 8;
            ent.y = 1;
            ent.vx = 1;
            ent.flags |= 64 /* EntityFlags.CanCollide */;
            ent.colliders = colliders(-12, -9, 24, 18);
            updateColliders(map);
            (0, collision_1.updatePosition)(ent, 1, map);
            (0, chai_1.expect)(ent.x).equal(8.124969482421875);
        });
        it('clips move Y if colliding in Y direction', () => {
            (0, mocks_1.setupCollider)(map, 2, 9);
            (0, mocks_1.setupCollider)(map, 1, 9);
            ent.x = 1;
            ent.y = 8;
            ent.vx = 1;
            ent.vy = 1;
            ent.flags |= 64 /* EntityFlags.CanCollide */;
            ent.colliders = mixins_1.ponyColliders;
            updateColliders(map);
            (0, collision_1.updatePosition)(ent, 1, map);
            (0, chai_1.expect)(ent.x).equal(2, 'x');
            (0, chai_1.expect)(ent.y).equal(8.333292643229166, 'y');
        });
        it('clips move X if colliding in X direction', () => {
            (0, mocks_1.setupCollider)(map, 10, 1);
            ent.x = 9;
            ent.y = 1;
            ent.vx = 1;
            ent.vy = 1;
            ent.flags |= 64 /* EntityFlags.CanCollide */;
            ent.colliders = mixins_1.ponyColliders;
            updateColliders(map);
            (0, collision_1.updatePosition)(ent, 1, map);
            (0, chai_1.expect)(ent.x).equal(9.624969482421875, 'x');
            (0, chai_1.expect)(ent.y).equal(2.0833333333333335, 'y');
        });
        it('updates position if moving and colliding but already in colliding position', () => {
            (0, mocks_1.setupCollider)(map, 8, 8);
            (0, mocks_1.setupCollider)(map, 9, 9);
            (0, mocks_1.setupCollider)(map, 8, 9);
            (0, mocks_1.setupCollider)(map, 9, 8);
            ent.x = 8;
            ent.y = 8;
            ent.vx = 1;
            ent.vy = 1;
            ent.flags |= 64 /* EntityFlags.CanCollide */;
            ent.colliders = colliders(-16, -12, 32, 24);
            updateColliders(map);
            (0, collision_1.updatePosition)(ent, 1, map);
            (0, chai_1.expect)(ent.x).equal(9);
            (0, chai_1.expect)(ent.y).equal(9);
        });
        it('does not update position if moving, colliding, already in colliding position but going outside the map', () => {
            (0, mocks_1.setupCollider)(map, 11, 11);
            ent.x = 110;
            ent.y = 110;
            ent.vx = 1;
            ent.vy = 1;
            ent.flags |= 64 /* EntityFlags.CanCollide */;
            ent.colliders = colliders(-16, -12, 32, 24);
            updateColliders(map);
            (0, collision_1.updatePosition)(ent, 1, map);
            (0, chai_1.expect)(ent.x).equal(110);
            (0, chai_1.expect)(ent.y).equal(110);
        });
    });
});
//# sourceMappingURL=collision.spec.js.map