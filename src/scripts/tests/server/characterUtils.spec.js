"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../lib");
const chai_1 = require("chai");
const utf8_1 = require("ag-sockets/dist/utf8");
const characterUtils_1 = require("../../server/characterUtils");
const mocks_1 = require("../mocks");
const constants_1 = require("../../common/constants");
const entities = tslib_1.__importStar(require("../../common/entities"));
const rect_1 = require("../../common/rect");
const serverMap_1 = require("../../server/serverMap");
const counter_1 = require("../../server/services/counter");
const playerUtils_1 = require("../../server/playerUtils");
const utils_1 = require("../../common/utils");
describe('characterUtils', () => {
    describe('createPony()', () => {
        const defaultState = { x: 0, y: 0, flags: 0 };
        it('creates pony entity', () => {
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: '' }), (0, mocks_1.character)({ name: 'foo' }), defaultState);
            (0, chai_1.expect)(pony).not.undefined;
            (0, chai_1.expect)(pony.type).equal(entities.pony.type);
        });
        it('sets initial position for character from state', () => {
            const main = { ...defaultState, x: 1, y: 2 };
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: '' }), (0, mocks_1.character)({ name: 'foo' }), main);
            (0, chai_1.expect)(pony.x).eql(1, 'x');
            (0, chai_1.expect)(pony.y).eql(2, 'y');
        });
        it('sets facing from state', () => {
            const main = { ...defaultState, flags: 1 /* CharacterStateFlags.Right */ };
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: '' }), (0, mocks_1.character)({ name: 'foo' }), main);
            (0, chai_1.expect)(pony.state).equal(2 /* EntityState.FacingRight */);
        });
        it('sets extra flag from state', () => {
            const main = { ...defaultState, flags: 2 /* CharacterStateFlags.Extra */ };
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: '' }), (0, mocks_1.character)({ name: 'foo' }), main);
            (0, chai_1.expect)(pony.options.extra).true;
        });
        it('sets held item from state', () => {
            const main = { ...defaultState, hold: 'apple' };
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: '' }), (0, mocks_1.character)({ name: 'foo' }), main);
            (0, chai_1.expect)(pony.options.hold).equal(entities.apple.type);
        });
        it('ignores held item from state if type is invalid', () => {
            const main = { ...defaultState, hold: 'does_not_exist' };
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: '' }), (0, mocks_1.character)({ name: 'foo' }), main);
            (0, chai_1.expect)(pony.options.hold).undefined;
        });
        it('sets canCollide flag', () => {
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'foo', info: constants_1.OFFLINE_PONY }), {});
            (0, chai_1.expect)((0, utils_1.hasFlag)(pony.flags, 64 /* EntityFlags.CanCollide */)).true;
        });
        it('sets canFly flag to false for ponies without wings', () => {
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'foo', info: constants_1.OFFLINE_PONY }), {});
            (0, chai_1.expect)(pony.canFly).false;
        });
        it('sets canFly flag to true for ponies with wings', () => {
            const info = 'CAb///9xcXHaICDHx8eqqqq9vb02QAJkJEIFcADAAwgEnAcgQNiMS4A=';
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'foo', info }), {});
            (0, chai_1.expect)(pony.canFly).true;
        });
        it('sets character name', () => {
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'foo', info: constants_1.OFFLINE_PONY }), {});
            (0, chai_1.expect)(pony.name).equal('foo');
        });
        it('sets extra options name', () => {
            const pony = (0, characterUtils_1.createPony)((0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'foo', info: constants_1.OFFLINE_PONY }), {});
            (0, chai_1.expect)(pony.extraOptions).eql((0, characterUtils_1.createExtraOptions)((0, mocks_1.character)({ name: 'foo' })));
        });
    });
    describe('updatePony()', () => {
        it('sets name', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'Foo' }));
            (0, chai_1.expect)(entity.name).equal('Foo');
        });
        it('sets options', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)(), roles: ['mod'] }), (0, mocks_1.character)({ name: 'Foo', tag: 'mod' }));
            (0, chai_1.expect)(entity.options).eql({ tag: 'mod' });
        });
        it('sets extra options', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), { name: 'Foo', auth: { provider: 'github', name: 'FooAcc', url: 'foo.com' } });
            (0, chai_1.expect)(entity.extraOptions).eql({
                ex: true,
                site: {
                    provider: 'github',
                    name: 'FooAcc',
                    url: 'foo.com',
                }
            });
        });
        it('sets canFly flag', () => {
            const entity1 = (0, mocks_1.serverEntity)(1);
            const entity2 = (0, mocks_1.serverEntity)(2);
            (0, characterUtils_1.updatePony)(entity1, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'Foo', info: constants_1.OFFLINE_PONY }));
            (0, characterUtils_1.updatePony)(entity2, (0, mocks_1.account)({ _id: '' }), (0, mocks_1.character)({ name: 'Bar', info: 'DAT/AADapSD/1wC7Li42QAJkJEAT8ADAAxADhAYQFGAQAA==' }));
            (0, chai_1.expect)(entity1.canFly).false;
            (0, chai_1.expect)(entity2.canFly).true;
        });
        it('sets info and encrypted info', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'Foo', info: constants_1.OFFLINE_PONY }));
            (0, chai_1.expect)(entity.info).equal(constants_1.OFFLINE_PONY);
            (0, chai_1.expect)(entity.encryptedInfoSafe).eql((0, characterUtils_1.encryptInfo)(constants_1.OFFLINE_PONY));
        });
        it('sets encoded name fields', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'Fuck Foo' }));
            (0, chai_1.expect)(entity.encodedName).eql((0, utf8_1.encodeString)('Fuck Foo'));
        });
        it('sets info safe fields', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'Foo', info: constants_1.OFFLINE_PONY }));
            (0, chai_1.expect)(entity.infoSafe).eql(constants_1.OFFLINE_PONY);
            (0, chai_1.expect)(entity.encryptedInfoSafe).eql((0, characterUtils_1.encryptInfo)(constants_1.OFFLINE_PONY));
        });
        it('sets info safe fields to info with removed CM if bad CM flag is true', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            const offlinePonyWithoutCM = 'DAKVlZUvLy82QIxomgCfgAYAGIAoQGEBAA==';
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'Foo', info: constants_1.OFFLINE_PONY, flags: 1 /* CharacterFlags.BadCM */ }));
            (0, chai_1.expect)(entity.infoSafe).eql(offlinePonyWithoutCM);
            (0, chai_1.expect)(entity.encryptedInfoSafe).eql((0, characterUtils_1.encryptInfo)(offlinePonyWithoutCM));
        });
        it('sets options', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'foo' }));
            (0, chai_1.expect)(entity.name).equal('foo');
        });
        it('fills in missing info', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'foo' }));
            (0, chai_1.expect)(entity.name).equal('foo');
        });
        it('includes tag', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)(), roles: ['mod'] }), (0, mocks_1.character)({ name: 'foo', tag: 'mod' }));
            (0, chai_1.expect)(entity.options.tag).equal('mod');
        });
        it('prioritazes set tag', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)(), supporter: 1 /* SupporterFlags.Supporter1 */, roles: ['mod'] }), (0, mocks_1.character)({ name: 'foo', tag: 'mod' }));
            (0, chai_1.expect)(entity.options.tag).equal('mod');
        });
        it('creates supporter tag', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)(), supporter: 1 /* SupporterFlags.Supporter1 */ }), (0, mocks_1.character)({ name: 'foo' }));
            (0, chai_1.expect)(entity.options.tag).equal('sup1');
        });
        it('does not create support tag if hide support flag is true', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)(), supporter: 1 /* SupporterFlags.Supporter1 */ }), (0, mocks_1.character)({ name: 'foo', flags: 4 /* CharacterFlags.HideSupport */ }));
            (0, chai_1.expect)(entity.options.tag).undefined;
        });
        it('does not include tag if role is missing', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, characterUtils_1.updatePony)(entity, (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() }), (0, mocks_1.character)({ name: 'foo', tag: 'mod' }));
            (0, chai_1.expect)(entity.options.tag).undefined;
        });
    });
    describe('createExtraOptions()', () => {
        it('sets ex flag', () => {
            (0, chai_1.expect)((0, characterUtils_1.createExtraOptions)((0, mocks_1.character)({}))).eql({
                ex: true,
            });
        });
        it('sets site object from auth', () => {
            (0, chai_1.expect)((0, characterUtils_1.createExtraOptions)((0, mocks_1.character)({
                auth: {
                    provider: 'github',
                    name: 'foo',
                    url: 'foo.com',
                },
            }))).eql({
                ex: true,
                site: {
                    provider: 'github',
                    name: 'foo',
                    url: 'foo.com',
                }
            });
        });
    });
    describe('getAndFixCharacterState()', () => {
        it('returns saved state', () => {
            const server = { id: 'srvr' };
            const character = { _id: (0, mocks_1.genObjectId)(), state: { srvr: { x: 100, y: 321, map: 'bar' } } };
            const map = { id: 'bar', spawnArea: (0, rect_1.rect)(10, 20, 0, 0) };
            const world = { getMainMap: () => map, getMap: () => map };
            const states = new counter_1.CounterService(1);
            const state = (0, characterUtils_1.getAndFixCharacterState)(server, character, world, states);
            (0, chai_1.expect)(state).eql({ x: 100, y: 321, map: 'bar' });
        });
        it('returns state from from counter service if available', () => {
            const server = { id: 'srvr' };
            const character = { _id: (0, mocks_1.genObjectId)(), state: { srvr: { x: 100, y: 321, map: 'bar' } } };
            const map = { id: 'bar', spawnArea: (0, rect_1.rect)(10, 20, 0, 0) };
            const world = { getMainMap: () => map, getMap: () => map };
            const states = new counter_1.CounterService(1);
            states.add(character._id.toString(), {
                x: 4, y: 7, map: 'foo', flags: 1 /* CharacterStateFlags.Right */ | 2 /* CharacterStateFlags.Extra */
            });
            const state = (0, characterUtils_1.getAndFixCharacterState)(server, character, world, states);
            (0, chai_1.expect)(state).eql({ x: 4, y: 7, map: 'foo', flags: 1 /* CharacterStateFlags.Right */ | 2 /* CharacterStateFlags.Extra */ });
        });
        it('creates default state if none is provided', () => {
            const server = {};
            const character = { _id: (0, mocks_1.genObjectId)() };
            const map = { id: 'foo', spawnArea: (0, rect_1.rect)(10, 20, 0, 0) };
            const world = { getMainMap: () => map, getMap: () => map };
            const states = new counter_1.CounterService(1);
            const state = (0, characterUtils_1.getAndFixCharacterState)(server, character, world, states);
            (0, chai_1.expect)(state).eql({ x: 10, y: 20, map: 'foo' });
        });
        it('spawns on main map at spawn point if RespawnAtSpawn flag is set', () => {
            const server = { id: 'srvr' };
            const character = {
                _id: (0, mocks_1.genObjectId)(),
                state: { srvr: { x: 100, y: 321, map: 'bar' } },
                flags: 8 /* CharacterFlags.RespawnAtSpawn */,
            };
            const map = { id: 'foo', spawnArea: (0, rect_1.rect)(10, 20, 0, 0) };
            const world = { getMainMap: () => map, getMap: () => map };
            const states = new counter_1.CounterService(1);
            const state = (0, characterUtils_1.getAndFixCharacterState)(server, character, world, states);
            (0, chai_1.expect)(state).eql({ x: 10, y: 20, map: 'foo' });
        });
    });
    describe('createCharacterState()', () => {
        const map = (0, serverMap_1.createServerMap)('foo', 0, 1, 1);
        it('returns state of character', () => {
            (0, chai_1.expect)((0, playerUtils_1.createCharacterState)((0, mocks_1.entity)(0, 12, 23), map)).eql({
                x: 12,
                y: 23,
                map: 'foo',
            });
        });
        it('encodes right flag', () => {
            const state = (0, playerUtils_1.createCharacterState)((0, mocks_1.entity)(0, 12, 23, 0, { state: 2 /* EntityState.FacingRight */ }), map);
            (0, chai_1.expect)((0, utils_1.hasFlag)(state.flags, 1 /* CharacterStateFlags.Right */)).true;
        });
        it('encodes held object', () => {
            const state = (0, playerUtils_1.createCharacterState)((0, mocks_1.entity)(0, 12, 23, 0, { options: { hold: entities.apple.type } }), map);
            (0, chai_1.expect)(state.hold).equal('apple');
        });
        it('encodes extra flag', () => {
            const state = (0, playerUtils_1.createCharacterState)((0, mocks_1.entity)(0, 12, 23, 0, { options: { extra: true } }), map);
            (0, chai_1.expect)((0, utils_1.hasFlag)(state.flags, 2 /* CharacterStateFlags.Extra */)).true;
        });
    });
});
//# sourceMappingURL=characterUtils.spec.js.map