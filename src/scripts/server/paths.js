"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.root = void 0;
exports.pathTo = pathTo;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
exports.root = path.join(__dirname, '..', '..', '..');
exports.store = path.join(exports.root, 'store');
function pathTo(...parts) {
    return path.join(exports.root, ...parts);
}
//# sourceMappingURL=paths.js.map