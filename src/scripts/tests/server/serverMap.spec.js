"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const serverMap_1 = require("../../server/serverMap");
const worldMap_1 = require("../../common/worldMap");
describe('serverMap', () => {
    let map;
    beforeEach(() => {
        map = (0, serverMap_1.createServerMap)('', 0, 10, 10);
    });
    it('throws when provided zero size for any of the parameters', () => {
        (0, chai_1.expect)(() => (0, serverMap_1.createServerMap)('', 0, 0, 1)).throw('Invalid map parameters');
        (0, chai_1.expect)(() => (0, serverMap_1.createServerMap)('', 0, 1, 0)).throw('Invalid map parameters');
    });
    it('gets total width of map', () => {
        (0, chai_1.expect)(map.width).equal(80);
    });
    it('gets total height of map', () => {
        (0, chai_1.expect)(map.height).equal(80);
    });
    describe('getRegion()', () => {
        it('returns region', () => {
            (0, chai_1.expect)((0, worldMap_1.getRegion)(map, 0, 0)).equal(map.regions[0]);
        });
        it('throws if out of range', () => {
            (0, chai_1.expect)(() => (0, worldMap_1.getRegion)(map, -1, 0)).throw('Invalid region coords (-1, 0)');
            (0, chai_1.expect)(() => (0, worldMap_1.getRegion)(map, 0, -1)).throw('Invalid region coords (0, -1)');
            (0, chai_1.expect)(() => (0, worldMap_1.getRegion)(map, 99, 0)).throw('Invalid region coords (99, 0)');
            (0, chai_1.expect)(() => (0, worldMap_1.getRegion)(map, 0, 99)).throw('Invalid region coords (0, 99)');
        });
    });
    describe('getRegionGlobal()', () => {
        it('returns region at given position', () => {
            (0, chai_1.expect)((0, worldMap_1.getRegionGlobal)(map, 0.5, 8.5)).equal((0, worldMap_1.getRegion)(map, 0, 1));
        });
        it('clamps position outside of the map (1)', () => {
            (0, chai_1.expect)((0, worldMap_1.getRegionGlobal)(map, -0.5, -10)).equal((0, worldMap_1.getRegion)(map, 0, 0));
        });
        it('clamps position outside of the map (2)', () => {
            (0, chai_1.expect)((0, worldMap_1.getRegionGlobal)(map, 1000, 2000)).equal((0, worldMap_1.getRegion)(map, 9, 9));
        });
    });
});
//# sourceMappingURL=serverMap.spec.js.map