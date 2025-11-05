"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const ponyStates_1 = require("../../client/ponyStates");
const pony_1 = require("../../common/pony");
describe('ponyStates', () => {
    describe('flagsToState()', () => {
        it('returns trotting if moving', () => {
            (0, chai_1.expect)((0, pony_1.flagsToState)(0 /* EntityState.PonyStanding */, true, false)).equal(ponyStates_1.trotting);
        });
        it('returns flying if moving and flying', () => {
            (0, chai_1.expect)((0, pony_1.flagsToState)(80 /* EntityState.PonyFlying */, true, false)).equal(ponyStates_1.flying);
        });
        it('returns standing for standing state', () => {
            (0, chai_1.expect)((0, pony_1.flagsToState)(0 /* EntityState.PonyStanding */, false, false)).equal(ponyStates_1.standing);
        });
        it('returns trotting for walking state', () => {
            (0, chai_1.expect)((0, pony_1.flagsToState)(16 /* EntityState.PonyWalking */, false, false)).equal(ponyStates_1.trotting);
        });
        it('returns trotting for trotting state', () => {
            (0, chai_1.expect)((0, pony_1.flagsToState)(32 /* EntityState.PonyTrotting */, false, false)).equal(ponyStates_1.trotting);
        });
        it('returns sitting for sitting state', () => {
            (0, chai_1.expect)((0, pony_1.flagsToState)(48 /* EntityState.PonySitting */, false, false)).equal(ponyStates_1.sitting);
        });
        it('returns lying for lying state', () => {
            (0, chai_1.expect)((0, pony_1.flagsToState)(64 /* EntityState.PonyLying */, false, false)).equal(ponyStates_1.lying);
        });
        it('returns hovering for flying state', () => {
            (0, chai_1.expect)((0, pony_1.flagsToState)(80 /* EntityState.PonyFlying */, false, false)).equal(ponyStates_1.hovering);
        });
        it('throws on invalid state', () => {
            (0, chai_1.expect)(() => (0, pony_1.flagsToState)(112, false, false)).throw('Invalid pony state (112)');
        });
    });
    describe('isFlyingUp()', () => {
        it('returns true if flying up', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingUp)(ponyStates_1.flyingUp)).true;
        });
        it('returns true if transitioning from trotting to flying', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingUp)(ponyStates_1.trottingToFlying)).true;
        });
        it('returns false for any other state', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingUp)(ponyStates_1.standing)).false;
        });
    });
    describe('isFlyingDown()', () => {
        it('returns true if flying down', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingDown)(ponyStates_1.flyingDown)).true;
        });
        it('returns true if transitioning from flying to trotting', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingDown)(ponyStates_1.flyingToTrotting)).true;
        });
        it('returns false for any other state', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingDown)(ponyStates_1.standing)).false;
        });
    });
    describe('isFlyingUpOrDown()', () => {
        it('returns true if flying up', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingUpOrDown)(ponyStates_1.flyingUp)).true;
        });
        it('returns true if transitioning from trotting to flying', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingUpOrDown)(ponyStates_1.trottingToFlying)).true;
        });
        it('returns true if flying down', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingUpOrDown)(ponyStates_1.flyingDown)).true;
        });
        it('returns true if transitioning from flying to trotting', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingUpOrDown)(ponyStates_1.flyingToTrotting)).true;
        });
        it('returns false for any other state', () => {
            (0, chai_1.expect)((0, ponyStates_1.isFlyingUpOrDown)(ponyStates_1.standing)).false;
        });
    });
    describe('toBoopState()', () => {
        it('returns booping for standing state', () => {
            (0, chai_1.expect)((0, ponyStates_1.toBoopState)(ponyStates_1.standing)).equal(ponyStates_1.booping);
        });
        it('returns boopingSitting for sitting state', () => {
            (0, chai_1.expect)((0, ponyStates_1.toBoopState)(ponyStates_1.sitting)).equal(ponyStates_1.boopingSitting);
        });
        it('returns boopingLying for lying state', () => {
            (0, chai_1.expect)((0, ponyStates_1.toBoopState)(ponyStates_1.lying)).equal(ponyStates_1.boopingLying);
        });
        it('returns boopingFlying for hovering state', () => {
            (0, chai_1.expect)((0, ponyStates_1.toBoopState)(ponyStates_1.hovering)).equal(ponyStates_1.boopingFlying);
        });
        it('returns undefined for all other states', () => {
            (0, chai_1.expect)((0, ponyStates_1.toBoopState)(ponyStates_1.sittingDown)).undefined;
        });
    });
});
//# sourceMappingURL=ponyStates.spec.js.map