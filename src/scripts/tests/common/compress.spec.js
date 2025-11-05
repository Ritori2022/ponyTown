"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const compress_1 = require("../../common/compress");
const constants_1 = require("../../common/constants");
describe('compress', () => {
    describe('compressTiles() + decompressTiles()', () => {
        it('test', () => {
            const tiles = new Uint8Array(constants_1.REGION_SIZE * constants_1.REGION_SIZE);
            for (let i = 0; i < tiles.length; i++) {
                tiles[i] = (0, lodash_1.random)(0, 5);
            }
            // console.log(Array.from(tiles).join(', '));
            const compressed = (0, compress_1.compressTiles)(new Uint8Array(tiles));
            const decompressed = (0, compress_1.decompressTiles)(compressed);
            //console.log(`${JSON.stringify(test)}: ${test.length} -> ${compressed.length}`);
            (0, chai_1.expect)(Array.from(decompressed)).eql(Array.from(tiles), `compressed: [${Array.from(compressed).join(', ')}]`);
        });
    });
});
//# sourceMappingURL=compress.spec.js.map