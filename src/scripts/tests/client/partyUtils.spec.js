"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const partyUtils_1 = require("../../client/partyUtils");
describe('partyUtils', () => {
    describe('updateParty()', () => {
        it('creates new party', () => {
            const info = [
                { id: 1, pony: { _foo: 'bar' }, self: false, leader: false, pending: false, offline: false },
                { id: 2, pony: { _foo: 'boo' }, self: false, leader: true, pending: false, offline: false },
            ];
            const party = (0, partyUtils_1.updateParty)(undefined, info);
            (0, chai_1.expect)(party).eql({
                leaderId: 2,
                members: info,
            });
        });
        it('adds new members', () => {
            const party = {
                leaderId: 1,
                members: [
                    { id: 1, pony: { _foo: 'bar' }, self: false, leader: false, pending: false, offline: false },
                ],
            };
            const info = [
                { id: 1, pony: { _foo: 'bar' }, self: false, leader: false, pending: false, offline: false },
                { id: 2, pony: { _foo: 'boo' }, self: false, leader: true, pending: false, offline: false },
            ];
            (0, partyUtils_1.updateParty)(party, info);
            (0, chai_1.expect)(party).eql({
                leaderId: 2,
                members: info,
            });
        });
        it('removes members', () => {
            const party = {
                leaderId: 1,
                members: [
                    { id: 1, pony: { _foo: 'bar' }, self: false, leader: false, pending: false, offline: false },
                    { id: 2, pony: { _foo: 'boo' }, self: false, leader: true, pending: false, offline: false },
                ],
            };
            const info = [
                { id: 1, pony: { _foo: 'bar' }, self: false, leader: true, pending: false, offline: false },
            ];
            (0, partyUtils_1.updateParty)(party, info);
            (0, chai_1.expect)(party).eql({
                leaderId: 1,
                members: info,
            });
        });
        it('updates members', () => {
            const party = {
                leaderId: 1,
                members: [
                    { id: 1, pony: { _foo: 'bar' }, self: false, leader: false, pending: true, offline: true },
                    { id: 2, pony: { _foo: 'boo' }, self: false, leader: true, pending: false, offline: false },
                ],
            };
            const info = [
                { id: 1, pony: { _foo: 'bar' }, self: false, leader: true, pending: false, offline: false },
                { id: 2, pony: { _foo: 'boo' }, self: true, leader: false, pending: false, offline: false },
            ];
            (0, partyUtils_1.updateParty)(party, info);
            (0, chai_1.expect)(party).eql({
                leaderId: 1,
                members: info,
            });
        });
        it('does nothing for undefined/empty party and info', () => {
            (0, chai_1.expect)((0, partyUtils_1.updateParty)(undefined, undefined)).undefined;
            (0, chai_1.expect)((0, partyUtils_1.updateParty)(undefined, [])).undefined;
        });
    });
    describe('isPonyInParty()', () => {
        it('returns false for undefined party', () => {
            (0, chai_1.expect)((0, partyUtils_1.isPonyInParty)(undefined, {}, false)).false;
        });
        it('returns true if pony is in party', () => {
            const pony = { _foo: 'bar' };
            const party = {
                leaderId: 1,
                members: [
                    { id: 1, pony: pony, self: false, leader: false, pending: false, offline: true },
                ],
            };
            (0, chai_1.expect)((0, partyUtils_1.isPonyInParty)(party, pony, false)).true;
        });
        it('returns false if pony is in party but pending', () => {
            const pony = { _foo: 'bar' };
            const party = {
                leaderId: 1,
                members: [
                    { id: 1, pony: pony, self: false, leader: false, pending: true, offline: true },
                ],
            };
            (0, chai_1.expect)((0, partyUtils_1.isPonyInParty)(party, pony, false)).false;
        });
        it('returns true if pony is in party and pending, but pending flag is true', () => {
            const pony = { _foo: 'bar' };
            const party = {
                leaderId: 1,
                members: [
                    { id: 1, pony: pony, self: false, leader: false, pending: true, offline: true },
                ],
            };
            (0, chai_1.expect)((0, partyUtils_1.isPonyInParty)(party, pony, true)).true;
        });
        it('returns false if pony is not in party', () => {
            const pony = { _foo: 'bar' };
            const party = {
                leaderId: 1,
                members: [
                    { id: 1, pony: { _foo: 'boo' }, self: false, leader: false, pending: false, offline: true },
                ],
            };
            (0, chai_1.expect)((0, partyUtils_1.isPonyInParty)(party, pony, false)).false;
        });
    });
    describe('isPartyLeader()', () => {
        let game;
        beforeEach(() => {
            game = {};
        });
        it('returns true if player is party leader', () => {
            game.player = { id: 123 };
            game.party = { leaderId: 123, members: [] };
            (0, chai_1.expect)((0, partyUtils_1.isPartyLeader)(game)).true;
        });
        it('returns false if player is not party leader', () => {
            game.player = { id: 123 };
            game.party = { leaderId: 321, members: [] };
            (0, chai_1.expect)((0, partyUtils_1.isPartyLeader)(game)).false;
        });
        it('returns false if player is not initialized', () => {
            (0, chai_1.expect)((0, partyUtils_1.isPartyLeader)(game)).false;
        });
    });
    describe('isInParty()', () => {
        let game;
        beforeEach(() => {
            game = {};
        });
        it('returns true if player is in party', () => {
            game.party = { leaderId: 0, members: [{ id: 123 }] };
            (0, chai_1.expect)((0, partyUtils_1.isInParty)(game)).true;
        });
        it('returns false if player is not in a party', () => {
            (0, chai_1.expect)((0, partyUtils_1.isInParty)(game)).false;
        });
        it('returns false if party is empty', () => {
            game.party = { leaderId: 0, members: [] };
            (0, chai_1.expect)((0, partyUtils_1.isInParty)(game)).false;
        });
    });
});
//# sourceMappingURL=partyUtils.spec.js.map