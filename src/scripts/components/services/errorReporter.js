"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorReporter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let ErrorReporter = class ErrorReporter {
    disable() {
    }
    configureUser(_person) {
    }
    configureData(_data) {
    }
    captureEvent(_data) {
    }
    reportError(error, data) {
        console.error(error, data);
    }
    createClientErrorHandler(socketOptions) {
        const handleRecvError = (error, data) => {
            if (error.message) {
                let method;
                if (data instanceof Uint8Array) {
                    const bytes = [];
                    const length = Math.min(data.length, 200);
                    for (let i = 0; i < length; i++) {
                        bytes.push(data[i]);
                    }
                    const trail = length < data.length ? '...' : '';
                    if (data.length > 0) {
                        const item = socketOptions.client[data[0]];
                        method = typeof item === 'string' ? item : item[0];
                    }
                    data = `<${bytes.toString()}${trail}>`;
                }
                this.reportError(error, { data, method });
            }
        };
        return { handleRecvError };
    }
};
exports.ErrorReporter = ErrorReporter;
exports.ErrorReporter = ErrorReporter = tslib_1.__decorate([
    (0, core_1.Injectable)()
], ErrorReporter);
//# sourceMappingURL=errorReporter.js.map