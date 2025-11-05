"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBinary = writeBinary;
const browser_1 = require("ag-sockets/dist/browser");
function writeBinary(write) {
    const writer = (0, browser_1.createBinaryWriter)();
    do {
        try {
            write(writer);
            break;
        }
        catch (e) {
            if (e instanceof RangeError || /DataView/.test(e.message)) {
                (0, browser_1.resizeWriter)(writer);
            }
            else {
                throw e;
            }
        }
    } while (true);
    return (0, browser_1.getWriterBuffer)(writer);
}
//# sourceMappingURL=binaryUtils.js.map