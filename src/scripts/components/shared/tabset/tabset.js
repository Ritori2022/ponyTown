"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tabsetComponents = exports.Tabset = exports.Tab = exports.TabContent = exports.TabTitle = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const lodash_1 = require("lodash");
let TabTitle = class TabTitle {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
};
exports.TabTitle = TabTitle;
exports.TabTitle = TabTitle = tslib_1.__decorate([
    (0, core_1.Directive)({
        selector: '[tabTitle]'
    }),
    tslib_1.__metadata("design:paramtypes", [core_1.TemplateRef])
], TabTitle);
let TabContent = class TabContent {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
};
exports.TabContent = TabContent;
exports.TabContent = TabContent = tslib_1.__decorate([
    (0, core_1.Directive)({
        selector: '[tabContent]',
    }),
    tslib_1.__metadata("design:paramtypes", [core_1.TemplateRef])
], TabContent);
let Tab = class Tab {
    constructor() {
        this.id = (0, lodash_1.uniqueId)(`tabset-tab`);
        this.disabled = false;
    }
};
exports.Tab = Tab;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], Tab.prototype, "id", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String)
], Tab.prototype, "title", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], Tab.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], Tab.prototype, "disabled", void 0);
tslib_1.__decorate([
    (0, core_1.ContentChild)(TabContent, { static: false }),
    tslib_1.__metadata("design:type", TabContent)
], Tab.prototype, "contentTpl", void 0);
tslib_1.__decorate([
    (0, core_1.ContentChild)(TabTitle, { static: false }),
    tslib_1.__metadata("design:type", TabTitle)
], Tab.prototype, "titleTpl", void 0);
exports.Tab = Tab = tslib_1.__decorate([
    (0, core_1.Directive)({
        selector: 'tab',
    })
], Tab);
let Tabset = class Tabset {
    set justify(className) {
        if (className === 'fill' || className === 'justified') {
            this.justifyClass = `nav-${className}`;
        }
        else {
            this.justifyClass = `justify-content-${className}`;
        }
    }
    constructor() {
        this.label = '';
        this.destroyOnHide = true;
        this.orientation = 'horizontal';
        this.type = 'tabs';
        this.activeIndex = 0;
        this.activeIndexChange = new core_1.EventEmitter();
        this.justify = 'start';
    }
    get navClass() {
        return `nav-${this.type}${this.orientation === 'horizontal' ? ` ${this.justifyClass}` : ' flex-column'}`;
    }
    select(index) {
        if (this.activeIndex !== index) {
            this.activeIndex = index;
            this.activeIndexChange.emit(index);
        }
    }
    keydown(e) {
        const index = this.handleKey(e.keyCode);
        if (index !== undefined) {
            e.preventDefault();
            const element = document.getElementById(this.tabs.toArray()[index].id);
            element && element.focus();
            this.select(index);
        }
    }
    handleKey(keyCode) {
        if (keyCode === 37 /* Key.LEFT */) {
            return this.activeIndex === 0 ? this.tabs.length - 1 : this.activeIndex - 1;
        }
        else if (keyCode === 39 /* Key.RIGHT */) {
            return this.activeIndex === this.tabs.length - 1 ? 0 : this.activeIndex + 1;
        }
        else if (keyCode === 36 /* Key.HOME */) {
            return 0;
        }
        else if (keyCode === 35 /* Key.END */) {
            return this.tabs.length - 1;
        }
        else {
            return undefined;
        }
    }
};
exports.Tabset = Tabset;
tslib_1.__decorate([
    (0, core_1.ContentChildren)(Tab),
    tslib_1.__metadata("design:type", core_1.QueryList)
], Tabset.prototype, "tabs", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], Tabset.prototype, "label", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], Tabset.prototype, "destroyOnHide", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], Tabset.prototype, "justify", null);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String)
], Tabset.prototype, "orientation", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String)
], Tabset.prototype, "type", void 0);
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", Object)
], Tabset.prototype, "activeIndex", void 0);
tslib_1.__decorate([
    (0, core_1.Output)(),
    tslib_1.__metadata("design:type", Object)
], Tabset.prototype, "activeIndexChange", void 0);
exports.Tabset = Tabset = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'tabset',
        templateUrl: 'tabset.pug',
    }),
    tslib_1.__metadata("design:paramtypes", [])
], Tabset);
exports.tabsetComponents = [TabContent, TabTitle, Tabset, Tab];
//# sourceMappingURL=tabset.js.map