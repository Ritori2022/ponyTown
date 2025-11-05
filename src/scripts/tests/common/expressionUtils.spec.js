"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const expressionUtils_1 = require("../../common/expressionUtils");
const expressions_1 = require("../../common/expressions");
const expressionEncoder_1 = require("../../common/encoders/expressionEncoder");
const ponyUtils_1 = require("../../client/ponyUtils");
function toExpression([right, left, muzzle, rightIris = 0, leftIris = 0, extra = 0]) {
    return { left, right, muzzle, rightIris, leftIris, extra };
}
describe('expressionUtils', () => {
    describe('parseExpression()', () => {
        expressions_1.expressions.forEach(([input, expected]) => {
            it(JSON.stringify(input), () => {
                if (expected) {
                    (0, chai_1.expect)((0, expressionUtils_1.parseExpression)(input)).eql(toExpression(expected));
                }
                else {
                    (0, chai_1.expect)((0, expressionUtils_1.parseExpression)(input)).undefined;
                }
            });
        });
        it('should return the same expression each time', () => {
            const expected = {
                right: 13 /* Eye.ClosedHappy2 */,
                left: 13 /* Eye.ClosedHappy2 */,
                muzzle: 0 /* Muzzle.Smile */,
                rightIris: 0 /* Iris.Forward */,
                leftIris: 0 /* Iris.Forward */,
                extra: 0 /* ExpressionExtra.None */,
            };
            const expr = (0, expressionUtils_1.parseExpression)('^^');
            (0, chai_1.expect)(expr).eql(expected, '1st');
            expr.extra = 999;
            (0, chai_1.expect)((0, expressionUtils_1.parseExpression)('^^')).eql(expected, '2nd');
        });
        it('should return nothing for "constructor" expression', () => {
            (0, chai_1.expect)((0, expressionUtils_1.parseExpression)('constructor')).undefined;
        });
    });
    describe('encodeExpression() + decodeExpression()', () => {
        function test(expression) {
            return (0, expressionEncoder_1.decodeExpression)((0, expressionEncoder_1.encodeExpression)(expression));
        }
        it('works for null and undefined', () => {
            (0, chai_1.expect)(test(null)).undefined;
            (0, chai_1.expect)(test(undefined)).undefined;
        });
        expressions_1.expressions.filter(([, x]) => !!x).forEach(([input, expected]) => {
            it(JSON.stringify(input), () => {
                const expression = toExpression(expected);
                (0, chai_1.expect)(test(expression)).eql(expression);
            });
        });
    });
    describe('flipIris()', () => {
        it('returns the same iris for non flippable irises', () => {
            (0, chai_1.expect)((0, ponyUtils_1.flipIris)(0 /* Iris.Forward */)).equal(0 /* Iris.Forward */);
            (0, chai_1.expect)((0, ponyUtils_1.flipIris)(1 /* Iris.Up */)).equal(1 /* Iris.Up */);
            (0, chai_1.expect)((0, ponyUtils_1.flipIris)(6 /* Iris.Shocked */)).equal(6 /* Iris.Shocked */);
        });
        it('returns flipped iris', () => {
            (0, chai_1.expect)((0, ponyUtils_1.flipIris)(2 /* Iris.Left */)).equal(3 /* Iris.Right */);
            (0, chai_1.expect)((0, ponyUtils_1.flipIris)(3 /* Iris.Right */)).equal(2 /* Iris.Left */);
            (0, chai_1.expect)((0, ponyUtils_1.flipIris)(4 /* Iris.UpLeft */)).equal(5 /* Iris.UpRight */);
            (0, chai_1.expect)((0, ponyUtils_1.flipIris)(5 /* Iris.UpRight */)).equal(4 /* Iris.UpLeft */);
        });
    });
    describe('expression()', () => {
        it('creates expression with all parameters', () => {
            (0, chai_1.expect)((0, expressionUtils_1.expression)(19 /* Eye.Angry */, 14 /* Eye.ClosedHappy */, 0 /* Muzzle.Smile */, 2 /* Iris.Left */, 3 /* Iris.Right */, 1 /* ExpressionExtra.Blush */)).eql({
                right: 19 /* Eye.Angry */,
                left: 14 /* Eye.ClosedHappy */,
                muzzle: 0 /* Muzzle.Smile */,
                rightIris: 2 /* Iris.Left */,
                leftIris: 3 /* Iris.Right */,
                extra: 1 /* ExpressionExtra.Blush */,
            });
        });
        it('creates expression with defaults', () => {
            (0, chai_1.expect)((0, expressionUtils_1.expression)(19 /* Eye.Angry */, 14 /* Eye.ClosedHappy */, 0 /* Muzzle.Smile */)).eql({
                right: 19 /* Eye.Angry */,
                left: 14 /* Eye.ClosedHappy */,
                muzzle: 0 /* Muzzle.Smile */,
                rightIris: 0 /* Iris.Forward */,
                leftIris: 0 /* Iris.Forward */,
                extra: 0 /* ExpressionExtra.None */,
            });
        });
    });
});
//# sourceMappingURL=expressionUtils.spec.js.map