"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lib_1 = require("../lib");
const utf8_1 = require("ag-sockets/dist/utf8");
const rxjs_1 = require("rxjs");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const handlers = tslib_1.__importStar(require("../../client/handlers"));
const entities_1 = require("../../common/entities");
const clientActions_1 = require("../../client/clientActions");
const gameService_1 = require("../../components/services/gameService");
const game_1 = require("../../client/game");
const mocks_1 = require("../mocks");
const updateEncoder_1 = require("../../common/encoders/updateEncoder");
const serverActions_1 = require("../../server/serverActions");
const paletteManager_1 = require("../../graphics/paletteManager");
const camera_1 = require("../../common/camera");
const graphicsUtils_1 = require("../../graphics/graphicsUtils");
const model_1 = require("../../components/services/model");
const region_1 = require("../../common/region");
const worldMap_1 = require("../../common/worldMap");
const serverRegion_1 = require("../../server/serverRegion");
describe('ClientActions', () => {
    let zone;
    let model = (0, lib_1.stubClass)(model_1.Model);
    let gameService = (0, lib_1.stubClass)(gameService_1.GameService);
    let server = (0, lib_1.stubClass)(serverActions_1.ServerActions);
    let game;
    let clientActions;
    let onMessage;
    let onPonyAddOrUpdate;
    beforeEach(() => {
        zone = { run: (f) => f() };
        (0, lib_1.resetStubMethods)(gameService, 'left', 'joined', 'disconnected');
        (0, lib_1.resetStubMethods)(server, 'action', 'getPonies', 'fixedPosition');
        (0, lib_1.resetStubMethods)(model);
        onMessage = (0, mocks_1.mockSubject)();
        onPonyAddOrUpdate = (0, mocks_1.mockSubject)();
        game = (0, mocks_1.mock)(game_1.PonyTownGame);
        game.fallbackPonies = new Map();
        game.map = (0, worldMap_1.createWorldMap)({ type: 0, flags: 0, regionsX: 2, regionsY: 2, defaultTile: 0 /* TileType.None */ });
        (0, worldMap_1.setRegion)(game.map, 0, 0, (0, region_1.createRegion)(0, 0));
        game.camera = (0, camera_1.createCamera)();
        game.notifications = [];
        game.send = f => f(server);
        game.apply = f => f();
        game.onMessage = onMessage;
        game.onPonyAddOrUpdate = onPonyAddOrUpdate;
        game.onPartyUpdate = new rxjs_1.Subject();
        game.paletteManager = new paletteManager_1.PaletteManager();
        game.onActionsUpdate = new rxjs_1.Subject();
        game.webgl = { palettes: graphicsUtils_1.commonPalettes };
        game.settings = {
            account: {},
        };
        model.ponies = [];
        clientActions = new clientActions_1.ClientActions(gameService, game, model, zone);
    });
    it('can be created with defaults', () => {
        clientActions = new clientActions_1.ClientActions(gameService, game, model, zone);
    });
    describe('connected()', () => {
        it('resets game player', () => {
            game.player = {};
            clientActions.connected();
            (0, chai_1.expect)(game.player).undefined;
        });
        it('resets game map', () => {
            game.map = {};
            clientActions.connected();
            (0, chai_1.expect)(game.map).not.undefined;
        });
        it('notifies game service', () => {
            clientActions.connected();
            sinon_1.assert.calledOnce(gameService.joined);
        });
        it('notifies game', () => {
            const joined = (0, sinon_1.stub)(game, 'joined');
            clientActions.connected();
            sinon_1.assert.calledOnce(joined);
        });
        it('sends info', () => {
            clientActions.connected();
            sinon_1.assert.calledWith(server.actionParam2, 20 /* Action.Info */, 2 /* InfoFlags.SupportsWASM */ | 4 /* InfoFlags.SupportsLetAndConst */);
        });
    });
    describe('disconnected()', () => {
        it('notifies game service', () => {
            clientActions.disconnected();
            sinon_1.assert.calledOnce(gameService.disconnected);
        });
    });
    describe('worldState()', () => {
        it('sets game state', () => {
            const state = {};
            const setWorldState = (0, sinon_1.stub)(game, 'setWorldState');
            clientActions.worldState(state, true);
            sinon_1.assert.calledWith(setWorldState, state, true);
        });
    });
    describe('mapState()', () => {
        it('initializes game map', () => {
            game.map = undefined;
            clientActions.mapState({ type: 0, flags: 0, regionsX: 1, regionsY: 2, defaultTile: 3 /* TileType.Water */ }, { weather: 0 /* Weather.None */ });
            (0, chai_1.expect)(game.map).not.undefined;
            (0, chai_1.expect)(game.map.regionsX).equal(1);
            (0, chai_1.expect)(game.map.regionsY).equal(2);
            (0, chai_1.expect)(game.map.defaultTile).equal(3 /* TileType.Water */);
        });
    });
    describe('myEntity()', () => {
        it('sets player fields', () => {
            clientActions.myEntity(123, 'name', 'info', 'charid', 456);
            (0, chai_1.expect)(game.playerId).equal(123);
            (0, chai_1.expect)(game.playerName).equal('name');
            (0, chai_1.expect)(game.playerInfo).equal('info');
            (0, chai_1.expect)(game.playerCRC).equal(456);
        });
        it('updates self flag for party members', () => {
            game.party = {
                leaderId: 0,
                members: [
                    { id: 321, leader: false, offline: false, pending: false, pony: {}, self: true },
                    { id: 123, leader: false, offline: false, pending: false, pony: {}, self: false },
                ],
            };
            clientActions.myEntity(123, '', '', '', 0);
            (0, chai_1.expect)(game.party.members[0].self).false;
            (0, chai_1.expect)(game.party.members[1].self).true;
        });
    });
    describe('updateRegions()', () => {
        let handleUpdateEntity;
        let handleSays;
        let region;
        beforeEach(() => {
            region = (0, serverRegion_1.createServerRegion)(1, 2);
            handleSays = (0, sinon_1.stub)(handlers, 'handleSays');
            handleUpdateEntity = (0, sinon_1.stub)(handlers, 'handleUpdateEntity');
        });
        afterEach(() => {
            handleSays.restore();
            handleUpdateEntity.restore();
        });
        it('does nothing for empty update list', () => {
            const emptyUpdate = (0, updateEncoder_1.encodeUpdateSimple)(region);
            clientActions.update([], [], null, [emptyUpdate], []);
        });
        it('updates map tiles', () => {
            region.x = region.y = 0;
            region.tileUpdates.push({ x: 1, y: 2, type: 3 }, { x: 3, y: 2, type: 1 });
            const data = (0, updateEncoder_1.encodeUpdateSimple)(region);
            clientActions.update([], [], null, [data], []);
            (0, chai_1.expect)((0, worldMap_1.getTile)(game.map, 1, 2)).equal(3);
            (0, chai_1.expect)((0, worldMap_1.getTile)(game.map, 3, 2)).equal(1);
        });
        it('calls handleSays for each entry', () => {
            clientActions.update([], [], null, [], [[1, 'foo', 0 /* MessageType.Chat */], [2, 'var', 4 /* MessageType.Party */]]);
            sinon_1.assert.calledTwice(handleSays);
            sinon_1.assert.calledWith(handleSays, game, 1, 'foo', 0 /* MessageType.Chat */);
            sinon_1.assert.calledWith(handleSays, game, 2, 'var', 4 /* MessageType.Party */);
        });
    });
    describe('fixPosition()', () => {
        it('updates player position', () => {
            game.player = {};
            clientActions.fixPosition(123, 456, true);
            (0, chai_1.expect)(game.player.x).equal(123);
            (0, chai_1.expect)(game.player.y).equal(456);
        });
        it('sends fixed position message back to server', () => {
            clientActions.fixPosition(123, 456, true);
            sinon_1.assert.calledOnce(server.fixedPosition);
        });
        it('does nothing if no player', () => {
            game.player = undefined;
            clientActions.fixPosition(123, 456, true);
        });
    });
    describe('left()', () => {
        it('resets game player', () => {
            game.player = {};
            clientActions.left(0 /* LeaveReason.None */);
            (0, chai_1.expect)(game.player).undefined;
        });
        it('resets game map', () => {
            game.map = {};
            clientActions.left(0 /* LeaveReason.None */);
            (0, chai_1.expect)(game.map).not.undefined;
        });
        it('notifies game service', () => {
            clientActions.left(1 /* LeaveReason.Swearing */);
            sinon_1.assert.calledWith(gameService.left, 'clientActions.left', 1 /* LeaveReason.Swearing */);
        });
    });
    describe('addNotification()', () => {
        it('adds notification to game', () => {
            const e = (0, mocks_1.entity)(456, 0, 0, entities_1.pony.type, { ponyState: {} });
            (0, worldMap_1.addEntity)(game.map, e);
            clientActions.addNotification(123, 456, 'name', 'test', 'note', 1 /* NotificationFlags.Ok */);
            (0, chai_1.expect)(game.notifications).eql([
                { id: 123, message: 'test', note: 'note', flags: 1 /* NotificationFlags.Ok */, open: false, fresh: true, pony: e }
            ]);
        });
        it('sets pony to offline pony if no pony is provided', () => {
            const pony = game.offlinePony = { offlinePony: true };
            clientActions.addNotification(123, 0, 'name', 'test', 'note', 1 /* NotificationFlags.Ok */);
            (0, chai_1.expect)(game.notifications).eql([
                { id: 123, message: 'test', note: 'note', flags: 1 /* NotificationFlags.Ok */, open: false, fresh: true, pony }
            ]);
        });
        it('sets pony to supporter pony if supporter pony flag is set', () => {
            const pony = game.supporterPony = { supporterPony: true };
            clientActions.addNotification(123, 0, 'name', 'test', 'note', 32 /* NotificationFlags.Supporter */);
            (0, chai_1.expect)(game.notifications).eql([
                { id: 123, message: 'test', note: 'note', flags: 32 /* NotificationFlags.Supporter */, open: false, fresh: true, pony }
            ]);
        });
    });
    describe('removeNotification()', () => {
        it('removes notification with given id', () => {
            game.notifications.push({ id: 123 });
            clientActions.removeNotification(123);
            (0, chai_1.expect)(game.notifications).eql([]);
        });
        it('removes notification in digest cycle', () => {
            const run = (0, sinon_1.stub)(zone, 'run');
            clientActions.removeNotification(123);
            sinon_1.assert.calledOnce(run);
        });
    });
    describe('updateSelection()', () => {
        it('selects new entity', () => {
            const newPony = (0, mocks_1.entity)(456, 0, 0, entities_1.pony.type, { ponyState: {} });
            game.selected = (0, mocks_1.entity)(123);
            (0, worldMap_1.addEntity)(game.map, newPony);
            const select = (0, sinon_1.stub)(game, 'select');
            clientActions.updateSelection(123, 456);
            sinon_1.assert.calledWith(select, newPony);
        });
        it('does nothing if selected ID is not current ID', () => {
            const select = (0, sinon_1.stub)(game, 'select');
            clientActions.updateSelection(123, 456);
            sinon_1.assert.notCalled(select);
        });
    });
    describe('updateParty()', () => {
        it('clears party if passed undefined', () => {
            game.party = {};
            clientActions.updateParty(undefined);
            (0, chai_1.expect)(game.party).undefined;
        });
        it('clears party if passed empty list', () => {
            game.party = {};
            clientActions.updateParty([]);
            (0, chai_1.expect)(game.party).undefined;
        });
        it('updates party', () => {
            clientActions.updateParty([
                [123, 1 /* PartyFlags.Leader */],
            ]);
            (0, chai_1.expect)(game.party).eql({
                leaderId: 123,
                members: [
                    { id: 123, leader: true, offline: false, pending: false, pony: undefined, self: false },
                ],
            });
        });
        it('gets missing pony info from server', () => {
            clientActions.updateParty([
                [123, 1 /* PartyFlags.Leader */],
            ]);
            sinon_1.assert.calledWithMatch(server.getPonies, [123]);
        });
    });
    describe('ponies()', () => {
        it('does nothing for empty list', () => {
            clientActions.updatePonies([]);
        });
        it('updates party pony', () => {
            game.party = {
                leaderId: 0,
                members: [
                    { id: 123, pony: undefined, leader: true, pending: false, offline: false, self: false },
                ],
            };
            clientActions.updatePonies([
                [123, {}, (0, utf8_1.encodeString)('foo'), new Uint8Array([1, 2, 3]), 0, false],
            ]);
            (0, chai_1.expect)(game.party.members[0].pony).not.undefined;
        });
    });
});
//# sourceMappingURL=clientActions.spec.js.map