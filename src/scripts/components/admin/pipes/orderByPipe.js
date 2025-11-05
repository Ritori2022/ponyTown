"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderByPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let OrderByPipe = class OrderByPipe {
    transform(value, compare) {
        return value && value.slice().sort(compare);
    }
};
exports.OrderByPipe = OrderByPipe;
exports.OrderByPipe = OrderByPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'orderBy',
    })
], OrderByPipe);
//# sourceMappingURL=orderByPipe.js.map