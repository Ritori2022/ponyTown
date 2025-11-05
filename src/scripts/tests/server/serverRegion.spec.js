"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const serverRegion_1 = require("../../server/serverRegion");
const mocks_1 = require("../mocks");
const region_1 = require("../../common/region");
describe('serverRegion', () => {
    let region;
    beforeEach(() => {
        region = (0, serverRegion_1.createServerRegion)(1, 2);
    });
    it('has correct bounds', () => {
        (0, chai_1.expect)(region.bounds).eql({ x: 8, y: 16, w: 8, h: 8 });
    });
    it('has correct boundsWithBorder', () => {
        (0, chai_1.expect)(region.boundsWithBorder).eql({ x: 7, y: 15, w: 10, h: 10 });
    });
    it('sets and gets tile at given position', () => {
        (0, serverRegion_1.setRegionTile)({}, region, 1, 2, 2 /* TileType.Grass */);
        (0, chai_1.expect)((0, region_1.getRegionTile)(region, 1, 2)).equal(2 /* TileType.Grass */);
    });
    describe('addUpdate()', () => {
        it('adds entity update to update list', () => {
            const entity = (0, mocks_1.serverEntity)(1, 5, 4);
            (0, serverRegion_1.pushUpdateEntityToRegion)(region, { entity, flags: 1 /* UpdateFlags.Position */, x: 5, y: 4, vx: 0, vy: 0 });
            (0, chai_1.expect)(region.entityUpdates).eql([
                {
                    entity,
                    flags: 1 /* UpdateFlags.Position */,
                    x: 5,
                    y: 4,
                    vx: 0,
                    vy: 0,
                    action: 0,
                    playerState: 0,
                    options: undefined,
                },
            ]);
        });
        it('updates existing entity update', () => {
            const entity = (0, mocks_1.serverEntity)(1, 5, 4);
            (0, serverRegion_1.pushUpdateEntityToRegion)(region, { entity, flags: 0 /* UpdateFlags.None */ });
            (0, serverRegion_1.pushUpdateEntityToRegion)(region, { entity, flags: 1 /* UpdateFlags.Position */ | 8 /* UpdateFlags.Expression */, x: 10, y: 11, vx: 5, vy: 3 });
            (0, chai_1.expect)(region.entityUpdates).eql([
                {
                    entity,
                    flags: 1 /* UpdateFlags.Position */ | 8 /* UpdateFlags.Expression */,
                    x: 10,
                    y: 11,
                    vx: 5,
                    vy: 3,
                    action: 0,
                    playerState: 0,
                    options: undefined,
                },
            ]);
        });
        it('does not update position of existing entry if position flag is false', () => {
            const entity = (0, mocks_1.serverEntity)(1, 5, 4);
            (0, serverRegion_1.pushUpdateEntityToRegion)(region, { entity, flags: 1 /* UpdateFlags.Position */, x: 5, y: 4, vx: 0, vy: 0 });
            entity.x = 10;
            entity.y = 11;
            entity.vx = 5;
            entity.vy = 3;
            (0, serverRegion_1.pushUpdateEntityToRegion)(region, { entity, flags: 8 /* UpdateFlags.Expression */ });
            (0, chai_1.expect)(region.entityUpdates).eql([
                {
                    entity,
                    flags: 1 /* UpdateFlags.Position */ | 8 /* UpdateFlags.Expression */,
                    x: 5,
                    y: 4,
                    vx: 0,
                    vy: 0,
                    action: 0,
                    playerState: 0,
                    options: undefined,
                },
            ]);
        });
    });
    describe('addRemove()', () => {
        it('adds entity remove to remove list', () => {
            (0, serverRegion_1.pushRemoveEntityToRegion)(region, (0, mocks_1.serverEntity)(123));
            (0, chai_1.expect)(region.entityRemoves).eql([123]);
        });
    });
    describe('resetRegionUpdates()', () => {
        it('resets all update lists to empty lists', () => {
            region.entityUpdates = [{}, {}];
            region.entityRemoves = [{}, {}];
            region.tileUpdates = [{}, {}];
            (0, serverRegion_1.resetRegionUpdates)(region);
            (0, chai_1.expect)(region.entityUpdates).eql([]);
            (0, chai_1.expect)(region.entityRemoves).eql([]);
            (0, chai_1.expect)(region.tileUpdates).eql([]);
        });
    });
});
//# sourceMappingURL=serverRegion.spec.js.map