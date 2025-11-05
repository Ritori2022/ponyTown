"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsApp = void 0;
exports.tooltipConfig = tooltipConfig;
exports.popoverConfig = popoverConfig;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const tooltip_1 = require("ngx-bootstrap/tooltip");
const popover_1 = require("ngx-bootstrap/popover");
function tooltipConfig() {
    return Object.assign(new tooltip_1.TooltipConfig(), { container: 'body' });
}
function popoverConfig() {
    return Object.assign(new popover_1.PopoverConfig(), { container: 'body' });
}
let ToolsApp = class ToolsApp {
};
exports.ToolsApp = ToolsApp;
exports.ToolsApp = ToolsApp = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'pony-town-app',
        templateUrl: 'tools.pug',
        providers: [
            { provide: tooltip_1.TooltipConfig, useFactory: tooltipConfig },
            { provide: popover_1.PopoverConfig, useFactory: popoverConfig },
        ]
    })
], ToolsApp);
//# sourceMappingURL=tools.js.map