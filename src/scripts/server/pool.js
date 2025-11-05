"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = createPool;
function createPool(count, createNew, reset) {
    const pool = [];
    const create = () => {
        const existing = pool.pop();
        if (existing) {
            reset(existing);
            return existing;
        }
        else {
            return createNew();
        }
    };
    const dispose = (value) => {
        if (pool.length < count) {
            pool.push(value);
            return true;
        }
        else {
            return false;
        }
    };
    return { create, dispose };
}
//# sourceMappingURL=pool.js.map