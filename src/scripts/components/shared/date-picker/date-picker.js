"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatePicker = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const utils_1 = require("../../../common/utils");
const constants_1 = require("../../../common/constants");
const clientUtils_1 = require("../../../client/clientUtils");
let DatePicker = class DatePicker {
    constructor() {
        this.days = (0, utils_1.times)(31, i => i + 1);
        this.years = [];
        this.months = getMonthNames();
        this.day = 0;
        this.month = 0;
        this.year = 0;
        this.dateChange = new core_1.EventEmitter();
        const minYear = 1914;
        const maxYear = (new Date()).getFullYear() - 6;
        for (let year = maxYear; year >= minYear; year--) {
            this.years.push(year);
        }
    }
    get date() {
        const date = (0, utils_1.createValidBirthDate)(this.day, this.month, this.year);
        return date && (0, utils_1.formatISODate)(date);
    }
    set date(value) {
        if (value) {
            const { day, month, year } = (0, utils_1.parseISODate)(value);
            this.day = day;
            this.month = month;
            this.year = year;
        }
    }
    change() {
        this.dateChange.emit(this.date);
    }
};
exports.DatePicker = DatePicker;
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], DatePicker.prototype, "dateChange", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], DatePicker.prototype, "date", null);
exports.DatePicker = DatePicker = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'date-picker',
        templateUrl: 'date-picker.pug',
    }),
    tslib_1.__metadata("design:paramtypes", [])
], DatePicker);
function getMonthNames() {
    try {
        const format = new Intl.DateTimeFormat((0, clientUtils_1.getLocale)(), { month: 'long' });
        return (0, utils_1.times)(12, i => {
            const date = new Date(523456789);
            date.setMonth(i);
            return format.format(date);
        });
    }
    catch {
        return constants_1.MONTH_NAMES_EN;
    }
}
//# sourceMappingURL=date-picker.js.map