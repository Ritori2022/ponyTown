"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const constants_1 = require("../../common/constants");
const utils_1 = require("../../common/utils");
const accountUtils_1 = require("../../server/accountUtils");
const mocks_1 = require("../mocks");
const logger_1 = require("../../server/logger");
describe('accountUtils [server]', () => {
    describe('getModInfo()', () => {
        it('returns account info', () => {
            const accountId = (0, mocks_1.genObjectId)();
            const client = (0, mocks_1.mockClient)({
                accountId: accountId.toString(),
                account: (0, mocks_1.account)({
                    _id: accountId,
                    name: 'foo',
                    shadow: -1,
                    mute: (0, utils_1.fromNow)(1.1 * constants_1.DAY).getTime(),
                    note: 'foo',
                    counters: { spam: 1 },
                }),
                country: 'XY',
            });
            (0, chai_1.expect)((0, accountUtils_1.getModInfo)(client)).eql({
                shadow: 'perma',
                mute: 'a day',
                note: 'foo',
                counters: { spam: 1 },
                country: 'XY',
                account: `foo [${accountId.toString().substr(-3)}]`,
            });
        });
        it('returns undefined for past timeouts', () => {
            const client = (0, mocks_1.mockClient)({
                account: (0, mocks_1.account)({
                    _id: (0, mocks_1.genObjectId)(),
                    shadow: 1000,
                    mute: 2000,
                }),
            });
            const result = (0, accountUtils_1.getModInfo)(client);
            (0, chai_1.expect)(result.mute).undefined;
            (0, chai_1.expect)(result.shadow).undefined;
        });
    });
    describe('checkIfAdmin()', () => {
        let warn;
        beforeEach(() => {
            warn = (0, sinon_1.stub)(logger_1.logger, 'warn');
        });
        afterEach(() => {
            warn.restore();
        });
        it('does nothing if not admin', () => {
            (0, accountUtils_1.checkIfNotAdmin)({}, '');
        });
        it('throws if admin', () => {
            (0, chai_1.expect)(() => (0, accountUtils_1.checkIfNotAdmin)({ roles: ['admin'] }, 'test'))
                .throw('Cannot perform this action on admin user');
            sinon_1.assert.calledWith(warn, 'Cannot perform this action on admin user (test)');
        });
    });
    describe('isNew()', () => {
        it('returns true if createdAt date is not set', () => {
            (0, chai_1.expect)((0, accountUtils_1.isNew)((0, mocks_1.account)({}))).true;
        });
        it('returns true if created less than a day ago', () => {
            (0, chai_1.expect)((0, accountUtils_1.isNew)((0, mocks_1.account)({ createdAt: (0, utils_1.fromNow)(-constants_1.DAY + 1000) }))).true;
        });
        it('returns false if created more than a day ago', () => {
            (0, chai_1.expect)((0, accountUtils_1.isNew)((0, mocks_1.account)({ createdAt: (0, utils_1.fromNow)(-2 * constants_1.DAY) }))).false;
        });
    });
});
//# sourceMappingURL=accountUtils.spec.js.map