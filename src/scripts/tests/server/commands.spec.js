"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../lib");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const mocks_1 = require("../mocks");
const userError_1 = require("../../server/userError");
const commands_1 = require("../../server/commands");
const expressionUtils_1 = require("../../common/expressionUtils");
const expressionEncoder_1 = require("../../common/encoders/expressionEncoder");
const serverMap_1 = require("../../server/serverMap");
const playerUtils = tslib_1.__importStar(require("../../server/playerUtils"));
describe('commands', () => {
    describe('parseCommand()', () => {
        it('returns text and type for regular text', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('hello', 0 /* ChatType.Say */)).eql({ args: 'hello', type: 0 /* ChatType.Say */ });
        });
        it('returns party chat type for /p command', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/p hello', 0 /* ChatType.Say */)).eql({ args: 'hello', type: 1 /* ChatType.Party */ });
        });
        it('returns supporter chat type for /ss command', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/ss hello', 0 /* ChatType.Say */)).eql({ args: 'hello', type: 4 /* ChatType.Supporter */ });
        });
        it('returns supporter 1 chat type for /s1 command', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/s1 hello', 0 /* ChatType.Say */)).eql({ args: 'hello', type: 5 /* ChatType.Supporter1 */ });
        });
        it('returns supporter 2 chat type for /s2 command', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/s2 hello', 0 /* ChatType.Say */)).eql({ args: 'hello', type: 6 /* ChatType.Supporter2 */ });
        });
        it('returns supporter 3 chat type for /s3 command', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/s3 hello', 0 /* ChatType.Say */)).eql({ args: 'hello', type: 7 /* ChatType.Supporter3 */ });
        });
        it('returns say chat type for /s command', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/s hello', 1 /* ChatType.Party */)).eql({ args: 'hello', type: 0 /* ChatType.Say */ });
        });
        it('returns think chat type for /t command', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/t hello', 0 /* ChatType.Say */)).eql({ args: 'hello', type: 2 /* ChatType.Think */ });
        });
        it('returns think chat type for /T command', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/T hello', 0 /* ChatType.Say */)).eql({ args: 'hello', type: 2 /* ChatType.Think */ });
        });
        it('returns party think chat type for /t command in party chat', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/t hello', 1 /* ChatType.Party */)).eql({ args: 'hello', type: 3 /* ChatType.PartyThink */ });
        });
        it('returns correct command', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/test hello', 0 /* ChatType.Say */)).eql({ command: 'test', args: 'hello', type: 0 /* ChatType.Say */ });
        });
        it('returns correct command with no arguments', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/test', 0 /* ChatType.Say */)).eql({ command: 'test', args: '', type: 0 /* ChatType.Say */ });
        });
        it('keeps the same chat type for commands', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/test', 1 /* ChatType.Party */)).eql({ command: 'test', args: '', type: 1 /* ChatType.Party */ });
        });
        it('trims args', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/test  foo bar  ', 0 /* ChatType.Say */)).eql({ command: 'test', args: 'foo bar', type: 0 /* ChatType.Say */ });
        });
        it('returns command name lowercased', () => {
            (0, chai_1.expect)((0, commands_1.parseCommand)('/Te&$St foo', 0 /* ChatType.Say */)).eql({ command: 'Te&$St', args: 'foo', type: 0 /* ChatType.Say */ });
        });
    });
    describe('getChatPrefix()', () => {
        it('returns empty string for regular chat', () => {
            (0, chai_1.expect)((0, commands_1.getChatPrefix)(0 /* ChatType.Say */)).equal('');
        });
        it('returns "/p " for party chat', () => {
            (0, chai_1.expect)((0, commands_1.getChatPrefix)(1 /* ChatType.Party */)).equal('/p ');
        });
        it('returns "/p " for party thinking', () => {
            (0, chai_1.expect)((0, commands_1.getChatPrefix)(3 /* ChatType.PartyThink */)).equal('/p ');
        });
        it('returns "" for thinking', () => {
            (0, chai_1.expect)((0, commands_1.getChatPrefix)(2 /* ChatType.Think */)).equal('');
        });
        it('returns "/ss " for supporter chat', () => {
            (0, chai_1.expect)((0, commands_1.getChatPrefix)(4 /* ChatType.Supporter */)).equal('/ss ');
        });
        it('returns "" for supporter 1 chat', () => {
            (0, chai_1.expect)((0, commands_1.getChatPrefix)(5 /* ChatType.Supporter1 */)).equal('');
        });
        it('returns "" for supporter 2 chat', () => {
            (0, chai_1.expect)((0, commands_1.getChatPrefix)(6 /* ChatType.Supporter2 */)).equal('');
        });
        it('returns "" for supporter 3 chat', () => {
            (0, chai_1.expect)((0, commands_1.getChatPrefix)(7 /* ChatType.Supporter3 */)).equal('');
        });
    });
    describe('runCommand()', () => {
        let client;
        let context;
        let command;
        let runCommand;
        let handler;
        beforeEach(() => {
            handler = (0, sinon_1.stub)();
            command = { names: ['test'], handler, help: '', role: '' };
            client = (0, mocks_1.mockClient)();
            context = {
                liveSettings: {},
                world: { sayTo() { } },
                notifications: {},
                party: {},
                random: () => 0,
            };
            runCommand = (0, commands_1.createRunCommand)(context, [command]);
        });
        it('runs given command', () => {
            runCommand(client, 'test', 'args', 0 /* ChatType.Say */, undefined, {});
            sinon_1.assert.calledWith(handler, context, client, 'args', 0 /* ChatType.Say */);
        });
        it('returns true if run command', () => {
            (0, chai_1.expect)(runCommand(client, 'test', '', 0 /* ChatType.Say */, undefined, {})).true;
        });
        it('returns true if command does not exist', () => {
            (0, chai_1.expect)(runCommand(client, 'foo', '', 0 /* ChatType.Say */, undefined, {})).false;
        });
        it('should not run command if client is missing required role', () => {
            command.role = 'admin';
            (0, chai_1.expect)(runCommand(client, 'test', '', 0 /* ChatType.Say */, undefined, {})).false;
        });
        it('should run command if client has required role', () => {
            client.account.roles = ['admin'];
            command.role = 'admin';
            (0, chai_1.expect)(runCommand(client, 'test', '', 0 /* ChatType.Say */, undefined, {})).true;
        });
        it('sends user error to user', () => {
            handler.throws(new userError_1.UserError('test error'));
            runCommand(client, 'test', '', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([
                [client.pony.id, 'test error', 1 /* MessageType.System */],
            ]);
        });
        it('rethrows non-user error', () => {
            (0, chai_1.expect)(() => {
                handler.throws(new Error('test error'));
                runCommand(client, 'test', '', 0 /* ChatType.Say */, undefined, {});
            }).throw('test error');
        });
        it('should find correct command case-insensitive', () => {
            (0, chai_1.expect)(runCommand(client, 'TeSt', '', 0 /* ChatType.Say */, undefined, {})).true;
        });
    });
    describe('individual commands', () => {
        let client;
        let context;
        let runCommand;
        let execAction;
        beforeEach(() => {
            execAction = (0, sinon_1.stub)(playerUtils, 'execAction');
            client = (0, mocks_1.mockClient)();
            client.map = (0, serverMap_1.createServerMap)('', 0, 3, 3);
            client.pony.region = client.map.regions[0];
            client.pony.region.clients.push(client);
            client.account.roles = ['mod', 'admin'];
            client.isMod = true;
            context = {
                liveSettings: {},
                world: {
                    featureFlags: { flying: true, swap: true, friends: true },
                    getSettings: () => ({}),
                    action() { },
                    unholdItem() { },
                    sayTo() { },
                    sayToOthers() { },
                    sayToEveryone() { },
                    setTime() { },
                    resetToSpawn() { },
                    kick() { },
                    fixPosition() { },
                },
                notifications: {},
                party: {},
                random: () => 0,
            };
            const commands = (0, commands_1.createCommands)(context.world);
            runCommand = (0, commands_1.createRunCommand)(context, commands);
        });
        afterEach(() => {
            execAction.restore();
        });
        describe('/help', () => {
            it('prints commands help', () => {
                runCommand(client, 'help', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue.length).equal(1);
                (0, chai_1.expect)(client.saysQueue[0][0]).equal(client.pony.id);
                (0, chai_1.expect)(client.saysQueue[0][2]).equal(1 /* MessageType.System */);
            });
        });
        describe('/roll', () => {
            it('rolls random number from 1 to 100 without args', () => {
                (0, sinon_1.stub)(context, 'random').withArgs(1, 100).returns(12);
                runCommand(client, 'roll', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, '🎲 rolled 12 of 100', 7 /* MessageType.Announcement */]]);
            });
            it('rolls random number from 1 to given number', () => {
                (0, sinon_1.stub)(context, 'random').withArgs(1, 50).returns(12);
                runCommand(client, 'roll', '50', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, '🎲 rolled 12 of 50', 7 /* MessageType.Announcement */]]);
            });
            it('rolls random number between given numbers', () => {
                (0, sinon_1.stub)(context, 'random').withArgs(50, 200).returns(123);
                runCommand(client, 'roll', '50-200', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, '🎲 rolled 123 of 50-200', 7 /* MessageType.Announcement */]]);
            });
            it('clamps minimum and maximum', () => {
                (0, sinon_1.stub)(context, 'random').withArgs(1000000, 1000000).returns(1000000);
                runCommand(client, 'roll', '999999999-999999999', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, '🎲 rolled 1000000 of 1000000-1000000', 7 /* MessageType.Announcement */]]);
            });
            it(`uses default behaviour if args don't match pattern`, () => {
                (0, sinon_1.stub)(context, 'random').withArgs(1, 100).returns(50);
                runCommand(client, 'roll', 'foo bar', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, '🎲 rolled 50 of 100', 7 /* MessageType.Announcement */]]);
            });
            it('rolls apple', () => {
                runCommand(client, 'roll', '🍎', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, '🎲 rolled 🍎 of 100', 7 /* MessageType.Announcement */]]);
            });
        });
        describe('/e', () => {
            it('updates permanent expression', () => {
                runCommand(client, 'e', '>:|', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.exprPermanent).eql((0, expressionUtils_1.parseExpression)('>:|'));
            });
            it('resets existing expression', () => {
                runCommand(client, 'e', '>:|', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)((0, expressionUtils_1.parseExpression)('>:|')));
            });
        });
        describe('/boop /)', () => {
            it('invokes action', () => {
                runCommand(client, 'boop', '', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.calledWith(execAction, client, 1 /* Action.Boop */);
            });
            it('sets expression', () => {
                runCommand(client, 'boop', '>:|', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)((0, expressionUtils_1.parseExpression)('>:|')));
            });
        });
        describe('/drop', () => {
            it('invokes action', () => {
                runCommand(client, 'drop', '', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.calledWith(execAction, client, 14 /* Action.Drop */);
            });
        });
        describe('/turn', () => {
            it('invokes action', () => {
                runCommand(client, 'turn', '', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.calledWith(execAction, client, 2 /* Action.TurnHead */);
            });
        });
        describe('/blush', () => {
            it('sets expression with blush', () => {
                runCommand(client, 'blush', '>:|', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.parseExpression)('>:|'),
                    extra: 1 /* ExpressionExtra.Blush */,
                }));
            });
            it('uses current expression if available', () => {
                client.pony.options = { expr: (0, expressionEncoder_1.encodeExpression)((0, expressionUtils_1.parseExpression)(':(')) };
                runCommand(client, 'blush', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.parseExpression)(':('),
                    extra: 1 /* ExpressionExtra.Blush */,
                }));
            });
            it('uses default expression if not provided', () => {
                runCommand(client, 'blush', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.expression)(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 2 /* Muzzle.Neutral */),
                    extra: 1 /* ExpressionExtra.Blush */,
                }));
            });
            it('passes cancellable flag', () => {
                client.pony.exprCancellable = true;
                runCommand(client, 'blush', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.expression)(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 2 /* Muzzle.Neutral */),
                    extra: 1 /* ExpressionExtra.Blush */,
                }));
            });
        });
        describe('/gifts', () => {
            it('announces collected gifts count', () => {
                client.account.state = { gifts: 5 };
                runCommand(client, 'gifts', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'collected 5 🎁', 7 /* MessageType.Announcement */]]);
            });
            it('announces 0 collected gifts if missing gifts entry', () => {
                runCommand(client, 'gifts', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'collected 0 🎁', 7 /* MessageType.Announcement */]]);
            });
        });
        describe('/candies', () => {
            it('announces collected candies count', () => {
                client.account.state = { candies: 5 };
                runCommand(client, 'candies', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'collected 5 🍬', 7 /* MessageType.Announcement */]]);
            });
            it('announces 0 collected candies if missing candies entry', () => {
                runCommand(client, 'candies', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'collected 0 🍬', 7 /* MessageType.Announcement */]]);
            });
        });
        describe('/clovers', () => {
            it('announces collected clovers count', () => {
                client.account.state = { clovers: 5 };
                runCommand(client, 'clovers', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'collected 5 🍀', 7 /* MessageType.Announcement */]]);
            });
            it('announces 0 collected clovers if missing clovers entry', () => {
                runCommand(client, 'clovers', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'collected 0 🍀', 7 /* MessageType.Announcement */]]);
            });
        });
        describe('/unstuck', () => {
            it('resets client to spawn', () => {
                const resetToSpawn = (0, sinon_1.stub)(context.world, 'resetToSpawn');
                runCommand(client, 'unstuck', '', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.calledWith(resetToSpawn, client);
            });
            it('kicks client', () => {
                const kick = (0, sinon_1.stub)(context.world, 'kick');
                runCommand(client, 'unstuck', '', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.calledWith(kick, client);
            });
        });
        describe('/sleep', () => {
            it('sets expression with sleeping', () => {
                runCommand(client, 'sleep', '>:|', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.parseExpression)('>:|'),
                    left: 6 /* Eye.Closed */,
                    right: 6 /* Eye.Closed */,
                    extra: 2 /* ExpressionExtra.Zzz */,
                }));
            });
            it('uses current expression if available', () => {
                client.pony.options = { expr: (0, expressionEncoder_1.encodeExpression)((0, expressionUtils_1.parseExpression)(':(')) };
                runCommand(client, 'sleep', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.parseExpression)(':('),
                    left: 6 /* Eye.Closed */,
                    right: 6 /* Eye.Closed */,
                    extra: 2 /* ExpressionExtra.Zzz */,
                }));
            });
            it('uses default expression if not provided', () => {
                runCommand(client, 'sleep', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.expression)(6 /* Eye.Closed */, 6 /* Eye.Closed */, 2 /* Muzzle.Neutral */),
                    extra: 2 /* ExpressionExtra.Zzz */,
                }));
            });
            it('closes mouth', () => {
                runCommand(client, 'sleep', ':D', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.expression)(6 /* Eye.Closed */, 6 /* Eye.Closed */, 2 /* Muzzle.Neutral */),
                    extra: 2 /* ExpressionExtra.Zzz */,
                }));
            });
            it('does nothing if moving', () => {
                client.pony.vx = 1;
                client.pony.options.expr = 123;
                runCommand(client, 'sleep', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal(123);
            });
        });
        describe('/cry', () => {
            it('sets expression with tears', () => {
                runCommand(client, 'cry', '>:|', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.parseExpression)('>:|'),
                    extra: 4 /* ExpressionExtra.Cry */,
                }));
            });
            it('uses default expression if not provided', () => {
                runCommand(client, 'cry', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)({
                    ...(0, expressionUtils_1.expression)(15 /* Eye.Sad */, 15 /* Eye.Sad */, 1 /* Muzzle.Frown */),
                    extra: 4 /* ExpressionExtra.Cry */,
                }));
            });
        });
        describe('/smile', () => {
            it('sets expression', () => {
                runCommand(client, 'smile', '', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)((0, expressionUtils_1.parseExpression)(':)')));
            });
        });
        describe('/yawn', () => {
            it('invokes action', () => {
                runCommand(client, 'yawn', '', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.calledWith(execAction, client, 3 /* Action.Yawn */);
            });
        });
        describe('/m', () => {
            it('send mod message', () => {
                runCommand(client, 'm', 'message', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'message', 3 /* MessageType.Mod */]]);
            });
        });
        describe('/a', () => {
            it('send admin message', () => {
                runCommand(client, 'a', 'message', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'message', 2 /* MessageType.Admin */]]);
            });
        });
        describe('/time', () => {
            it('sets world time', () => {
                const setTime = (0, sinon_1.stub)(context.world, 'setTime');
                runCommand(client, 'time', '12', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.calledWith(setTime, 12);
            });
            it('does modulo 24 on hour', () => {
                const setTime = (0, sinon_1.stub)(context.world, 'setTime');
                runCommand(client, 'time', '26', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.calledWith(setTime, 2);
            });
            it('prints error if args are invalid', () => {
                runCommand(client, 'time', 'foo', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([
                    [client.pony.id, 'invalid parameter', 1 /* MessageType.System */],
                ]);
            });
        });
        describe('/tp', () => {
            it('fixes location of player', () => {
                const fixPosition = (0, sinon_1.stub)(client, 'fixPosition');
                runCommand(client, 'tp', '10 20', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.calledWith(fixPosition, 10, 20, true);
                (0, chai_1.expect)(client.pony.x).equal(10);
                (0, chai_1.expect)(client.pony.y).equal(20);
            });
            it('updates safe position', () => {
                client.pony.x = 10;
                client.pony.y = 20;
                runCommand(client, 'tp', '10 20', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.safeX).equal(10);
                (0, chai_1.expect)(client.safeY).equal(20);
            });
            it('resets lastTime to zero', () => {
                runCommand(client, 'tp', '10 20', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.lastTime).equal(0);
            });
            it('throws on invalid parameters', () => {
                runCommand(client, 'tp', '10', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([
                    [client.pony.id, 'invalid parameters', 1 /* MessageType.System */],
                ]);
            });
        });
        const placeholderCommands = [
            's', 'say', 'p', 'party', 't', 'think', 'ss', 's1', 's2', 's3', 'sit', 'stand', 'lie', 'lay', 'fly',
            'w', 'whisper', 'r', 'reply',
        ];
        placeholderCommands.forEach(command => {
            describe(`/${command}`, () => {
                it('throws', () => {
                    (0, chai_1.expect)(() => runCommand(client, command, 'foo bar', 0 /* ChatType.Say */, undefined, {}))
                        .throw('Should not be called');
                });
            });
        });
    });
});
//# sourceMappingURL=commands.spec.js.map