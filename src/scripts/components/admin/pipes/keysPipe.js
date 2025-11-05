"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeysPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let KeysPipe = class KeysPipe {
    transform(value) {
        return value ? Object.keys(value) : value;
    }
};
exports.KeysPipe = KeysPipe;
exports.KeysPipe = KeysPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'keys',
    })
], KeysPipe);
//# sourceMappingURL=keysPipe.js.map