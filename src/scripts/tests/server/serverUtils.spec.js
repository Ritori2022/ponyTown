"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const sinon_1 = require("sinon");
const chai_1 = require("chai");
const mongoose_1 = require("mongoose");
const serverUtils_1 = require("../../server/serverUtils");
const mocks_1 = require("../mocks");
describe('serverUtils', () => {
    describe('tokenService()', () => {
        let service;
        let socket;
        beforeEach(() => {
            socket = {
                clearTokens: (0, sinon_1.stub)(),
                token: (0, sinon_1.stub)(),
            };
            service = (0, serverUtils_1.tokenService)(socket);
        });
        it('clears tokens for account', () => {
            service.clearTokensForAccount('foo');
            const filter = socket.clearTokens.args[0][0];
            (0, chai_1.expect)(filter('', { accountId: 'foo' })).true;
            (0, chai_1.expect)(filter('', { accountId: 'bar' })).false;
            sinon_1.assert.calledOnce(socket.clearTokens);
        });
        it('clears all tokens', () => {
            service.clearTokensAll();
            const filter = socket.clearTokens.args[0][0];
            (0, chai_1.expect)(filter('', {})).true;
            sinon_1.assert.calledOnce(socket.clearTokens);
        });
        it('creates token', () => {
            const token = { account: {}, character: {} };
            service.createToken(token);
            sinon_1.assert.calledWith(socket.token, token);
        });
    });
    describe('toPonyObject()', () => {
        it('returns pony object', () => {
            const id = (0, mocks_1.genId)();
            (0, chai_1.expect)((0, serverUtils_1.toPonyObject)((0, mocks_1.character)({
                _id: mongoose_1.Types.ObjectId(id),
                name: 'foo',
                desc: 'aaa',
                info: 'info',
                site: mongoose_1.Types.ObjectId('000000000000000000000002'),
                tag: 'tag',
                lastUsed: new Date(123),
            }))).eql({
                id: id,
                name: 'foo',
                desc: 'aaa',
                info: 'info',
                site: '000000000000000000000002',
                tag: 'tag',
                lastUsed: '1970-01-01T00:00:00.123Z',
                hideSupport: undefined,
                respawnAtSpawn: undefined,
            });
        });
        it('handles empty fields', () => {
            const id = (0, mocks_1.genId)();
            (0, chai_1.expect)((0, serverUtils_1.toPonyObject)((0, mocks_1.character)({
                _id: mongoose_1.Types.ObjectId(id),
                name: 'foo',
            }))).eql({
                id: id,
                name: 'foo',
                desc: '',
                info: '',
                site: undefined,
                tag: undefined,
                lastUsed: undefined,
                hideSupport: undefined,
                respawnAtSpawn: undefined,
            });
        });
        it('sets hide support field', () => {
            const output = (0, serverUtils_1.toPonyObject)((0, mocks_1.character)({
                _id: mongoose_1.Types.ObjectId((0, mocks_1.genId)()),
                name: 'foo',
                flags: 4 /* CharacterFlags.HideSupport */,
            }));
            (0, chai_1.expect)(output.hideSupport).true;
        });
        it('sets respawn at spawn field', () => {
            const output = (0, serverUtils_1.toPonyObject)((0, mocks_1.character)({
                _id: mongoose_1.Types.ObjectId((0, mocks_1.genId)()),
                name: 'foo',
                flags: 8 /* CharacterFlags.RespawnAtSpawn */,
            }));
            (0, chai_1.expect)(output.respawnAtSpawn).true;
        });
        it('returns null for undefined character', () => {
            (0, chai_1.expect)((0, serverUtils_1.toPonyObject)(undefined)).null;
        });
    });
    describe('toPonyObjectAdmin()', () => {
        it('returns pony object', () => {
            const id = (0, mocks_1.genId)();
            (0, chai_1.expect)((0, serverUtils_1.toPonyObjectAdmin)((0, mocks_1.character)({
                _id: mongoose_1.Types.ObjectId(id),
                name: 'foo',
                desc: 'aaa',
                info: 'info',
                site: mongoose_1.Types.ObjectId('000000000000000000000001'),
                tag: 'tag',
                lastUsed: new Date(123),
                creator: 'foo bar',
            }))).eql({
                id: id,
                name: 'foo',
                desc: 'aaa',
                info: 'info',
                site: '000000000000000000000001',
                tag: 'tag',
                lastUsed: '1970-01-01T00:00:00.123Z',
                hideSupport: undefined,
                respawnAtSpawn: undefined,
                creator: 'foo bar',
            });
        });
        it('returns null for undefined character', () => {
            (0, chai_1.expect)((0, serverUtils_1.toPonyObjectAdmin)(undefined)).null;
        });
    });
    describe('toSocialSite()', () => {
        it('returns site object', () => {
            const id = (0, mocks_1.genId)();
            (0, chai_1.expect)((0, serverUtils_1.toSocialSite)((0, mocks_1.auth)({
                _id: mongoose_1.Types.ObjectId(id),
                name: 'foo',
                provider: 'github',
                url: 'foo.com',
            }))).eql({
                id: id,
                name: 'foo',
                provider: 'github',
                url: 'foo.com',
            });
        });
    });
});
//# sourceMappingURL=serverUtils.spec.js.map