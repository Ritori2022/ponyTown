"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const colors_1 = require("../../common/colors");
describe('colors', () => {
    describe('fillToOutline()', () => {
        it('returns undefined for undefined', () => {
            (0, chai_1.expect)((0, colors_1.fillToOutline)(undefined)).undefined;
        });
        it('returns outline color', () => {
            (0, chai_1.expect)((0, colors_1.fillToOutline)('ff0000')).equals('b30000');
        });
    });
    describe('fillToOutlineColor()', () => {
        it('returns outline color', () => {
            (0, chai_1.expect)((0, colors_1.fillToOutlineColor)(0xff0000ff)).equals(0xb30000ff);
        });
    });
    describe('getMessageColor()', () => {
        it('returns correct color for each message type', () => {
            (0, chai_1.expect)((0, colors_1.getMessageColor)(1 /* MessageType.System */)).equals(colors_1.SYSTEM_COLOR);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(2 /* MessageType.Admin */)).equals(colors_1.ADMIN_COLOR);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(3 /* MessageType.Mod */)).equals(colors_1.MOD_COLOR);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(7 /* MessageType.Announcement */)).equals(colors_1.ANNOUNCEMENT_COLOR);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(4 /* MessageType.Party */)).equals(colors_1.PARTY_COLOR);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(5 /* MessageType.Thinking */)).equals(colors_1.THINKING_COLOR);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(6 /* MessageType.PartyThinking */)).equals(colors_1.PARTY_THINKING_COLOR);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(9 /* MessageType.Supporter1 */)).equals(colors_1.SUPPORTER1_COLOR);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(10 /* MessageType.Supporter2 */)).equals(colors_1.SUPPORTER2_COLOR);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(11 /* MessageType.Supporter3 */)).equals(colors_1.SUPPORTER3_COLOR);
        });
        it('returns white color for other types', () => {
            (0, chai_1.expect)((0, colors_1.getMessageColor)(0 /* MessageType.Chat */)).equals(colors_1.WHITE);
            (0, chai_1.expect)((0, colors_1.getMessageColor)(999)).equals(colors_1.WHITE);
        });
    });
});
//# sourceMappingURL=colors.spec.js.map