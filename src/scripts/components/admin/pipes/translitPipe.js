"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslitPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const transliteration_1 = require("transliteration");
let TranslitPipe = class TranslitPipe {
    transform(value) {
        if (!value || /^[a-z0-9-_.,\[\]!@#$%^&*{}|\/\\ ]+$/i.test(value))
            return undefined;
        const translit = (0, transliteration_1.transliterate)(value);
        return translit !== value ? translit : undefined;
    }
};
exports.TranslitPipe = TranslitPipe;
exports.TranslitPipe = TranslitPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'translit',
    })
], TranslitPipe);
//# sourceMappingURL=translitPipe.js.map