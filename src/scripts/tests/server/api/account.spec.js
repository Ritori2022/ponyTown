"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("../../lib");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const account_1 = require("../../../server/api/account");
const mocks_1 = require("../../mocks");
const db = tslib_1.__importStar(require("../../../server/db"));
describe('api account', () => {
    describe('getAccountData()', () => {
        let findCharacters;
        let findAuths;
        let getAccountData;
        let findFriends;
        beforeEach(() => {
            findCharacters = (0, sinon_1.stub)();
            findAuths = (0, sinon_1.stub)();
            findFriends = (0, sinon_1.stub)(db, 'findFriends').resolves([]);
            getAccountData = (0, account_1.createGetAccountData)(findCharacters, findAuths);
        });
        afterEach(() => {
            findFriends.restore();
        });
        it('returns account data', async () => {
            findCharacters.resolves([]);
            findAuths.resolves([]);
            const _id = (0, mocks_1.genObjectId)();
            const result = await getAccountData((0, mocks_1.account)({ _id, name: 'foo', birthdate: new Date(123), characterCount: 5 }));
            (0, chai_1.expect)(result).eql({
                id: _id.toString(),
                name: 'foo',
                birthdate: '1970-01-01',
                birthyear: undefined,
                characterCount: 5,
                ponies: [],
                settings: {},
                sites: [],
                alert: undefined,
                supporter: undefined,
                flags: 0,
                roles: undefined,
            });
        });
        it('adds mod check if account is mod', async () => {
            findCharacters.resolves([]);
            findAuths.resolves([]);
            const result = await getAccountData((0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)(), roles: ['mod'] }));
            (0, chai_1.expect)(result.check).eql(account_1.modCheck);
        });
    });
    describe('getAccountCharacters()', () => {
        let findCharacters;
        let getAccountCharacters;
        beforeEach(() => {
            findCharacters = (0, sinon_1.stub)();
            getAccountCharacters = (0, account_1.createGetAccountCharacters)(findCharacters);
        });
        it('returns empty array', async () => {
            findCharacters.resolves([]);
            const result = await getAccountCharacters((0, mocks_1.account)({}));
            (0, chai_1.expect)(result).eql([]);
        });
        it('returns chracters array', async () => {
            const accountId = (0, mocks_1.genObjectId)();
            const characterId = (0, mocks_1.genObjectId)();
            findCharacters.withArgs(accountId).resolves([
                {
                    _id: characterId,
                    name: 'foo',
                    info: 'info',
                    lastUsed: new Date(123),
                },
            ]);
            const result = await getAccountCharacters((0, mocks_1.account)({ _id: accountId }));
            (0, chai_1.expect)(result).eql([
                {
                    id: characterId.toString(),
                    name: 'foo',
                    desc: '',
                    info: 'info',
                    lastUsed: '1970-01-01T00:00:00.123Z',
                    site: undefined,
                    tag: undefined,
                    hideSupport: undefined,
                    respawnAtSpawn: undefined,
                },
            ]);
        });
    });
    describe('updateAccount()', () => {
        let findAccount;
        let updateAccount;
        let updateOne;
        let log;
        beforeEach(() => {
            findAccount = (0, sinon_1.stub)();
            log = (0, sinon_1.stub)();
            updateOne = (0, sinon_1.stub)(db.Account, 'updateOne').returns({ exec: (0, sinon_1.stub)().resolves() });
            updateAccount = (0, account_1.createUpdateAccount)(findAccount, log);
        });
        afterEach(() => {
            updateOne.restore();
        });
        it('resolves to account data', async () => {
            const account = {
                _id: (0, mocks_1.genObjectId)(),
                name: 'name',
                birthdate: new Date(123),
                birthyear: 123,
                roles: ['role'],
                settings: { foo: 'bar' },
                characterCount: 5,
                save: (0, sinon_1.stub)(),
            };
            findAccount.withArgs(account._id).resolves(account);
            const result = await updateAccount(account, {});
            (0, chai_1.expect)(result).eql({
                id: account._id.toString(),
                name: 'name',
                birthdate: '1970-01-01',
                birthyear: 123,
                roles: ['role'],
                settings: { foo: 'bar' },
                supporter: undefined,
                characterCount: 5,
                flags: 0,
            });
        });
        it('saves account', async () => {
            const acc = (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() });
            findAccount.resolves(acc);
            await updateAccount(acc, {});
            sinon_1.assert.calledWith(updateOne, { _id: acc._id }, {});
        });
        it('updates account name', async () => {
            const acc = (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() });
            findAccount.resolves(acc);
            await updateAccount(acc, { name: 'foo', birthdate: '' });
            (0, chai_1.expect)(acc.name).equal('foo');
        });
        it('logs account rename', async () => {
            const acc = (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)(), name: 'bar' });
            findAccount.resolves(acc);
            await updateAccount(acc, { name: 'foo', birthdate: '' });
            sinon_1.assert.calledWith(log, acc._id, 'Renamed "bar" => "foo"');
        });
        it('cleans account name before updating', async () => {
            const acc = (0, mocks_1.account)({ _id: (0, mocks_1.genObjectId)() });
            findAccount.resolves(acc);
            await updateAccount(acc, { name: 'f\t\r\noo', birthdate: '' });
            (0, chai_1.expect)(acc.name).equal('foo');
        });
        const invalidNameValues = [
            '',
            // 'a',
            'string_that_is_exceeding_character_limit_for_account_names_aaaaaaaaaaaaaaaaaaaaaaaaa',
            { foo: 'bar' },
            123,
            null,
        ];
        invalidNameValues.forEach(name => it(`does not update account name if it is invalid (${name})`, async () => {
            const account = { _id: (0, mocks_1.genObjectId)(), name: 'name', save: (0, sinon_1.stub)() };
            findAccount.resolves(account);
            await updateAccount(account, { name, birthdate: '' });
            (0, chai_1.expect)(account.name).equal('name');
        }));
        it('updates account birthdate', async () => {
            const account = { _id: (0, mocks_1.genObjectId)(), save: (0, sinon_1.stub)() };
            findAccount.resolves(account);
            await updateAccount(account, { name: 'foo', birthdate: '2000-02-03' });
            (0, chai_1.expect)(account.birthdate.getTime()).equal(new Date('2000-02-03').getTime());
        });
        it('does not update birthday if it has invalid value', async () => {
            const account = { _id: (0, mocks_1.genObjectId)(), save: (0, sinon_1.stub)(), birthdate: new Date(321) };
            findAccount.resolves(account);
            await updateAccount(account, { name: 'foo', birthdate: '0123-00-01' });
            (0, chai_1.expect)(account.birthdate.getTime()).equal(new Date(321).getTime());
        });
        it('logs birthday change', async () => {
            const account = { _id: (0, mocks_1.genObjectId)(), name: 'bar', save: (0, sinon_1.stub)(), birthdate: new Date(12345) };
            findAccount.resolves(account);
            await updateAccount(account, { name: 'bar', birthdate: '2000-02-03' });
            sinon_1.assert.calledWith(log, account._id, 'Changed birthdate 1970-01-01 (49yo) => 2000-02-03 (19yo)');
        });
    });
    describe('updateSettings()', () => {
        let findAccount;
        let updateOne;
        let updateSettings;
        beforeEach(() => {
            findAccount = (0, sinon_1.stub)();
            updateOne = (0, sinon_1.stub)(db.Account, 'updateOne').returns({ exec: (0, sinon_1.stub)().resolves() });
            updateSettings = (0, account_1.createUpdateSettings)(findAccount);
        });
        afterEach(() => {
            updateOne.restore();
        });
        it('returns account data', async () => {
            const _id = (0, mocks_1.genObjectId)();
            findAccount.resolves({
                _id,
                name: 'foo',
                birthdate: new Date(123),
                birthyear: 123,
                roles: ['mod'],
                settings: { foo: 'bar' },
                characterCount: 4,
                flags: 1,
                supporter: 1,
                save() { },
            });
            const result = await updateSettings((0, mocks_1.account)({}), {});
            (0, chai_1.expect)(result).eql({
                id: _id.toString(),
                name: 'foo',
                birthdate: '1970-01-01',
                birthyear: 123,
                roles: ['mod'],
                settings: { foo: 'bar' },
                characterCount: 4,
                flags: 0,
                supporter: 1,
            });
        });
        it('updates account settings', async () => {
            const save = (0, sinon_1.stub)();
            const acc = { _id: (0, mocks_1.genObjectId)(), save, settings: undefined };
            findAccount.resolves(acc);
            await updateSettings((0, mocks_1.account)({ _id: acc._id }), {
                filterSwearWords: true,
                filterCyrillic: true,
                ignorePartyInvites: true,
            });
            (0, chai_1.expect)(acc.settings).eql({
                filterSwearWords: true,
                filterCyrillic: true,
                ignorePartyInvites: true,
            });
            sinon_1.assert.calledWith(updateOne, { _id: acc._id }, {
                settings: {
                    filterSwearWords: true,
                    filterCyrillic: true,
                    ignorePartyInvites: true,
                }
            });
        });
        it('merges account settings', async () => {
            const save = (0, sinon_1.stub)();
            const acc = {
                _id: (0, mocks_1.genObjectId)(),
                save,
                settings: {
                    filterSwearWords: true,
                    filterCyrillic: true,
                    ignorePartyInvites: true,
                },
            };
            findAccount.resolves(acc);
            await updateSettings((0, mocks_1.account)({ _id: acc._id }), {
                filterSwearWords: false,
                filterCyrillic: true,
                ignorePartyInvites: true,
            });
            (0, chai_1.expect)(acc.settings).eql({
                filterSwearWords: false,
                filterCyrillic: true,
                ignorePartyInvites: true,
            });
            sinon_1.assert.calledWith(updateOne, { _id: acc._id }, {
                settings: {
                    filterSwearWords: false,
                    filterCyrillic: true,
                    ignorePartyInvites: true,
                }
            });
        });
        it('ignores missing fields', async () => {
            const acc = { _id: (0, mocks_1.genObjectId)(), settings: undefined };
            findAccount.resolves(acc);
            await updateSettings((0, mocks_1.account)({ _id: acc._id }), {});
            (0, chai_1.expect)(acc.settings).eql({});
            sinon_1.assert.calledWith(updateOne, { _id: acc._id }, { settings: {} });
        });
        it('ignores missing settings', async () => {
            const acc = { _id: (0, mocks_1.genObjectId)(), settings: undefined };
            findAccount.resolves(acc);
            await updateSettings((0, mocks_1.account)({ _id: acc._id }), undefined);
            (0, chai_1.expect)(acc.settings).eql({});
            sinon_1.assert.calledWith(updateOne, { _id: acc._id }, { settings: {} });
        });
    });
    describe('removeSite()', () => {
        let findAuth;
        let countAuths;
        let log;
        let removeSite;
        let updateOne;
        beforeEach(() => {
            findAuth = (0, sinon_1.stub)();
            countAuths = (0, sinon_1.stub)();
            log = (0, sinon_1.stub)();
            updateOne = (0, sinon_1.stub)(db.Auth, 'updateOne').returns({ exec: () => (0, sinon_1.stub)().resolves() });
            removeSite = (0, account_1.createRemoveSite)(findAuth, countAuths, log);
        });
        afterEach(() => {
            updateOne.restore();
        });
        it('returns empty object', async () => {
            findAuth.resolves({});
            countAuths.resolves(2);
            const result = await removeSite((0, mocks_1.account)({}), 'SITE_ID');
            (0, chai_1.expect)(result).eql({});
        });
        it('disables auth', async () => {
            const authId = (0, mocks_1.genObjectId)();
            const accountId = (0, mocks_1.genObjectId)();
            const auth = { _id: authId, disabled: false };
            const acc = (0, mocks_1.account)({ _id: accountId });
            findAuth.withArgs('SITE_ID', accountId).resolves(auth);
            countAuths.withArgs(accountId).resolves(2);
            await removeSite(acc, 'SITE_ID');
            sinon_1.assert.calledWithMatch(updateOne, { _id: authId }, { disabled: true });
        });
        it('throws if siteId is not string', async () => {
            findAuth.resolves((0, mocks_1.account)({}));
            countAuths.resolves(2);
            await (0, chai_1.expect)(removeSite((0, mocks_1.account)({}), {}))
                .rejectedWith('Social account not found');
        });
        it('throws if auth does not exist', async () => {
            findAuth.resolves(undefined);
            countAuths.resolves(2);
            await (0, chai_1.expect)(removeSite((0, mocks_1.account)({}), 'SITE_ID'))
                .rejectedWith('Social account not found');
        });
        it('throws if auth is disabled', async () => {
            findAuth.resolves({ disabled: true });
            countAuths.resolves(2);
            await (0, chai_1.expect)(removeSite((0, mocks_1.account)({}), 'SITE_ID'))
                .rejectedWith('Social account not found');
        });
        it('throws if user has only one auth', async () => {
            findAuth.resolves({});
            countAuths.resolves(1);
            await (0, chai_1.expect)(removeSite((0, mocks_1.account)({}), 'SITE_ID'))
                .rejectedWith('Cannot remove your only one social account');
        });
        it('logs auth removal', async () => {
            const accountId = (0, mocks_1.genObjectId)();
            const authId = (0, mocks_1.genObjectId)();
            findAuth.resolves({ _id: authId, name: 'foo' });
            countAuths.resolves(2);
            await removeSite((0, mocks_1.account)({ _id: accountId }), 'SITE_ID');
            sinon_1.assert.calledWith(log, accountId, `removed auth: foo [${authId}]`);
        });
    });
});
//# sourceMappingURL=account.spec.js.map