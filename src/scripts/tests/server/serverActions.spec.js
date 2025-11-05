"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lib_1 = require("../lib");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const lodash_1 = require("lodash");
const ag_sockets_1 = require("ag-sockets");
const utf8_1 = require("ag-sockets/dist/utf8");
const serverActions_1 = require("../../server/serverActions");
const world_1 = require("../../server/world");
const serverMap_1 = require("../../server/serverMap");
const party_1 = require("../../server/services/party");
const notification_1 = require("../../server/services/notification");
const hiding_1 = require("../../server/services/hiding");
const mocks_1 = require("../mocks");
const playerUtils_1 = require("../../server/playerUtils");
const counter_1 = require("../../server/services/counter");
const clientUtils_1 = require("../../client/clientUtils");
const expressionEncoder_1 = require("../../common/encoders/expressionEncoder");
const supporterInvites_1 = require("../../server/services/supporterInvites");
const camera_1 = require("../../common/camera");
const friends_1 = require("../../server/services/friends");
const playerUtils = tslib_1.__importStar(require("../../server/playerUtils"));
describe('ServerActions', () => {
    let accountService = (0, lib_1.stubFromInstance)({
        update() { },
        updateAccount() { },
        updateSettings() { },
        updateCharacterState() { }
    });
    let notifications = (0, lib_1.stubClass)(notification_1.NotificationService);
    let partyService = (0, lib_1.stubClass)(party_1.PartyService);
    let hiding = (0, lib_1.stubClass)(hiding_1.HidingService);
    let friends = (0, lib_1.stubClass)(friends_1.FriendsService);
    let states = (0, lib_1.stubClass)(counter_1.CounterService);
    let teleports = (0, lib_1.stubClass)(counter_1.CounterService);
    let supporterInvites = (0, lib_1.stubClass)(supporterInvites_1.SupporterInvitesService);
    let client;
    let world;
    let serverActions;
    let settings;
    let server;
    let ignorePlayer;
    let findClientByEntityId;
    let say;
    let move;
    let execAction;
    beforeEach(() => {
        (0, lib_1.resetStubMethods)(accountService, 'update', 'updateSettings');
        (0, lib_1.resetStubMethods)(notifications, 'acceptNotification', 'rejectNotification');
        (0, lib_1.resetStubMethods)(partyService, 'invite', 'remove', 'promoteLeader');
        (0, lib_1.resetStubMethods)(hiding, 'requestUnhideAll', 'requestHide');
        (0, lib_1.resetStubMethods)(friends, 'add', 'remove', 'removeByAccountId');
        (0, lib_1.resetStubMethods)(teleports);
        execAction = (0, sinon_1.stub)(playerUtils, 'execAction');
        client = (0, mocks_1.mockClient)();
        world = new world_1.World({ flags: { friends: true } }, { partyChanged: { subscribe() { } } }, {}, {}, {}, () => ({}), {}, {});
        const map = (0, serverMap_1.createServerMap)('', 0, 1, 1);
        client.map = map;
        world.maps.push(map);
        settings = {};
        server = { flags: {} };
        ignorePlayer = (0, sinon_1.spy)();
        findClientByEntityId = (0, sinon_1.stub)();
        say = (0, sinon_1.spy)();
        move = (0, sinon_1.spy)();
        serverActions = new serverActions_1.ServerActions(client, world, notifications, partyService, supporterInvites, () => settings, server, say, move, hiding, states, accountService, ignorePlayer, findClientByEntityId, friends);
    });
    afterEach(() => {
        execAction.restore();
    });
    describe('connected()', () => {
        // TODO: ...
    });
    describe('disconnected()', () => {
        let clock;
        beforeEach(() => {
            clock = (0, sinon_1.useFakeTimers)();
        });
        afterEach(() => {
            clock.restore();
        });
        it('sets client offline flag to true', () => {
            serverActions.disconnected();
            (0, chai_1.expect)(client.offline).true;
        });
        it('leaves client from world', () => {
            const leaveClient = (0, sinon_1.stub)(world, 'leaveClient');
            serverActions.disconnected();
            sinon_1.assert.calledWith(leaveClient, client);
        });
        it('notifies party service', () => {
            serverActions.disconnected();
            sinon_1.assert.calledWith(partyService.clientDisconnected, client);
        });
        it('updates last visit', () => {
            clock.setSystemTime(1234);
            serverActions.disconnected();
            sinon_1.assert.calledWith(accountService.updateAccount, client.accountId, { lastVisit: new Date(1234), state: undefined });
        });
        it('updates character state', () => {
            client.pony.x = 123;
            client.pony.y = 321;
            serverActions.disconnected();
            sinon_1.assert.calledWith(accountService.updateCharacterState, client.characterId, (0, playerUtils_1.createCharacterState)(client.pony, client.map));
        });
        it('adds state to counter service', () => {
            client.pony.x = 123;
            client.pony.y = 321;
            serverActions.disconnected();
            sinon_1.assert.calledWithMatch(states.add, client.characterId, { x: 123, y: 321 });
        });
        it('logs client leaving', () => {
            const systemLog = (0, sinon_1.stub)(client.reporter, 'systemLog');
            server.id = 'server_id';
            clock.setSystemTime(12 * 1000);
            client.connectedTime = 0;
            serverActions.disconnected();
            sinon_1.assert.calledWith(systemLog, 'left [server_id] (disconnected) (12s)');
        });
    });
    describe('say()', () => {
        it('calls chatSay', async () => {
            serverActions.say(0, 'hello', 0 /* ChatType.Say */);
            sinon_1.assert.calledWith(say, client, 'hello', 0 /* ChatType.Say */, undefined, settings);
        });
        it('throws if message is not a string', () => {
            (0, chai_1.expect)(() => serverActions.say(0, {}, 0 /* ChatType.Say */)).throw('Not a string (text)');
            (0, chai_1.expect)(() => serverActions.say(0, 123, 0 /* ChatType.Say */)).throw('Not a string (text)');
            (0, chai_1.expect)(() => serverActions.say(0, null, 0 /* ChatType.Say */)).throw('Not a string (text)');
        });
        it('throws if type is not a number', () => {
            (0, chai_1.expect)(() => serverActions.say(0, 'test', {})).throw('Not a number (chatType)');
            (0, chai_1.expect)(() => serverActions.say(0, 'test', '1')).throw('Not a number (chatType)');
            (0, chai_1.expect)(() => serverActions.say(0, 'test', null)).throw('Not a number (chatType)');
        });
    });
    describe('select()', () => {
        it('sets selected entity', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            (0, sinon_1.stub)(world, 'getEntityById').withArgs(123).returns(entity);
            serverActions.select(123, 1 /* SelectFlags.FetchEx */);
            (0, chai_1.expect)(client.selected).equal(entity);
        });
        it('sets selected entity from other sources', () => {
            const entity = { id: 123 };
            findClientByEntityId.withArgs(client, 123).returns({ pony: entity });
            (0, sinon_1.stub)(world, 'getEntityById').returns(undefined);
            serverActions.select(123, 1 /* SelectFlags.FetchEx */);
            (0, chai_1.expect)(client.selected).equal(entity);
        });
        it('sends extra data for selected entity', () => {
            const entity = (0, mocks_1.serverEntity)(1, 0, 0, 0, { client: {}, extraOptions: { foo: 5 } });
            (0, sinon_1.stub)(world, 'getEntityById').withArgs(123).returns(entity);
            serverActions.select(123, 1 /* SelectFlags.FetchEx */);
            (0, chai_1.expect)(Array.from((0, ag_sockets_1.getWriterBuffer)(client.updateQueue)))
                .eql([2, 0, 32, 0, 0, 0, 1, 129, 3, 102, 111, 111, 165]);
        });
        it('does not send extra data for selected entity if fetch flag is false', () => {
            const entity = (0, mocks_1.serverEntity)(1, 0, 0, 0, { client: {}, extraOptions: { foo: 5 } });
            (0, sinon_1.stub)(world, 'getEntityById').withArgs(123).returns(entity);
            serverActions.select(123, 0 /* SelectFlags.None */);
            (0, chai_1.expect)(Array.from((0, ag_sockets_1.getWriterBuffer)(client.updateQueue))).eql([]);
        });
        it('sends extra mod data for selected entity', () => {
            const entity = (0, mocks_1.serverEntity)(1, 0, 0, 0, {
                client: {
                    accountId: '12345678901234567890aa',
                    account: {
                        name: 'foobar',
                        shadow: 0,
                        mute: -1,
                        note: 'bar'
                    }
                }
            });
            (0, sinon_1.stub)(world, 'getEntityById').withArgs(123).returns(entity);
            client.isMod = true;
            serverActions.select(123, 1 /* SelectFlags.FetchEx */);
            (0, chai_1.expect)(Array.from((0, ag_sockets_1.getWriterBuffer)(client.updateQueue))).eql([
                2, 0, 32, 0, 0, 0, 1, 129, 7, 109, 111, 100, 73, 110, 102, 111, 134, 6, 115, 104, 97, 100, 111,
                119, 0, 4, 109, 117, 116, 101, 69, 112, 101, 114, 109, 97, 4, 110, 111, 116, 101, 67, 98, 97,
                114, 8, 99, 111, 117, 110, 116, 101, 114, 115, 128, 7, 99, 111, 117, 110, 116, 114, 121, 0, 7,
                97, 99, 99, 111, 117, 110, 116, 76, 102, 111, 111, 98, 97, 114, 32, 91, 48, 97, 97, 93
            ]);
        });
    });
    describe('interact()', () => {
        it('calls interaction with client and entity', () => {
            const entity = (0, mocks_1.serverEntity)(1);
            const interact = (0, sinon_1.stub)();
            entity.interact = interact;
            (0, sinon_1.stub)(world, 'getEntityById').withArgs(123).returns(entity);
            serverActions.interact(123);
            sinon_1.assert.calledOnce(interact);
        });
        it('updates last action', () => {
            client.lastPacket = 0;
            serverActions.interact(123);
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
        it('throws on not a number', () => {
            (0, chai_1.expect)(() => serverActions.interact('foo')).throw('Not a number (entityId)');
        });
    });
    describe('use()', () => {
        // TODO: ...
    });
    describe('action()', () => {
        it('calls unhideAll on hiding service', () => {
            serverActions.action(9 /* Action.UnhideAllHiddenPlayers */);
            sinon_1.assert.calledWith(hiding.requestUnhideAll, client);
        });
        it('does nothing for KeepAlive action', () => {
            serverActions.action(21 /* Action.KeepAlive */);
            sinon_1.assert.notCalled(execAction);
        });
        it('executes player action', () => {
            serverActions.action(2 /* Action.TurnHead */);
            sinon_1.assert.calledWith(execAction, client, 2 /* Action.TurnHead */);
        });
        it('updates last action', () => {
            client.lastPacket = 0;
            serverActions.action(1 /* Action.Boop */);
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
        it('throws on not a number', () => {
            (0, chai_1.expect)(() => serverActions.action('foo')).throw('Not a number (action)');
        });
    });
    describe('actionParam()', () => {
        it('on RemoveFriend: calls friends.remove()', () => {
            const friend = (0, mocks_1.mockClient)();
            world.clientsByAccount.set('some_account_id', friend);
            serverActions.actionParam(22 /* Action.RemoveFriend */, 'some_account_id');
            sinon_1.assert.calledWith(friends.remove, client, friend);
        });
        it('on RemoveFriend: calls friends.removeByAccountId() if cannot find client', () => {
            serverActions.actionParam(22 /* Action.RemoveFriend */, 'some_account_id');
            sinon_1.assert.calledWith(friends.removeByAccountId, client, 'some_account_id');
        });
    });
    describe('actionParam2()', () => {
        it('on Info: update client flags', () => {
            serverActions.actionParam2(20 /* Action.Info */, 2 /* InfoFlags.SupportsWASM */ | 4 /* InfoFlags.SupportsLetAndConst */);
            (0, chai_1.expect)(client.supportsWasm).true;
            (0, chai_1.expect)(client.supportsLetAndConst).true;
        });
        it('throws on invalid action', () => {
            (0, chai_1.expect)(() => serverActions.actionParam2(99, undefined)).throws('Invalid Action (99)');
        });
    });
    describe('expression()', () => {
        it('sets expression for player character', () => {
            const expression = (0, clientUtils_1.createExpression)(19 /* Eye.Angry */, 6 /* Eye.Closed */, 4 /* Muzzle.Blep */);
            serverActions.expression((0, expressionEncoder_1.encodeExpression)(expression));
            (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)(expression));
            (0, chai_1.expect)(client.pony.exprPermanent).eql(expression);
        });
        it('updates last action', () => {
            client.lastPacket = 0;
            serverActions.expression(0);
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
        it('throws on not a number', () => {
            (0, chai_1.expect)(() => serverActions.expression('foo')).throw('Not a number (expression)');
        });
    });
    describe('playerAction()', () => {
        let clock;
        beforeEach(() => {
            clock = (0, sinon_1.useFakeTimers)();
        });
        afterEach(() => clock.restore());
        it('ignores player', () => {
            const target = (0, mocks_1.mockClient)();
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(123).returns(target);
            serverActions.playerAction(123, 1 /* PlayerAction.Ignore */, undefined);
            sinon_1.assert.calledWith(ignorePlayer, client, target, true);
        });
        it('unignores player', () => {
            const target = (0, mocks_1.mockClient)();
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(123).returns(target);
            serverActions.playerAction(123, 2 /* PlayerAction.Unignore */, undefined);
            sinon_1.assert.calledWith(ignorePlayer, client, target, false);
        });
        it('invites player to party', () => {
            const target = (0, mocks_1.mockClient)();
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(123).returns(target);
            serverActions.playerAction(123, 3 /* PlayerAction.InviteToParty */, undefined);
            sinon_1.assert.calledWith(partyService.invite, client, target);
        });
        it('removes player from party', () => {
            const target = (0, mocks_1.mockClient)();
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(123).returns(target);
            serverActions.playerAction(123, 4 /* PlayerAction.RemoveFromParty */, undefined);
            sinon_1.assert.calledWith(partyService.remove, client, target);
        });
        it('promotes player to party leader', () => {
            const target = (0, mocks_1.mockClient)();
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(123).returns(target);
            serverActions.playerAction(123, 5 /* PlayerAction.PromotePartyLeader */, undefined);
            sinon_1.assert.calledWith(partyService.promoteLeader, client, target);
        });
        it('hides player', () => {
            const target = (0, mocks_1.mockClient)();
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(123).returns(target);
            serverActions.playerAction(123, 6 /* PlayerAction.HidePlayer */, 12345678);
            sinon_1.assert.calledWith(hiding.requestHide, client, target, 12345678);
        });
        it('invites player to supporters', () => {
            const target = (0, mocks_1.mockClient)();
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(123).returns(target);
            serverActions.playerAction(123, 7 /* PlayerAction.InviteToSupporterServers */, undefined);
            sinon_1.assert.calledWith(supporterInvites.requestInvite, client, target);
        });
        it('updates last action', () => {
            (0, sinon_1.stub)(world, 'getClientByEntityId').returns({});
            client.lastPacket = 0;
            clock.setSystemTime(123);
            serverActions.playerAction(1, 3 /* PlayerAction.InviteToParty */, undefined);
            (0, chai_1.expect)(client.lastPacket).equal(123);
        });
        it('logs warning if cannot find target player', () => {
            const warnLog = (0, sinon_1.stub)(client.reporter, 'warnLog');
            serverActions.playerAction(1, 1 /* PlayerAction.Ignore */, undefined);
            sinon_1.assert.calledOnce(warnLog);
        });
        it('AddFriend: calls friends.add()', () => {
            const target = (0, mocks_1.mockClient)();
            (0, sinon_1.stub)(world, 'getClientByEntityId').returns(target);
            serverActions.playerAction(1, 8 /* PlayerAction.AddFriend */, undefined);
            sinon_1.assert.calledWith(friends.add, client, target);
        });
        it('RemoveFriend: calls friends.remove()', () => {
            const target = (0, mocks_1.mockClient)();
            (0, sinon_1.stub)(world, 'getClientByEntityId').returns(target);
            serverActions.playerAction(1, 9 /* PlayerAction.RemoveFriend */, undefined);
            sinon_1.assert.calledWith(friends.remove, client, target);
        });
        it('throws on entityId not a number', () => {
            (0, chai_1.expect)(() => serverActions.playerAction('foo', 1 /* PlayerAction.Ignore */, undefined))
                .throw('Not a number (entityId)');
        });
        it('throws on action not a number', () => {
            (0, chai_1.expect)(() => serverActions.playerAction(1, 'foo', undefined))
                .throw('Not a number (action)');
        });
        it('throws on invalid action', () => {
            (0, sinon_1.stub)(world, 'getClientByEntityId').returns({});
            (0, chai_1.expect)(() => serverActions.playerAction(1, 999, undefined))
                .throw('Invalid player action (undefined) [999]');
        });
    });
    describe('leaveParty()', () => {
        it('removes client from party', () => {
            const leader = {};
            client.party = { id: '', clients: [leader, client], leader, pending: [] };
            serverActions.leaveParty();
            sinon_1.assert.calledWith(partyService.remove, leader, client);
        });
        it('does nothing if not in a party', () => {
            serverActions.leaveParty();
            sinon_1.assert.notCalled(partyService.remove);
        });
        it('updates last action', () => {
            client.lastPacket = 0;
            serverActions.leaveParty();
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
    });
    describe('otherAction()', () => {
        let target;
        let clock;
        let getClientByEntityId;
        beforeEach(() => {
            clock = (0, sinon_1.useFakeTimers)();
            clock.setSystemTime(123456);
            target = (0, mocks_1.mockClient)();
            getClientByEntityId = (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(222).returns(target);
            client.account.roles = ['admin'];
            client.account.name = 'Acc';
            client.character.name = 'Char';
            client.isMod = true;
        });
        afterEach(() => {
            clock.restore();
        });
        it('reports target client', async () => {
            const system = (0, sinon_1.stub)(target.reporter, 'system');
            await serverActions.otherAction(222, 1 /* ModAction.Report */, 0);
            sinon_1.assert.calledWith(system, 'Reported by Acc');
        });
        it('mutes target client', async () => {
            const system = (0, sinon_1.stub)(target.reporter, 'system');
            await serverActions.otherAction(222, 2 /* ModAction.Mute */, -1);
            sinon_1.assert.calledWith(system, 'Muted by Acc');
            sinon_1.assert.calledWith(accountService.update, target.accountId, { mute: -1 });
        });
        it('mutes target client for given amount of time', async () => {
            const system = (0, sinon_1.stub)(target.reporter, 'system');
            await serverActions.otherAction(222, 2 /* ModAction.Mute */, 123);
            sinon_1.assert.calledWith(system, 'Muted for (a few seconds) by Acc');
            sinon_1.assert.calledWith(accountService.update, target.accountId, { mute: Date.now() + 123 });
        });
        it('unmutes target client', async () => {
            const system = (0, sinon_1.stub)(target.reporter, 'system');
            await serverActions.otherAction(222, 2 /* ModAction.Mute */, 0);
            sinon_1.assert.calledWith(system, 'Unmuted by Acc');
            sinon_1.assert.calledWith(accountService.update, target.accountId, { mute: 0 });
        });
        it('shadows target client', async () => {
            const system = (0, sinon_1.stub)(target.reporter, 'system');
            await serverActions.otherAction(222, 3 /* ModAction.Shadow */, -1);
            sinon_1.assert.calledWith(system, 'Shadowed by Acc');
            sinon_1.assert.calledWith(accountService.update, target.accountId, { shadow: -1 });
        });
        it('shadows target client for given amount of time', async () => {
            const system = (0, sinon_1.stub)(target.reporter, 'system');
            await serverActions.otherAction(222, 3 /* ModAction.Shadow */, 123);
            sinon_1.assert.calledWith(system, 'Shadowed for (a few seconds) by Acc');
            sinon_1.assert.calledWith(accountService.update, target.accountId, { shadow: Date.now() + 123 });
        });
        it('unshadows target client', async () => {
            const system = (0, sinon_1.stub)(target.reporter, 'system');
            await serverActions.otherAction(222, 3 /* ModAction.Shadow */, 0);
            sinon_1.assert.calledWith(system, 'Unshadowed by Acc');
            sinon_1.assert.calledWith(accountService.update, target.accountId, { shadow: 0 });
        });
        it('updates last action', async () => {
            client.lastPacket = 0;
            clock.tick(1000);
            await serverActions.otherAction(222, 1, 1);
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
        it('rejects on missing client', async () => {
            await (0, chai_1.expect)(serverActions.otherAction(111, 1 /* ModAction.Report */, 0)).rejectedWith('Client does not exist (Report)');
        });
        it('rejects on non admin user', async () => {
            client.account.roles = [];
            client.isMod = false;
            await (0, chai_1.expect)(serverActions.otherAction(111, 1 /* ModAction.Report */, 0)).rejectedWith('Action not allowed (Report)');
        });
        it('disconnectes on non admin user', async () => {
            client.account.roles = [];
            client.isMod = false;
            const disconnect = (0, sinon_1.stub)(client, 'disconnect');
            try {
                await serverActions.otherAction(111, 1 /* ModAction.Report */, 0);
            }
            catch { }
            sinon_1.assert.calledWith(disconnect, true, true);
        });
        it('rejects on action on self', async () => {
            getClientByEntityId.withArgs(1).returns(client);
            await (0, chai_1.expect)(serverActions.otherAction(1, 1 /* ModAction.Report */, 0)).rejectedWith('Cannot perform action on self (Report)');
        });
        it('rejects on invalid action', async () => {
            await (0, chai_1.expect)(serverActions.otherAction(222, 123, 0)).rejectedWith('Invalid mod action (123)');
        });
        it('rejects on entityId not a number', async () => {
            await (0, chai_1.expect)(serverActions.otherAction('foo', 1, 1)).rejectedWith('Not a number (entityId)');
        });
        it('rejects on action not a number', async () => {
            await (0, chai_1.expect)(serverActions.otherAction(1, 'foo', 1)).rejectedWith('Not a number (action)');
        });
        it('rejects on param not a number', async () => {
            await (0, chai_1.expect)(serverActions.otherAction(1, 1, 'foo')).rejectedWith('Not a number (param)');
        });
    });
    describe('setNote()', () => {
        it('updates last action', async () => {
            const other = (0, mocks_1.mockClient)();
            other.accountId = 'dlfhigdh';
            client.lastPacket = 0;
            client.account.roles = ['mod'];
            client.isMod = true;
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(1).returns(other);
            await serverActions.setNote(1, 'foo');
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
        it('updates account note', async () => {
            const other = (0, mocks_1.mockClient)();
            other.accountId = 'gooboo';
            client.account.roles = ['mod'];
            client.isMod = true;
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(1).returns(other);
            await serverActions.setNote(1, 'foo');
            sinon_1.assert.calledWithMatch(accountService.update, 'gooboo', { note: 'foo' });
        });
        it('throws if user is not a mod', async () => {
            const other = (0, mocks_1.mockClient)();
            other.accountId = 'gooboo';
            (0, sinon_1.stub)(world, 'getClientByEntityId').withArgs(1).returns(other);
            await (0, chai_1.expect)(serverActions.setNote(1, 'foo')).rejectedWith('Action not allowed (setNote)');
        });
        it('throws on not a number', async () => {
            await (0, chai_1.expect)(serverActions.setNote('foo', 'foo')).rejectedWith('Not a number (entityId)');
        });
        it('throws on not a string', async () => {
            await (0, chai_1.expect)(serverActions.setNote(1, 5)).rejectedWith('Not a string (text)');
        });
    });
    describe('saveSettings()', () => {
        it('updates last action', () => {
            accountService.updateSettings.resolves();
            client.lastPacket = 0;
            serverActions.saveSettings({});
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
        it('updates account settings', () => {
            accountService.updateSettings.resolves();
            const settings = {};
            serverActions.saveSettings(settings);
            sinon_1.assert.calledWith(accountService.updateSettings, client.account, settings);
        });
    });
    describe('acceptNotification()', () => {
        it('accepts notification', () => {
            serverActions.acceptNotification(123);
            sinon_1.assert.calledWith(notifications.acceptNotification, client, 123);
        });
        it('updates last action', () => {
            client.lastPacket = 0;
            serverActions.acceptNotification(123);
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
        it('throws on not a number', () => {
            (0, chai_1.expect)(() => serverActions.acceptNotification('foo')).throw('Not a number (id)');
        });
    });
    describe('rejectNotification()', () => {
        it('rejects notification', () => {
            serverActions.rejectNotification(123);
            sinon_1.assert.calledWith(notifications.rejectNotification, client, 123);
        });
        it('updates last action', () => {
            client.lastPacket = 0;
            serverActions.rejectNotification(123);
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
        it('throws on not a number', () => {
            (0, chai_1.expect)(() => serverActions.rejectNotification('foo')).throw('Not a number (id)');
        });
    });
    describe('getPonies()', () => {
        it('sends ponies to client', () => {
            const updatePonies = (0, sinon_1.stub)(client, 'updatePonies');
            const name1 = (0, utf8_1.encodeString)('foo');
            const name2 = (0, utf8_1.encodeString)('bar');
            const name3 = (0, utf8_1.encodeString)('xxx');
            const info1 = new Uint8Array([1, 2, 3]);
            const info2 = new Uint8Array([4, 5, 6]);
            const info3 = new Uint8Array([7, 8, 9]);
            client.party = {
                clients: [
                    { pony: { id: 1, options: {}, encodedName: name1, encryptedInfoSafe: info1 } },
                    { pony: { id: 2, options: {}, encodedName: name2, encryptedInfoSafe: info2 } },
                    { pony: { id: 3, options: {}, encodedName: name3, encryptedInfoSafe: info3 } },
                ],
            };
            serverActions.getPonies([1, 2]);
            sinon_1.assert.calledWithMatch(updatePonies, [
                [1, {}, name1, info1, 0, false],
                [2, {}, name2, info2, 0, false],
            ]);
        });
        it('does nothing if not in party', () => {
            const updatePonies = (0, sinon_1.stub)(client, 'updatePonies');
            serverActions.getPonies([1, 2]);
            sinon_1.assert.notCalled(updatePonies);
        });
        it('does nothing if ids is null or empty', () => {
            const updatePonies = (0, sinon_1.stub)(client, 'updatePonies');
            serverActions.getPonies(null);
            serverActions.getPonies([]);
            sinon_1.assert.notCalled(updatePonies);
        });
        it('does nothing if requesting too many ponies', () => {
            const updatePonies = (0, sinon_1.stub)(client, 'updatePonies');
            serverActions.getPonies((0, lodash_1.range)(20));
            sinon_1.assert.notCalled(updatePonies);
        });
    });
    describe('loaded()', () => {
        it('sets ignoreUpdates flag to false', () => {
            client.loading = true;
            serverActions.loaded();
            (0, chai_1.expect)(client.loading).false;
        });
    });
    describe('fixedPosition()', () => {
        it('sets fixing position flag to false', () => {
            client.fixingPosition = true;
            serverActions.fixedPosition();
            (0, chai_1.expect)(client.fixingPosition).false;
        });
    });
    describe('updateCamera()', () => {
        let clock;
        beforeEach(() => {
            clock = (0, sinon_1.useFakeTimers)();
        });
        afterEach(() => {
            clock.restore();
        });
        it('sets up camera', () => {
            serverActions.updateCamera(1, 2, 3, 4);
            (0, chai_1.expect)(client.camera).eql({ ...(0, camera_1.createCamera)(), x: 1, y: 2, w: 64, h: 64 });
        });
        it('updates last action', () => {
            client.lastPacket = 0;
            clock.setSystemTime(123);
            serverActions.updateCamera(0, 0, 0, 0);
            (0, chai_1.expect)(client.lastPacket).equal(123);
        });
        it('throws on "a" not a number', () => {
            (0, chai_1.expect)(() => serverActions.updateCamera('foo', 0, 0, 0)).throw('Not a number (x)');
        });
        it('throws on "b" not a number', () => {
            (0, chai_1.expect)(() => serverActions.updateCamera(0, 'foo', 0, 0)).throw('Not a number (y)');
        });
        it('throws on "c" not a number', () => {
            (0, chai_1.expect)(() => serverActions.updateCamera(0, 0, 'foo', 0)).throw('Not a number (width)');
        });
        it('throws on "d" not a number', () => {
            (0, chai_1.expect)(() => serverActions.updateCamera(0, 0, 0, 'foo')).throw('Not a number (height)');
        });
    });
    describe('update()', () => {
        let clock;
        beforeEach(() => {
            clock = (0, sinon_1.useFakeTimers)();
        });
        afterEach(() => {
            clock.restore();
        });
        it('calls move', () => {
            serverActions.move(1, 2, 3, 4, 5);
            sinon_1.assert.calledWith(move, client, 0, 1, 2, 3, 4, 5);
        });
        it('updates last action', () => {
            client.lastPacket = 0;
            clock.setSystemTime(123);
            serverActions.move(0, 0, 0, 0, 0);
            (0, chai_1.expect)(client.lastPacket).equal(123);
        });
        it('throws on "a" not a number', () => {
            (0, chai_1.expect)(() => serverActions.move('foo', 0, 0, 0, 0)).throw('Not a number (a)');
        });
        it('throws on "b" not a number', () => {
            (0, chai_1.expect)(() => serverActions.move(0, 'foo', 0, 0, 0)).throw('Not a number (b)');
        });
        it('throws on "c" not a number', () => {
            (0, chai_1.expect)(() => serverActions.move(0, 0, 'foo', 0, 0)).throw('Not a number (c)');
        });
        it('throws on "d" not a number', () => {
            (0, chai_1.expect)(() => serverActions.move(0, 0, 0, 'foo', 0)).throw('Not a number (d)');
        });
        it('throws on "e" not a number', () => {
            (0, chai_1.expect)(() => serverActions.move(0, 0, 0, 0, 'foo')).throw('Not a number (e)');
        });
    });
    describe('changeTile()', () => {
        it('sets tile', () => {
            (0, serverMap_1.setTile)(client.map, 1, 2, 1 /* TileType.Dirt */);
            const setTileStub = (0, sinon_1.stub)(world, 'setTile');
            serverActions.changeTile(1, 2, 1 /* TileType.Dirt */);
            sinon_1.assert.calledWith(setTileStub, client.map, 1, 2, 1 /* TileType.Dirt */);
        });
        it.skip('sets tile for mod', () => {
            const setTile = (0, sinon_1.stub)(world, 'setTile');
            client.isMod = true;
            serverActions.changeTile(1, 2, 4 /* TileType.Wood */);
            sinon_1.assert.calledWith(setTile, client.map, 1, 2, 4 /* TileType.Wood */);
        });
        it('does not set tile if shadowed', () => {
            (0, serverMap_1.setTile)(client.map, 1, 2, 1 /* TileType.Dirt */);
            const setTileStub = (0, sinon_1.stub)(world, 'setTile');
            client.shadowed = true;
            serverActions.changeTile(1, 2, 1 /* TileType.Dirt */);
            sinon_1.assert.notCalled(setTileStub);
        });
        it('sends update to client if shadowed', () => {
            (0, serverMap_1.setTile)(client.map, 1, 2, 1 /* TileType.Dirt */);
            client.shadowed = true;
            serverActions.changeTile(1, 2, 1 /* TileType.Dirt */);
            (0, chai_1.expect)((0, ag_sockets_1.getWriterBuffer)(client.updateQueue)).eql(new Uint8Array([4, 0, 1, 0, 2, 1]));
        });
        it('does nothing if invalid tile type', () => {
            (0, serverMap_1.setTile)(client.map, 1, 2, 1 /* TileType.Dirt */);
            const setTileStub = (0, sinon_1.stub)(world, 'setTile');
            serverActions.changeTile(1, 2, 999);
            sinon_1.assert.notCalled(setTileStub);
            (0, chai_1.expect)((0, ag_sockets_1.getWriterBuffer)(client.updateQueue)).eql(new Uint8Array([]));
        });
        it.skip('toggles wall', () => {
            (0, serverMap_1.setTile)(client.map, 1, 2, 1 /* TileType.Dirt */);
            client.account.roles = ['mod'];
            client.isMod = true;
            const toggleWall = (0, sinon_1.stub)(world, 'toggleWall');
            serverActions.changeTile(1, 2, 100 /* TileType.WallH */);
            serverActions.changeTile(3, 4, 101 /* TileType.WallV */);
            sinon_1.assert.calledWith(toggleWall, client.map, 1, 2, 100 /* TileType.WallH */);
            sinon_1.assert.calledWith(toggleWall, client.map, 3, 4, 101 /* TileType.WallV */);
        });
        it('does not toggle wall for non moderators', () => {
            (0, serverMap_1.setTile)(client.map, 1, 2, 1 /* TileType.Dirt */);
            const toggleWall = (0, sinon_1.stub)(world, 'toggleWall');
            serverActions.changeTile(1, 2, 100 /* TileType.WallH */);
            sinon_1.assert.notCalled(toggleWall);
        });
        it('updates last action', () => {
            client.lastPacket = 0;
            serverActions.changeTile(0, 0, 1 /* TileType.Dirt */);
            (0, chai_1.expect)(client.lastPacket).not.equal(0);
        });
        it('throws on "x" not a number', () => {
            (0, chai_1.expect)(() => serverActions.changeTile('foo', 0, 1 /* TileType.Dirt */)).throw('Not a number (x)');
        });
        it('throws on "y" not a number', () => {
            (0, chai_1.expect)(() => serverActions.changeTile(0, 'foo', 1 /* TileType.Dirt */)).throw('Not a number (y)');
        });
        it('throws on "type" not a number', () => {
            (0, chai_1.expect)(() => serverActions.changeTile(0, 0, 'foo')).throw('Not a number (type)');
        });
    });
    describe('leave()', () => {
        it('notifies client', () => {
            const left = (0, sinon_1.stub)(client, 'left');
            serverActions.leave();
            sinon_1.assert.calledOnce(left);
        });
    });
    describe('editorAction()', () => {
        it('places', () => {
            client.isMod = true;
            server.flags.editor = true;
            serverActions.editorAction({ type: 'place', x: 0, y: 0, entity: 'foo' });
        });
        it('undos', () => {
            client.isMod = true;
            server.flags.editor = true;
            serverActions.editorAction({ type: 'undo' });
        });
        it('clears', () => {
            client.isMod = true;
            server.flags.editor = true;
            serverActions.editorAction({ type: 'clear' });
        });
        it('does nothing for non-mod client', () => {
            client.isMod = false;
            server.flags.editor = true;
            serverActions.editorAction({ type: 'undo' });
        });
    });
});
//# sourceMappingURL=serverActions.spec.js.map