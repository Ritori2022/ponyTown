"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const ponyHelpers_1 = require("../../client/ponyHelpers");
describe('interfaces', () => {
    describe('isStateEqual()', () => {
        it('returns true if two states are equal', () => {
            (0, chai_1.expect)((0, ponyHelpers_1.isStateEqual)((0, ponyHelpers_1.defaultPonyState)(), (0, ponyHelpers_1.defaultPonyState)())).true;
        });
        it('returns true if two states are not equal', () => {
            (0, chai_1.expect)((0, ponyHelpers_1.isStateEqual)({ ...(0, ponyHelpers_1.defaultPonyState)(), blinkFrame: 5 }, (0, ponyHelpers_1.defaultPonyState)())).false;
        });
    });
});
//# sourceMappingURL=ponyHelpers.spec.js.map