"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../lib");
const chai_1 = require("chai");
const updateEncoder_1 = require("../../../common/encoders/updateEncoder");
const mocks_1 = require("../../mocks");
const utf8_1 = require("ag-sockets/dist/utf8");
const updateDecoder_1 = require("../../../common/encoders/updateDecoder");
const serverRegion_1 = require("../../../server/serverRegion");
const entityUtils_1 = require("../../../server/entityUtils");
const compress_1 = require("../../../common/compress");
const constants_1 = require("../../../common/constants");
describe('updateEncoder', () => {
    describe('encodeUpdate() + decodeUpdate()', () => {
        const def = { x: 0, y: 0, vx: 0, vy: 0, action: 0, playerState: 0, options: undefined };
        const out = (0, updateDecoder_1.emptyUpdate)(0);
        const exp = { x: 0, y: 0, updates: [], removes: [], tiles: [], tileData: null };
        let region;
        function testEncodeDecode(input, expected) {
            const encoded = (0, updateEncoder_1.encodeUpdateSimple)(input);
            const decoded = (0, updateDecoder_1.decodeUpdate)(encoded);
            (0, chai_1.expect)(decoded).eql(expected);
        }
        beforeEach(() => {
            region = (0, serverRegion_1.createServerRegion)(0, 0);
        });
        it('encodes empty updates', () => {
            testEncodeDecode(region, { ...exp });
        });
        it('encodes region x, y', () => {
            region.x = 1;
            region.y = 2;
            testEncodeDecode(region, { ...exp, x: 1, y: 2 });
        });
        it('encodes empty removes', () => {
            testEncodeDecode(region, { ...exp, removes: [] });
        });
        it('encodes removes', () => {
            region.entityRemoves.push(1, 2, 3);
            testEncodeDecode(region, { ...exp, removes: [1, 2, 3] });
        });
        it('encodes empty tiles', () => {
            testEncodeDecode(region, { ...exp, tiles: [] });
        });
        it('encodes tiles', () => {
            region.tileUpdates.push({ x: 1, y: 2, type: 3 }, { x: 7, y: 56, type: 2 });
            testEncodeDecode(region, { ...exp, tiles: [{ x: 1, y: 2, type: 3 }, { x: 7, y: 56, type: 2 }] });
        });
        it('encodes flags', () => {
            region.entityUpdates.push({ ...def, entity: { ...(0, mocks_1.entity)(123), state: 48 /* EntityState.PonySitting */ }, flags: 4 /* UpdateFlags.State */ });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, state: 48 /* EntityState.PonySitting */ }] });
        });
        it('encodes flags with switch region', () => {
            region.entityUpdates.push({
                ...def, entity: { ...(0, mocks_1.entity)(123), state: 48 /* EntityState.PonySitting */ }, flags: 4 /* UpdateFlags.State */ | 2048 /* UpdateFlags.SwitchRegion */
            });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, state: 48 /* EntityState.PonySitting */, switchRegion: true }] });
        });
        it('encodes expression', () => {
            region.entityUpdates.push({ ...def, entity: { ...(0, mocks_1.entity)(123), options: { expr: 555 } }, flags: 8 /* UpdateFlags.Expression */ });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, expression: 555 }] });
        });
        it('encodes position', () => {
            region.entityUpdates.push({ ...def, entity: (0, mocks_1.entity)(123), flags: 1 /* UpdateFlags.Position */, x: 11, y: 22 });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, x: 11, y: 22, state: 0 }] });
        });
        it('encodes type', () => {
            region.entityUpdates.push({ ...def, entity: (0, mocks_1.entity)(123, 0, 0, 111), flags: 16 /* UpdateFlags.Type */ });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, type: 111 }] });
        });
        it('encodes options', () => {
            region.entityUpdates.push({ ...def, entity: (0, mocks_1.entity)(123), flags: 32 /* UpdateFlags.Options */, options: { tag: 'bar' } });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, options: { tag: 'bar' } }] });
        });
        it('encodes info', () => {
            const e = (0, mocks_1.serverEntity)(123);
            e.encryptedInfoSafe = new Uint8Array([1, 2, 3, 4, 5]);
            region.entityUpdates.push({ ...def, entity: e, flags: 64 /* UpdateFlags.Info */ });
            const decoded = (0, updateDecoder_1.decodeUpdate)((0, updateEncoder_1.encodeUpdateSimple)(region));
            (0, chai_1.expect)(Array.from(decoded.updates[0].info)).eql([1, 2, 3, 4, 5]);
        });
        it('encodes action', () => {
            region.entityUpdates.push({ ...def, entity: (0, mocks_1.entity)(123), action: 5, flags: 128 /* UpdateFlags.Action */ });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, action: 5 }] });
        });
        it('encodes name', () => {
            const e = (0, mocks_1.serverEntity)(123);
            e.encodedName = (0, utf8_1.encodeString)('foobar');
            region.entityUpdates.push({ ...def, entity: e, flags: 256 /* UpdateFlags.Name */ });
            const decoded = (0, updateDecoder_1.decodeUpdate)((0, updateEncoder_1.encodeUpdateSimple)(region));
            (0, chai_1.expect)(decoded.updates[0].name).eql('foobar');
        });
        it('encodes bad name', () => {
            const e = (0, mocks_1.serverEntity)(123);
            e.encodedName = (0, utf8_1.encodeString)('foobar');
            e.nameBad = true;
            region.entityUpdates.push({ ...def, entity: e, flags: 256 /* UpdateFlags.Name */ });
            const decoded = (0, updateDecoder_1.decodeUpdate)((0, updateEncoder_1.encodeUpdateSimple)(region));
            (0, chai_1.expect)(decoded.updates[0].name).eql('foobar');
            (0, chai_1.expect)(decoded.updates[0].filterName).true;
        });
        it('encodes position and velocity', () => {
            region.entityUpdates.push({ ...def, entity: (0, mocks_1.entity)(123), flags: 1 /* UpdateFlags.Position */, x: 11, y: 22, vx: 1, vy: 1 });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, x: 11, y: 22, vx: 1, vy: 1, state: 0 }] });
        });
        it('encodes position and velocity (2)', () => {
            region.entityUpdates.push({
                ...def, entity: (0, mocks_1.entity)(123), flags: 1 /* UpdateFlags.Position */, x: 11.125, y: 22.5, vx: 0.125, vy: 2.5
            });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, x: 11.125, y: 22.5, vx: 0.125, vy: 2.5, state: 0 }] });
        });
        it('encodes position and velocity (3)', () => {
            region.entityUpdates.push({
                ...def, entity: (0, mocks_1.entity)(123), flags: 1 /* UpdateFlags.Position */, x: -11.125, y: -22.5, vx: -0.125, vy: -2.5
            });
            testEncodeDecode(region, { ...exp, updates: [{ ...out, id: 123, x: -11.125, y: -22.5, vx: -0.125, vy: -2.5, state: 0 }] });
        });
        it('throws on invalid velocity', () => {
            region.entityUpdates.push({ ...def, entity: (0, mocks_1.entity)(123), flags: 1 /* UpdateFlags.Position */, x: 0, y: 0, vx: 100, vy: 0 });
            (0, chai_1.expect)(() => testEncodeDecode(region, { ...exp, updates: [] }))
                .throw('Exceeded max velocity (100)');
        });
        it('encodes update with all fields', () => {
            region.entityUpdates.push({
                ...def, entity: { ...(0, mocks_1.entity)(123, 0, 0, 111), state: 48 /* EntityState.PonySitting */ },
                flags: 1 /* UpdateFlags.Position */ | 16 /* UpdateFlags.Type */ | 32 /* UpdateFlags.Options */ | 128 /* UpdateFlags.Action */,
                x: 11, y: 22, vx: 1, vy: 1, action: 5, options: { tag: 'bar' },
            });
            testEncodeDecode(region, {
                ...exp,
                updates: [{
                        ...out, id: 123, type: 111, x: 11, y: 22, vx: 1, vy: 1, state: 48 /* EntityState.PonySitting */,
                        action: 5, playerState: undefined, options: { tag: 'bar' }
                    }]
            });
        });
        it('encodes multiple updates', () => {
            region.entityUpdates.push({ ...def, entity: (0, mocks_1.entity)(123), flags: 1 /* UpdateFlags.Position */, x: 11, y: 22 }, { ...def, entity: { ...(0, mocks_1.entity)(321), state: 48 /* EntityState.PonySitting */ }, flags: 4 /* UpdateFlags.State */ });
            testEncodeDecode(region, {
                ...exp,
                updates: [
                    { ...out, id: 123, x: 11, y: 22, state: 0 },
                    { ...out, id: 321, state: 48 /* EntityState.PonySitting */ },
                ]
            });
        });
    });
    describe('writeRegion() + decodeUpdate()', () => {
        const tiles = new Uint8Array(constants_1.REGION_SIZE * constants_1.REGION_SIZE);
        tiles.fill(1 /* TileType.Dirt */);
        const emptyTileData = (0, compress_1.compressTiles)(tiles);
        function testEncodeDecode(region, client, expected) {
            const encoded = (0, updateEncoder_1.encodeRegionSimple)(region, client);
            const decoded = (0, updateDecoder_1.decodeUpdate)(encoded);
            (0, chai_1.expect)(decoded).eql(expected);
        }
        it('empty region', () => {
            const region = (0, serverRegion_1.createServerRegion)(1, 2);
            const client = (0, mocks_1.mockClient)();
            testEncodeDecode(region, client, { x: 1, y: 2, removes: [], tiles: [], tileData: emptyTileData, updates: [] });
        });
        it('encodes single entity', () => {
            const region = (0, serverRegion_1.createServerRegion)(1, 2);
            const entity = (0, mocks_1.serverEntity)(123, 10, 20, 32);
            const client = (0, mocks_1.mockClient)();
            region.entities.push(entity);
            testEncodeDecode(region, client, {
                x: 1, y: 2, removes: [], tiles: [], tileData: emptyTileData, updates: [
                    {
                        id: 123, x: 10, y: 20, vx: 0, vy: 0, type: 32,
                        name: undefined, switchRegion: false, crc: undefined, info: undefined,
                        state: 0, expression: undefined, action: undefined, options: undefined,
                        playerState: undefined, filterName: false,
                    },
                ]
            });
        });
        it('encodes single entity with more fields', () => {
            const region = (0, serverRegion_1.createServerRegion)(1, 2);
            const entity = (0, mocks_1.serverEntity)(123, 10, 20, 32);
            const client = (0, mocks_1.mockClient)();
            region.entities.push(entity);
            (0, entityUtils_1.setEntityName)(entity, 'foo');
            const info = new Uint8Array([1, 2, 3]);
            entity.client = (0, mocks_1.mockClient)();
            entity.state = 123;
            entity.options = { toy: 5, expr: 123 };
            entity.encryptedInfoSafe = info;
            entity.vx = 1;
            entity.vy = 2;
            client.hides.add(entity.client.accountId);
            testEncodeDecode(region, client, {
                x: 1, y: 2, removes: [], tiles: [], tileData: emptyTileData, updates: [
                    {
                        id: 123, x: 10, y: 20, vx: 1, vy: 2, type: 32,
                        name: 'foo', switchRegion: false, crc: 0, info,
                        state: 123, expression: undefined, action: undefined, options: { toy: 5, expr: 123 },
                        playerState: 2, filterName: false,
                    },
                ],
            });
        });
        it('skips shadowed entities', () => {
            const region = (0, serverRegion_1.createServerRegion)(1, 2);
            const entity = (0, mocks_1.serverEntity)(123, 10, 20, 32);
            const client = (0, mocks_1.mockClient)();
            region.entities.push(entity);
            entity.client = (0, mocks_1.mockClient)();
            entity.client.shadowed = true;
            testEncodeDecode(region, client, { x: 1, y: 2, removes: [], tiles: [], updates: [], tileData: emptyTileData });
        });
    });
});
//# sourceMappingURL=updateEncoder.spec.js.map