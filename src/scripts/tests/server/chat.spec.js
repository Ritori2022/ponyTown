"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../lib");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const world_1 = require("../../server/world");
const serverMap_1 = require("../../server/serverMap");
const mocks_1 = require("../mocks");
const expressionUtils_1 = require("../../common/expressionUtils");
const chat_1 = require("../../server/chat");
const expressionEncoder_1 = require("../../common/encoders/expressionEncoder");
const positionUtils_1 = require("../../common/positionUtils");
const serverRegion_1 = require("../../server/serverRegion");
const playerUtils = tslib_1.__importStar(require("../../server/playerUtils"));
describe('chat', () => {
    describe('say()', () => {
        let client;
        let region;
        let world;
        let runCommand;
        let log;
        let say;
        let checkSpam;
        let reportSwears;
        let reportForbidden;
        let reportSuspicious;
        let isSuspiciousMessage;
        let execAction;
        beforeEach(() => {
            execAction = (0, sinon_1.stub)(playerUtils, 'execAction');
            region = (0, serverRegion_1.createServerRegion)(1, 1);
            client = (0, mocks_1.mockClient)();
            client.pony.region = region;
            region.clients.push(client);
            world = (0, mocks_1.mock)(world_1.World);
            const map = (0, serverMap_1.createServerMap)('', 0, 1, 1);
            (0, sinon_1.stub)(world, 'getMainMap').returns(map);
            runCommand = (0, sinon_1.stub)();
            log = (0, sinon_1.stub)();
            checkSpam = (0, sinon_1.stub)();
            reportSwears = (0, sinon_1.stub)();
            reportForbidden = (0, sinon_1.stub)();
            reportSuspicious = (0, sinon_1.stub)();
            isSuspiciousMessage = (0, sinon_1.stub)();
            const spamCommands = ['roll'];
            say = (0, chat_1.createSay)(world, runCommand, log, checkSpam, reportSwears, reportForbidden, reportSuspicious, spamCommands, () => 0, isSuspiciousMessage);
        });
        afterEach(() => {
            execAction.restore();
        });
        it('does nothing if whispering to self', () => {
            say(client, 'hey me', 9 /* ChatType.Whisper */, client, {});
            sinon_1.assert.notCalled(log);
        });
        it('sends back error message if whispering to missing client', () => {
            say(client, 'hey no one', 9 /* ChatType.Whisper */, undefined, {});
            sinon_1.assert.calledOnce(log);
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, `Couldn't find this player`, 1 /* MessageType.System */]]);
        });
        it('runs commands for whispers', () => {
            runCommand.returns(true);
            const target = (0, mocks_1.mockClient)();
            say(client, '/gifts', 9 /* ChatType.Whisper */, target, {});
            sinon_1.assert.calledOnce(log);
            sinon_1.assert.calledWith(runCommand, client, 'gifts', '', 9 /* ChatType.Whisper */, target, {});
        });
        it('sends back error message if whispering to non-friend when having non-friend whispers disabled', () => {
            client.accountSettings.ignoreNonFriendWhispers = true;
            say(client, 'hey you', 9 /* ChatType.Whisper */, (0, mocks_1.mockClient)(), {});
            sinon_1.assert.calledOnce(log);
            (0, chai_1.expect)(client.saysQueue).eql([
                [client.pony.id, 'You can only whisper to friends', 1 /* MessageType.System */],
            ]);
        });
        it('sends whisper to target', () => {
            const target = (0, mocks_1.mockClient)();
            say(client, 'hey you', 9 /* ChatType.Whisper */, target, {});
            sinon_1.assert.calledOnce(log);
            (0, chai_1.expect)(target.saysQueue).eql([[client.pony.id, 'hey you', 13 /* MessageType.Whisper */]]);
        });
        it('does not send whisper to target if shadowed', () => {
            const target = (0, mocks_1.mockClient)();
            client.shadowed = true;
            say(client, 'hey you', 9 /* ChatType.Whisper */, target, {});
            sinon_1.assert.calledOnce(log);
            (0, chai_1.expect)(client.saysQueue).eql([[target.pony.id, 'hey you', 14 /* MessageType.WhisperTo */]]);
            (0, chai_1.expect)(target.saysQueue).eql([]);
        });
        it('does not send whisper to target if muted', () => {
            const target = (0, mocks_1.mockClient)();
            client.account.mute = Date.now() + 10000;
            say(client, 'hey you', 9 /* ChatType.Whisper */, target, {});
            sinon_1.assert.calledOnce(log);
            (0, chai_1.expect)(client.saysQueue).eql([[target.pony.id, 'hey you', 14 /* MessageType.WhisperTo */]]);
            (0, chai_1.expect)(target.saysQueue).eql([]);
        });
        it('does not send whisper to target if target is shadowed', () => {
            const target = (0, mocks_1.mockClient)();
            target.shadowed = true;
            say(client, 'hey you', 9 /* ChatType.Whisper */, target, {});
            sinon_1.assert.calledOnce(log);
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, `Couldn't find this player`, 1 /* MessageType.System */]]);
            (0, chai_1.expect)(target.saysQueue).eql([]);
        });
        it('does not send whisper to target if target is hidden', () => {
            const target = (0, mocks_1.mockClient)();
            target.hides.add(client.accountId);
            say(client, 'hey you', 9 /* ChatType.Whisper */, target, {});
            sinon_1.assert.calledOnce(log);
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, `Couldn't find this player`, 1 /* MessageType.System */]]);
            (0, chai_1.expect)(target.saysQueue).eql([]);
        });
        it('does not check for spam if whispering to friend', () => {
            const target = (0, mocks_1.mockClient)();
            client.friends.add(target.accountId);
            say(client, 'hey you', 9 /* ChatType.Whisper */, target, {});
            sinon_1.assert.notCalled(checkSpam);
        });
        it('logs chat message', () => {
            say(client, 'hey there', 0 /* ChatType.Say */, undefined, {});
            sinon_1.assert.calledWith(log, client, 'hey there', 0 /* ChatType.Say */, false);
        });
        it('logs party chat message', () => {
            say(client, 'hey there', 1 /* ChatType.Party */, undefined, {});
            sinon_1.assert.calledWith(log, client, 'hey there', 1 /* ChatType.Party */, false);
        });
        it('trims text', () => {
            say(client, ' test ', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 0 /* MessageType.Chat */]]);
        });
        it('sends say to everyone in the world', () => {
            say(client, 'test', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 0 /* MessageType.Chat */]]);
        });
        it('sends say for say command in party chat', () => {
            say(client, '/s test', 1 /* ChatType.Party */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 0 /* MessageType.Chat */]]);
        });
        it('sends say for invalid type', () => {
            say(client, 'test', 100, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 0 /* MessageType.Chat */]]);
        });
        it('sends think message to everyone', () => {
            say(client, 'test', 2 /* ChatType.Think */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 5 /* MessageType.Thinking */]]);
        });
        it('sends think message to everyone', () => {
            say(client, '/t test', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 5 /* MessageType.Thinking */]]);
        });
        it('ignores empty say command', () => {
            say(client, '/s ', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([]);
        });
        it(`reports suspicious message`, () => {
            isSuspiciousMessage.withArgs('foo bar').returns(true);
            say(client, 'foo bar', 0 /* ChatType.Say */, undefined, {});
            sinon_1.assert.calledWith(reportSuspicious, client, 'foo bar');
        });
        it(`reports suspicious party message with prefix`, () => {
            isSuspiciousMessage.withArgs('foo bar').returns(true);
            say(client, 'foo bar', 1 /* ChatType.Party */, undefined, {});
            sinon_1.assert.calledWith(reportSuspicious, client, '/p foo bar');
        });
        describe('in a party', () => {
            beforeEach(() => {
                client.party = { id: '', leader: client, clients: [client], pending: [] };
            });
            it('sends party message for party type', () => {
                say(client, 'test', 1 /* ChatType.Party */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 4 /* MessageType.Party */]]);
            });
            it('sends party message for party command', () => {
                say(client, '/p test', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 4 /* MessageType.Party */]]);
            });
            it('ignores empty party command', () => {
                say(client, '/p ', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([]);
            });
            it('sends party think message to party if in party chat', () => {
                say(client, '/t test', 1 /* ChatType.Party */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 6 /* MessageType.PartyThinking */]]);
            });
        });
        it('does not set expression in party think command', () => {
            client.pony.options.expr = 123;
            say(client, '/t :)', 1 /* ChatType.Party */, undefined, {});
            (0, chai_1.expect)(client.pony.options.expr).equal(123);
        });
        it('runs command if text is command', () => {
            runCommand.returns(true);
            say(client, '/test arg', 0 /* ChatType.Say */, undefined, {});
            sinon_1.assert.calledWith(runCommand, client, 'test', 'arg');
        });
        it('notifies of invalid command', () => {
            runCommand.returns(false);
            say(client, '/test arg', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'Invalid command', 1 /* MessageType.System */]]);
        });
        it('sets expression', () => {
            say(client, 'hi :)', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)((0, expressionUtils_1.parseExpression)(':)')));
        });
        it('sets invisible expression', () => {
            runCommand.returns(false);
            say(client, '/:)', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)((0, expressionUtils_1.parseExpression)(':)')));
            (0, chai_1.expect)(client.saysQueue).eql([]);
        });
        it('sets invisible expression (with space)', () => {
            runCommand.returns(false);
            say(client, '/ :)', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.pony.options.expr).equal((0, expressionEncoder_1.encodeExpression)((0, expressionUtils_1.parseExpression)(':)')));
            (0, chai_1.expect)(client.saysQueue).eql([]);
        });
        it('does not set expression in think command', () => {
            client.pony.options.expr = 123;
            say(client, '/t :)', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.pony.options.expr).equal(123);
        });
        it('calls laugh action', () => {
            say(client, 'haha', 0 /* ChatType.Say */, undefined, {});
            sinon_1.assert.calledWith(execAction, client, 4 /* Action.Laugh */);
        });
        it('checks for spam', () => {
            const settings = {};
            say(client, 'test', 0 /* ChatType.Say */, undefined, settings);
            sinon_1.assert.calledWith(checkSpam, client, 'test', settings);
        });
        it('does not check for spam in party chat', () => {
            say(client, 'test', 1 /* ChatType.Party */, undefined, {});
            sinon_1.assert.notCalled(checkSpam);
        });
        it('does not trim repeated letters in party chat', () => {
            client.party = { id: '', leader: client, clients: [client], pending: [] };
            say(client, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 1 /* ChatType.Party */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([
                [client.pony.id, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 4 /* MessageType.Party */],
            ]);
        });
        it('trims repeated letters', () => {
            say(client, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'AAAAAAAAAAAAAAAA…', 0 /* MessageType.Chat */]]);
        });
        it('trims repeated emoji', () => {
            say(client, '🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸', 0 /* ChatType.Say */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, '🌸🌸🌸🌸🌸🌸🌸🌸…', 0 /* MessageType.Chat */]]);
        });
        describe('supporter', () => {
            it('sends supporter message', () => {
                client.supporterLevel = 1;
                say(client, 'hello', 4 /* ChatType.Supporter */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hello', 9 /* MessageType.Supporter1 */]]);
            });
            it('sends supporter message of correct level (2)', () => {
                client.supporterLevel = 2;
                say(client, 'hello', 4 /* ChatType.Supporter */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hello', 10 /* MessageType.Supporter2 */]]);
            });
            it('sends supporter message of correct level (3)', () => {
                client.supporterLevel = 3;
                say(client, 'hello', 4 /* ChatType.Supporter */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hello', 11 /* MessageType.Supporter3 */]]);
            });
            it('sends supporter message as regular message for non-supporters', () => {
                say(client, 'hello', 4 /* ChatType.Supporter */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hello', 0 /* MessageType.Chat */]]);
            });
            it('sends supporter 1 message', () => {
                client.supporterLevel = 3;
                say(client, 'hello', 5 /* ChatType.Supporter1 */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hello', 9 /* MessageType.Supporter1 */]]);
            });
            it('sends supporter 2 message', () => {
                client.supporterLevel = 3;
                say(client, 'hello', 6 /* ChatType.Supporter2 */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hello', 10 /* MessageType.Supporter2 */]]);
            });
            it('sends supporter 3 message', () => {
                client.supporterLevel = 3;
                say(client, 'hello', 7 /* ChatType.Supporter3 */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hello', 11 /* MessageType.Supporter3 */]]);
            });
            it('sends chat message if supporter level is lower than message level', () => {
                client.supporterLevel = 2;
                say(client, 'hello', 7 /* ChatType.Supporter3 */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hello', 0 /* MessageType.Chat */]]);
            });
            it('sends chat message if non-supporter sends supporter messsage', () => {
                say(client, 'hello', 4 /* ChatType.Supporter */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hello', 0 /* MessageType.Chat */]]);
            });
        });
        describe('urls', () => {
            it('removes url in regular chat', () => {
                say(client, 'hey www.google.com', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'hey [LINK]', 0 /* MessageType.Chat */]]);
            });
            it('removes url in censored messages', () => {
                say(client, 'fuck www.google.com', 0 /* ChatType.Say */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'fuck [LINK]', 0 /* MessageType.Chat */]]);
            });
            it('does not remove url in party chat', () => {
                client.party = { id: '', leader: client, clients: [client], pending: [] };
                say(client, 'hey www.google.com', 1 /* ChatType.Party */, undefined, {});
                (0, chai_1.expect)(client.saysQueue).eql([
                    [client.pony.id, 'hey www.google.com', 4 /* MessageType.Party */],
                ]);
            });
            it('does not report url as swearing', () => {
                say(client, 'hey www.google.com', 0 /* ChatType.Say */, undefined, { filterSwears: true });
                sinon_1.assert.notCalled(reportSwears);
            });
        });
        describe('commands', () => {
            it('checks for spam', () => {
                runCommand.returns(true);
                const settings = {};
                say(client, '/roll', 0 /* ChatType.Say */, undefined, settings);
                sinon_1.assert.calledWith(checkSpam, client, '/roll', settings);
            });
            it('does not check for spam in party chat', () => {
                runCommand.returns(true);
                say(client, '/test', 1 /* ChatType.Party */, undefined, {});
                sinon_1.assert.notCalled(checkSpam);
            });
            it('does not check for spam for /:)', () => {
                runCommand.returns(false);
                say(client, '/:)', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.notCalled(checkSpam);
            });
            it('does not check for spam for /e', () => {
                runCommand.returns(true);
                say(client, '/e :)', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.notCalled(checkSpam);
            });
        });
        describe('swear message', () => {
            it('does not report normal message', () => {
                say(client, 'test', 0 /* ChatType.Say */, undefined, {});
                sinon_1.assert.notCalled(reportSwears);
            });
            it('does not report is filterSwears is false', () => {
                say(client, 'fuck', 0 /* ChatType.Say */, undefined, { filterSwears: false });
                sinon_1.assert.notCalled(reportSwears);
            });
            it('reports', () => {
                const settings = { filterSwears: true };
                say(client, 'fuck', 0 /* ChatType.Say */, undefined, settings);
                sinon_1.assert.calledWith(reportSwears, client, 'fuck', settings);
            });
        });
        describe('kicking', () => {
            let kick;
            beforeEach(() => {
                kick = (0, sinon_1.stub)(world, 'kick');
            });
            it('kicks player if messages contain swears and kickSwearing settings is true', () => {
                say(client, 'fuck', 0 /* ChatType.Say */, undefined, { kickSwearing: true });
                sinon_1.assert.calledWith(kick, client, 'swearing', 1 /* LeaveReason.Swearing */);
            });
            it('does not kick player if messages contain swears and kickSwearing setting is true but is party message', () => {
                say(client, 'fuck', 1 /* ChatType.Party */, undefined, { kickSwearing: true });
                sinon_1.assert.notCalled(kick);
            });
            it('does not reset player to spawn if kickSwearingToSpawn setting is false', () => {
                const resetToSpawn = (0, sinon_1.stub)(world, 'resetToSpawn');
                say(client, 'fuck', 0 /* ChatType.Say */, undefined, { kickSwearing: true, kickSwearingToSpawn: false });
                sinon_1.assert.notCalled(resetToSpawn);
            });
            it('resets player to spawn if kickSwearingToSpawn setting is true', () => {
                const resetToSpawn = (0, sinon_1.stub)(world, 'resetToSpawn');
                say(client, 'fuck', 0 /* ChatType.Say */, undefined, { kickSwearing: true, kickSwearingToSpawn: true });
                sinon_1.assert.calledWith(resetToSpawn, client);
            });
        });
    });
    describe('filterUrls()', () => {
        [
            '',
            'test',
            'hello there.',
            '12.3254',
            '999.999.999.999',
            'www...',
            'Pare...Com Isto...',
            'Solo tengo 1.000.000.000.000',
            // 'Is a smol .com',
            'battle.net',
            'paint.net',
            'fimfiction.net',
            'fanfiction.net',
            'Serio,com licença',
            'Sim,net caiu',
        ].forEach(message => it(`returns the same message: "${message}"`, () => {
            (0, chai_1.expect)((0, chat_1.filterUrls)(message)).equal(message);
        }));
        [
            ['1.1.1.1', '[LINK]'],
            ['192.168.0.255', '[LINK]'],
            ['hello 192.168.0.255 aaa', 'hello [LINK] aaa'],
            ['hello192.168.0.255aaa', 'hello[LINK]aaa'],
            ['192.168.0.255 aaa 192.168.0.255', '[LINK] aaa [LINK]'],
            ['ip:147.230.64.174', 'ip:[LINK]']
        ].forEach(([message, expected]) => it(`replaces ip addresses: "${message}"`, () => {
            (0, chai_1.expect)((0, chat_1.filterUrls)(message)).equal(expected);
        }));
        [
            ['http://google.com/', '[LINK]'],
            ['HTTP://GOOGLE.COM/', '[LINK]'],
            ['https://foo', '[LINK]'],
            ['https//last_name_is_.net', '[LINK]'],
            ['www.test.pl', '[LINK]'],
            ['foo,com/bar', '[LINK]'],
            ['a123,net/bar/123', '[LINK]'],
            ['foo.com', '[LINK]'],
            ['foo.c0m', '[LINK]'],
            ['foo.net', '[LINK]'],
            ['foo.net/abc/xyz', '[LINK]/abc/xyz'],
            ['WWW.test.pl', '[LINK]'],
            ['foo.COM', '[LINK]'],
            ['hello http://google.com/', 'hello [LINK]'],
            ['hello foo.com aaa', 'hello [LINK] aaa'],
            ['hellohttp://google.com/', 'hello[LINK]'],
            ['http://google.com/ aaa http://google.com/', '[LINK] aaa [LINK]'],
            ['foo.com foo.com', '[LINK] [LINK]'],
            ['goo.gl/Cjy2Qj', '[LINK]'],
            ['goo,gl/Cjy2Qj', '[LINK]'],
            ['bit.ly/1mHSR3x', '[LINK]'],
            ['adf.ly/13ajex', '[LINK]'],
            ['dhttps://www.twitch.tv/foobar', 'd[LINK]'],
            ['bestgore. com', '[LINK]'],
            [
                'https:/ mlpfanart.fandom .com/wiki/Banned_From_Equestria_(Daily)',
                'https:/ [LINK]/wiki/Banned_From_Equestria_(Daily)'
            ],
        ].forEach(([message, expected]) => it(`replaces urls addresses: "${message}"`, () => {
            (0, chai_1.expect)((0, chat_1.filterUrls)(message)).equal(expected);
        }));
    });
    describe('sayToClient()', () => {
        let client;
        let settings;
        beforeEach(() => {
            client = (0, mocks_1.mockClient)();
            client.camera.w = (0, positionUtils_1.toScreenX)(10);
            client.camera.h = (0, positionUtils_1.toScreenY)(10);
            settings = {};
        });
        it('sends message to client', () => {
            (0, chat_1.sayToClientTest)(client, (0, mocks_1.serverEntity)(5), 'foo', 'foo', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([
                [5, 'foo', 0 /* MessageType.Chat */],
            ]);
        });
        it('sends original message if filterSwearWords is false', () => {
            client.accountSettings = { filterSwearWords: false };
            (0, chat_1.sayToClientTest)(client, (0, mocks_1.serverEntity)(5), 'foo', 'bar', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([
                [5, 'foo', 0 /* MessageType.Chat */],
            ]);
        });
        it('sends censored message if filterSwearWords is true', () => {
            client.accountSettings = { filterSwearWords: true };
            (0, chat_1.sayToClientTest)(client, (0, mocks_1.serverEntity)(5), 'foo', 'bar', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([
                [5, 'bar', 0 /* MessageType.Chat */],
            ]);
        });
        it('sends censored message if filterSwears is true', () => {
            settings.filterSwears = true;
            (0, chat_1.sayToClientTest)(client, (0, mocks_1.serverEntity)(5), 'foo', '***', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([
                [5, '***', 0 /* MessageType.Chat */],
            ]);
        });
        it('sends original message to self', () => {
            client.pony.id = 5;
            (0, chat_1.sayToClientTest)(client, client.pony, 'foo', 'foo', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([
                [5, 'foo', 0 /* MessageType.Chat */],
            ]);
        });
        it('sends original message to self if filterSwearWords is true', () => {
            client.pony.id = 5;
            client.account.settings = { filterSwearWords: true };
            (0, chat_1.sayToClientTest)(client, client.pony, 'foo', 'bar', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([
                [5, 'foo', 0 /* MessageType.Chat */],
            ]);
        });
        it('sends original message to self if filterSwears is true', () => {
            settings.filterSwears = true;
            client.pony.id = 5;
            (0, chat_1.sayToClientTest)(client, client.pony, 'foo', 'bar', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([
                [5, 'foo', 0 /* MessageType.Chat */],
            ]);
        });
        it('sends cyrillic message to self if filterCyrillic setting is true', () => {
            client.accountSettings = { filterCyrillic: true };
            client.pony.id = 5;
            (0, chat_1.sayToClientTest)(client, client.pony, 'Здравствуй', 'Здравствуй', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([
                [5, 'Здравствуй', 0 /* MessageType.Chat */],
            ]);
        });
        it('ignores messages if ignored', () => {
            const e = (0, mocks_1.serverEntity)(5);
            e.client = (0, mocks_1.mockClient)();
            e.client.ignores.add(client.accountId);
            (0, chai_1.expect)((0, chat_1.sayToClientTest)(client, e, 'test', 'test', 0 /* MessageType.Chat */, settings)).false;
            (0, chai_1.expect)(client.saysQueue).eql([]);
        });
        it('ignores messages if hidden', () => {
            const e = (0, mocks_1.serverEntity)(5);
            e.client = (0, mocks_1.mockClient)();
            client.hides.add(e.client.accountId);
            (0, chai_1.expect)((0, chat_1.sayToClientTest)(client, e, 'test', 'test', 0 /* MessageType.Chat */, settings)).false;
            (0, chai_1.expect)(client.saysQueue).eql([]);
        });
        it('ignores messages if swearing in whisper to non-friend', () => {
            const e = (0, mocks_1.serverEntity)(5);
            e.client = (0, mocks_1.mockClient)();
            settings.hideSwearing = true;
            (0, chai_1.expect)((0, chat_1.sayToClientTest)(client, e, 'test', '****', 13 /* MessageType.Whisper */, settings)).false;
            (0, chai_1.expect)(client.saysQueue).eql([]);
        });
        it('ignores messages if outside client camera', () => {
            const e = (0, mocks_1.serverEntity)(5, 10, 10);
            client.camera.x = (0, positionUtils_1.toScreenX)(20);
            client.camera.y = (0, positionUtils_1.toScreenY)(20);
            client.camera.w = (0, positionUtils_1.toScreenX)(10);
            client.camera.h = (0, positionUtils_1.toScreenY)(10);
            client.pony.x = 25;
            client.pony.y = 25;
            (0, chat_1.sayToClientTest)(client, e, 'test', 'test', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([]);
        });
        it('ignores messages if contain swears and hideSwearing setting is true', () => {
            settings.hideSwearing = true;
            (0, chat_1.sayToClientTest)(client, (0, mocks_1.serverEntity)(5), 'fuck', '****', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([]);
        });
        it('does not ignore messages if contain swears and hideSwearing setting is true but sending to self', () => {
            settings.hideSwearing = true;
            (0, chat_1.sayToClientTest)(client, client.pony, 'fuck', '****', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'fuck', 0 /* MessageType.Chat */]]);
        });
        it('does not ignore messages if contain swears and hideSwearing setting is true but is party message', () => {
            settings.hideSwearing = true;
            (0, chat_1.sayToClientTest)(client, (0, mocks_1.serverEntity)(6), 'fuck', '****', 4 /* MessageType.Party */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([[6, 'fuck', 4 /* MessageType.Party */]]);
        });
        it('sends party messages even if outside client camera', () => {
            const e = (0, mocks_1.serverEntity)(5, 1, 1);
            client.camera.x = (0, positionUtils_1.toScreenX)(20);
            client.camera.y = (0, positionUtils_1.toScreenY)(20);
            client.camera.w = (0, positionUtils_1.toScreenX)(10);
            client.camera.h = (0, positionUtils_1.toScreenY)(10);
            client.pony.x = 25;
            client.pony.y = 25;
            (0, chat_1.sayToClientTest)(client, e, 'test', 'test', 4 /* MessageType.Party */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([[5, 'test', 4 /* MessageType.Party */]]);
        });
        it('sends messages if hidden but client is moderator', () => {
            const e = (0, mocks_1.serverEntity)(5);
            e.client = (0, mocks_1.mockClient)();
            client.isMod = true;
            client.hides.add(e.client.accountId);
            (0, chat_1.sayToClientTest)(client, e, 'test', 'test', 0 /* MessageType.Chat */, settings);
            (0, chai_1.expect)(client.saysQueue).eql([[5, 'test', 0 /* MessageType.Chat */]]);
        });
    });
    describe('sayTo()', () => {
        it('adds message to message queue', () => {
            const client = (0, mocks_1.mockClient)();
            (0, chat_1.sayTo)(client, (0, mocks_1.entity)(123), 'test', 0 /* MessageType.Chat */);
            (0, chai_1.expect)(client.saysQueue).eql([[123, 'test', 0 /* MessageType.Chat */]]);
        });
    });
    describe('sayToParty()', () => {
        it('sends message to all party members', () => {
            const client = (0, mocks_1.mockClient)();
            const client2 = (0, mocks_1.mockClient)();
            client.party = { clients: [client, client2] };
            (0, chat_1.sayToPartyTest)(client, 'test', 4 /* MessageType.Party */);
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 4 /* MessageType.Party */]]);
            (0, chai_1.expect)(client2.saysQueue).eql([[client.pony.id, 'test', 4 /* MessageType.Party */]]);
        });
        it('sends message only to client if muted or shadowed', () => {
            const client = (0, mocks_1.mockClient)();
            const client2 = (0, mocks_1.mockClient)();
            client.shadowed = true;
            client.party = { clients: [client, client2] };
            (0, chat_1.sayToPartyTest)(client, 'test', 4 /* MessageType.Party */);
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 4 /* MessageType.Party */]]);
            (0, chai_1.expect)(client2.saysQueue).eql([]);
        });
        it('sends error message to client if not in party', () => {
            const client = (0, mocks_1.mockClient)();
            (0, chat_1.sayToPartyTest)(client, 'test', 4 /* MessageType.Party */);
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, `you're not in a party`, 1 /* MessageType.System */]]);
        });
    });
    describe('sayWhisper()', () => {
        it('sends whisper to client and target', () => {
            const client = (0, mocks_1.mockClient)();
            const target = (0, mocks_1.mockClient)();
            (0, chat_1.sayWhisperTest)(client, 'hey there', 'hey there', 13 /* MessageType.Whisper */, target, {});
            (0, chai_1.expect)(client.saysQueue).eql([[target.pony.id, 'hey there', 14 /* MessageType.WhisperTo */]]);
            (0, chai_1.expect)(target.saysQueue).eql([[client.pony.id, 'hey there', 13 /* MessageType.Whisper */]]);
        });
        it('sends announcement whisper to client and target', () => {
            const client = (0, mocks_1.mockClient)();
            const target = (0, mocks_1.mockClient)();
            (0, chat_1.sayWhisperTest)(client, 'hey there', 'hey there', 15 /* MessageType.WhisperAnnouncement */, target, {});
            (0, chai_1.expect)(client.saysQueue).eql([[target.pony.id, 'hey there', 16 /* MessageType.WhisperToAnnouncement */]]);
            (0, chai_1.expect)(target.saysQueue).eql([[client.pony.id, 'hey there', 15 /* MessageType.WhisperAnnouncement */]]);
        });
        it('sends error message to client if target is undefined', () => {
            const client = (0, mocks_1.mockClient)();
            (0, chat_1.sayWhisperTest)(client, 'hey there', 'hey there', 13 /* MessageType.Whisper */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, `Couldn't find this player`, 1 /* MessageType.System */]]);
        });
        it('sends error message to client if target is ignoring whispers', () => {
            const client = (0, mocks_1.mockClient)();
            const target = (0, mocks_1.mockClient)();
            target.accountSettings.ignoreNonFriendWhispers = true;
            (0, chat_1.sayWhisperTest)(client, 'hey there', 'hey there', 13 /* MessageType.Whisper */, target, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, `Can't whisper to this player`, 1 /* MessageType.System */]]);
            (0, chai_1.expect)(target.saysQueue).eql([]);
        });
        it('sends whisper to client and target if target is ignoring whispers but is friend of client', () => {
            const client = (0, mocks_1.mockClient)();
            const target = (0, mocks_1.mockClient)();
            target.accountSettings.ignoreNonFriendWhispers = true;
            client.friends.add(target.accountId);
            (0, chat_1.sayWhisperTest)(client, 'hey there', 'hey there', 13 /* MessageType.Whisper */, target, {});
            (0, chai_1.expect)(client.saysQueue).eql([[target.pony.id, 'hey there', 14 /* MessageType.WhisperTo */]]);
            (0, chai_1.expect)(target.saysQueue).eql([[client.pony.id, 'hey there', 13 /* MessageType.Whisper */]]);
        });
    });
    describe('sayToEveryone()', () => {
        it('sends message to all clients', () => {
            const client = (0, mocks_1.mockClient)();
            const client2 = (0, mocks_1.mockClient)();
            const entity = client.pony;
            entity.region = (0, serverRegion_1.createServerRegion)(0, 0);
            entity.region.clients.push(client, client2);
            (0, chat_1.sayToEveryone)(client, 'test', 'test2', 0 /* MessageType.Chat */, {});
            (0, chai_1.expect)(client.saysQueue).eql([[entity.id, 'test', 0 /* MessageType.Chat */]]);
            (0, chai_1.expect)(client2.saysQueue).eql([[entity.id, 'test', 0 /* MessageType.Chat */]]);
        });
        it('sends message only to client if muted or shadowed', () => {
            const client = (0, mocks_1.mockClient)();
            const client2 = (0, mocks_1.mockClient)();
            client.shadowed = true;
            const entity = client.pony;
            entity.region = (0, serverRegion_1.createServerRegion)(0, 0);
            entity.region.clients.push(client, client2);
            (0, chat_1.sayToEveryone)(client, 'test', 'test', 0 /* MessageType.Chat */, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 0 /* MessageType.Chat */]]);
            (0, chai_1.expect)(client2.saysQueue).eql([]);
        });
        it('does nothing if message is empty', () => {
            const client = (0, mocks_1.mockClient)();
            (0, chat_1.sayToEveryone)(client, '', '', 0 /* MessageType.Chat */, {});
            (0, chai_1.expect)(client.saysQueue).eql([]);
        });
    });
    describe('sayToOthers()', () => {
        it('sends message to party if party message', () => {
            const client = (0, mocks_1.mockClient)();
            client.party = { id: '', leader: client, clients: [client], pending: [] };
            (0, chat_1.sayToOthers)(client, 'test', 4 /* MessageType.Party */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 4 /* MessageType.Party */]]);
        });
        it('sends message to everyone if not party message', () => {
            const client = (0, mocks_1.mockClient)();
            client.pony.region = (0, serverRegion_1.createServerRegion)(0, 0);
            client.pony.region.clients.push(client);
            (0, chat_1.sayToOthers)(client, 'test', 0 /* MessageType.Chat */, undefined, {});
            (0, chai_1.expect)(client.saysQueue).eql([[client.pony.id, 'test', 0 /* MessageType.Chat */]]);
        });
    });
});
//# sourceMappingURL=chat.spec.js.map