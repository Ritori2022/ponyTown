"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const accountUtils_1 = require("../../common/accountUtils");
const mocks_1 = require("../mocks");
describe('accountUtils [client]', () => {
    describe('isAdmin()', () => {
        it('returns true if target account has admin role', () => {
            (0, chai_1.expect)((0, accountUtils_1.isAdmin)((0, mocks_1.account)({ roles: ['admin'] }))).true;
        });
        it('returns true if target account has superadmin role', () => {
            (0, chai_1.expect)((0, accountUtils_1.isAdmin)((0, mocks_1.account)({ roles: ['superadmin'] }))).true;
        });
        it('returns false if target account has no roles', () => {
            (0, chai_1.expect)((0, accountUtils_1.isAdmin)((0, mocks_1.account)({}))).false;
        });
        it('returns false if target account has no admin or superadmin roles', () => {
            (0, chai_1.expect)((0, accountUtils_1.isAdmin)((0, mocks_1.account)({ roles: ['foo'] }))).false;
        });
    });
    describe('isMod()', () => {
        it('returns true if target account has mod role', () => {
            (0, chai_1.expect)((0, accountUtils_1.isMod)((0, mocks_1.account)({ roles: ['mod'] }))).true;
        });
        it('returns true if target account has admin role', () => {
            (0, chai_1.expect)((0, accountUtils_1.isMod)((0, mocks_1.account)({ roles: ['admin'] }))).true;
        });
        it('returns true if target account has superadmin role', () => {
            (0, chai_1.expect)((0, accountUtils_1.isMod)((0, mocks_1.account)({ roles: ['superadmin'] }))).true;
        });
        it('returns false if target account has no roles', () => {
            (0, chai_1.expect)((0, accountUtils_1.isMod)((0, mocks_1.account)({}))).false;
        });
        it('returns false if target account has no admin or superadmin roles', () => {
            (0, chai_1.expect)((0, accountUtils_1.isMod)((0, mocks_1.account)({ roles: ['foo'] }))).false;
        });
    });
    describe('isDev()', () => {
        it('returns true if target account has dev role', () => {
            (0, chai_1.expect)((0, accountUtils_1.isDev)((0, mocks_1.account)({ roles: ['dev'] }))).true;
        });
        it('returns false if target account has no roles', () => {
            (0, chai_1.expect)((0, accountUtils_1.isDev)((0, mocks_1.account)({}))).false;
        });
        it('returns false if target account has no dev role', () => {
            (0, chai_1.expect)((0, accountUtils_1.isDev)((0, mocks_1.account)({ roles: ['foo'] }))).false;
        });
    });
    describe('meetsRequirement()', () => {
        it('returns true for undefined requirement', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({}, undefined)).true;
        });
        it('returns true for empty requirement', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({}, '')).true;
        });
        it('returns true if requirement matches role', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ roles: ['mod'] }, 'mod')).true;
        });
        it('returns true if matches supporter 1 requirement', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ supporter: 1 /* SupporterFlags.Supporter1 */ }, 'sup1')).true;
        });
        it('returns true if matches supporter 2 requirement', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ supporter: 2 /* SupporterFlags.Supporter2 */ }, 'sup2')).true;
        });
        it('returns true if matches supporter 3 requirement', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ supporter: 3 /* SupporterFlags.Supporter3 */ }, 'sup3')).true;
        });
        it('returns false if supporter is lower level', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ supporter: 1 /* SupporterFlags.Supporter1 */ }, 'sup2')).false;
        });
        it('returns true if requires supporter but is mod', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ roles: ['mod'] }, 'sup2')).true;
        });
        it('returns true if requires supporter but is dev', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ roles: ['dev'] }, 'sup2')).true;
        });
        it('returns false if supporter is undefined', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({}, 'sup2')).false;
        });
        it('returns false if requirement is not met', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({}, 'mod')).false;
        });
        it('returns false if sup2 requirement is not met', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ supporter: 0 }, 'sup2')).false;
        });
        it('returns false if inv requirement is not met', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({}, 'inv')).false;
        });
        it('returns true if inv requirement is met (supporter)', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ supporter: 1 /* SupporterFlags.Supporter1 */ }, 'inv')).true;
        });
        it('returns true if inv requirement is met (role)', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ roles: ['dev'] }, 'inv')).true;
        });
        it('returns true if inv requirement is met (invited)', () => {
            (0, chai_1.expect)((0, accountUtils_1.meetsRequirement)({ supporterInvited: true }, 'inv')).true;
        });
    });
    describe('getSupporterInviteLimit()', () => {
        it('returns 100 for mod', () => {
            (0, chai_1.expect)((0, accountUtils_1.getSupporterInviteLimit)({ roles: ['mod'] })).equal(100);
        });
        it('returns 100 for dev', () => {
            (0, chai_1.expect)((0, accountUtils_1.getSupporterInviteLimit)({ roles: ['dev'] })).equal(100);
        });
        it('returns 1 for supporter level 1', () => {
            (0, chai_1.expect)((0, accountUtils_1.getSupporterInviteLimit)({ supporter: 1 })).equal(1);
        });
        it('returns 5 for supporter level 2', () => {
            (0, chai_1.expect)((0, accountUtils_1.getSupporterInviteLimit)({ supporter: 2 })).equal(5);
        });
        it('returns 10 for supporter level 3', () => {
            (0, chai_1.expect)((0, accountUtils_1.getSupporterInviteLimit)({ supporter: 3 })).equal(10);
        });
        it('returns 0 otherwise', () => {
            (0, chai_1.expect)((0, accountUtils_1.getSupporterInviteLimit)({})).equal(0);
        });
    });
});
//# sourceMappingURL=accountUtils.spec.js.map