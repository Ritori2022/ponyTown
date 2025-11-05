"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsEntity = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const lodash_1 = require("lodash");
const utils_1 = require("../../../common/utils");
const sprites = tslib_1.__importStar(require("../../../generated/sprites"));
const mixins_1 = require("../../../common/mixins");
const color_1 = require("../../../common/color");
const paletteManager_1 = require("../../../graphics/paletteManager");
const colors_1 = require("../../../common/colors");
const graphicsUtils_1 = require("../../../graphics/graphicsUtils");
const contextSpriteBatch_1 = require("../../../graphics/contextSpriteBatch");
const spriteUtils_1 = require("../../../client/spriteUtils");
const icons_1 = require("../../../client/icons");
const storageService_1 = require("../../services/storageService");
const ponyInfo_1 = require("../../../common/ponyInfo");
const constants_1 = require("../../../common/constants");
const ponyDraw_1 = require("../../../client/ponyDraw");
const ponyHelpers_1 = require("../../../client/ponyHelpers");
const entities_1 = require("../../../common/entities");
const compressPony_1 = require("../../../common/compressPony");
const canvasUtils_1 = require("../../../client/canvasUtils");
const positionUtils_1 = require("../../../common/positionUtils");
const COVER = (0, color_1.parseColor)('DeepSkyBlue');
const COLLIDER = colors_1.ORANGE;
const PICKABLE = colors_1.PURPLE;
const BG = (0, color_1.parseColor)('lightgreen');
const LINES = (0, color_1.withAlphaFloat)(colors_1.BLACK, 0.1);
const SELECTION = (0, color_1.withAlphaFloat)(colors_1.WHITE, 0.5);
const DEFAULT_PALETTE = [colors_1.TRANSPARENT, colors_1.WHITE];
const paletteManager = new paletteManager_1.PaletteManager();
const defaultPalette = paletteManager.add(DEFAULT_PALETTE);
const X = 128;
const Y = 190;
const colors = {
    cover: COVER,
    collider: COLLIDER,
    pickable: PICKABLE,
};
let ToolsEntity = class ToolsEntity {
    constructor(storage) {
        this.storage = storage;
        this.homeIcon = icons_1.faHome;
        this.saveIcon = icons_1.faSave;
        this.eraserIcon = icons_1.faEraser;
        this.trashIcon = icons_1.faTrash;
        this.crosshairsIcon = icons_1.faCrosshairs;
        this.plusIcon = icons_1.faPlus;
        this.scale = 2;
        this.name = '';
        this.drawCenter = true;
        this.drawSelection = true;
        this.drawHold = false;
        this.sprites = Object.keys(sprites).filter(key => {
            const s = sprites[key];
            return !!(s && s.color);
        });
        this.selectedPart = -1;
        this.entities = [];
        this.parts = [];
        this.pony = (0, ponyInfo_1.toPalette)((0, compressPony_1.decompressPonyString)(constants_1.OFFLINE_PONY), ponyInfo_1.mockPaletteManager);
        this.startX = 0;
        this.startY = 0;
    }
    ngOnInit() {
        (0, mixins_1.setPaletteManager)(paletteManager);
        (0, spriteUtils_1.loadAndInitSpriteSheets)().then(() => this.changed());
        const data = this.load();
        this.parts = (0, lodash_1.compact)(data.parts || [this.createSpritePart('apple')]);
        this.entities = (0, lodash_1.compact)(data.entities || []);
    }
    keydown(e) {
        if (!(0, utils_1.isKeyEventInvalid)(e) && this.handleKey(e.keyCode)) {
            e.preventDefault();
        }
    }
    handleKey(keyCode) {
        if (keyCode === 38 /* Key.UP */) {
            this.movePart(0, -1);
        }
        else if (keyCode === 40 /* Key.DOWN */) {
            this.movePart(0, 1);
        }
        else if (keyCode === 37 /* Key.LEFT */) {
            this.movePart(-1, 0);
        }
        else if (keyCode === 39 /* Key.RIGHT */) {
            this.movePart(1, 0);
        }
        else {
            return false;
        }
        return true;
    }
    mousedown(e) {
        const canvas = this.canvas.nativeElement;
        const { left, top } = canvas.getBoundingClientRect();
        const x = (e.pageX - left) / this.scale - X;
        const y = (e.pageY - top) / this.scale - Y;
        this.selectedPart = (0, lodash_1.findLastIndex)(this.parts, p => {
            if (this.drawHold) {
                return p.type === 'pickable';
            }
            else {
                const bounds = getBounds(p);
                return !!bounds && (0, utils_1.containsPoint)(0, 0, bounds, x, y);
            }
        });
        this.changed();
    }
    drag({ dx, dy, type }) {
        const part = this.parts[this.selectedPart];
        if (part) {
            if (type === 'start') {
                this.startX = part.x;
                this.startY = part.y;
            }
            part.x = Math.round(this.startX + dx / this.scale);
            part.y = Math.round(this.startY + dy / this.scale);
        }
        this.changed();
    }
    setEntity(entity) {
        if (entity) {
            this.name = entity.name;
            this.parts = entity.parts;
        }
        else {
            this.name = '';
            this.parts = [];
        }
        this.changed();
    }
    saveEntity() {
        if (this.name) {
            const existing = this.entities.find(e => e.name === this.name);
            if (existing) {
                existing.parts = (0, utils_1.cloneDeep)(this.parts);
            }
            else {
                this.entities.push({
                    name: this.name,
                    parts: (0, utils_1.cloneDeep)(this.parts),
                });
            }
            this.changed();
        }
    }
    removeEntity() {
        (0, utils_1.removeItem)(this.entities, this.entities.find(e => e.name === this.name));
        this.changed();
    }
    movePart(dx, dy) {
        const part = this.parts[this.selectedPart];
        if (part) {
            part.x += dx;
            part.y += dy;
        }
        this.changed();
    }
    changed() {
        requestAnimationFrame(() => this.redraw());
    }
    redraw() {
        const canvas = this.canvas.nativeElement;
        const scale = this.scale;
        const width = Math.ceil(canvas.width / scale);
        const height = Math.ceil(canvas.height / scale);
        const draw = (batch) => {
            if (this.drawCenter) {
                batch.drawRect(LINES, 0, Y, width, 1);
                batch.drawRect(LINES, X, 0, 1, height);
            }
            this.parts.forEach(p => drawPart(batch, p, X, Y));
            const part = this.parts[this.selectedPart];
            if (part) {
                const bounds = getBounds(part);
                if (this.drawSelection && bounds) {
                    const sx = X + bounds.x;
                    const sy = Y + bounds.y;
                    (0, graphicsUtils_1.drawOutline)(batch, SELECTION, sx - 1, sy - 1, bounds.w + 2, bounds.h + 2);
                }
            }
            if (this.drawCenter) {
                batch.drawRect(colors_1.RED, X, Y, 1, 1);
            }
        };
        const buffer = (0, contextSpriteBatch_1.drawCanvas)(width, height, sprites.paletteSpriteSheet, BG, batch => {
            if (this.drawHold) {
                const spritePart = this.parts.find(p => p.type === 'sprite');
                const pickablePart = this.parts.find(p => p.type === 'pickable');
                const holding = spritePart && pickablePart && getSprite(spritePart.sprite) ? {
                    ...(0, entities_1.createBaseEntity)(0, 0, 0, 0),
                    ...drawMixin(getSprite(spritePart.sprite), -spritePart.x, -spritePart.y),
                    ...(0, mixins_1.pickable)(pickablePart.x, pickablePart.y),
                } : undefined;
                const state = { ...(0, ponyHelpers_1.defaultPonyState)(), holding };
                (0, ponyDraw_1.drawPony)(batch, this.pony, state, X, Y, (0, ponyHelpers_1.defaultDrawPonyOptions)());
            }
            else {
                draw(batch);
            }
        });
        drawBufferScaled(canvas, buffer, scale);
        this.save();
    }
    createSpritePart(sprite) {
        return {
            type: 'sprite',
            sprite,
            x: 0,
            y: 0,
        };
    }
    createBoundsPart(type) {
        return {
            type,
            x: 0,
            y: 0,
            w: 10,
            h: 10,
        };
    }
    createPart(type) {
        switch (type) {
            case 'sprite':
                return this.createSpritePart('apple');
            case 'cover':
            case 'collider':
                return this.createBoundsPart(type);
            case 'pickable':
                return { type, x: 0, y: 0 };
            default:
                throw new Error(`Invalid type (${type})`);
        }
    }
    addPart(type) {
        this.parts.push(this.createPart(type));
        this.changed();
    }
    removePart(part) {
        (0, utils_1.removeItem)(this.parts, part);
        this.changed();
    }
    centerPart(part) {
        if (part.type === 'sprite') {
            const sprite = getSprite(part.sprite);
            const color = sprite && sprite.color;
            if (color) {
                part.x = Math.round(-color.ox - color.w / 2);
                part.y = Math.round(-color.oy - color.h / 2);
            }
        }
        this.changed();
    }
    save() {
        this.storage.setJSON('tools-entity', {
            parts: this.parts,
            entities: this.entities,
        });
    }
    load() {
        return this.storage.getJSON('tools-entity', {});
    }
};
exports.ToolsEntity = ToolsEntity;
tslib_1.__decorate([
    (0, core_1.ViewChild)('canvas', { static: true }),
    tslib_1.__metadata("design:type", core_1.ElementRef)
], ToolsEntity.prototype, "canvas", void 0);
tslib_1.__decorate([
    (0, core_1.HostListener)('window:keydown', ['$event']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [KeyboardEvent]),
    tslib_1.__metadata("design:returntype", void 0)
], ToolsEntity.prototype, "keydown", null);
exports.ToolsEntity = ToolsEntity = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'tools-entity',
        templateUrl: 'tools-entity.pug',
    }),
    tslib_1.__metadata("design:paramtypes", [storageService_1.StorageService])
], ToolsEntity);
function getBounds(part) {
    if (part.type === 'sprite') {
        const sprite = getSprite(part.sprite);
        const color = sprite && sprite.color;
        if (color) {
            return {
                x: part.x + color.ox,
                y: part.y + color.oy,
                w: color.w,
                h: color.h,
            };
        }
    }
    else if (part.type === 'cover' || part.type === 'collider') {
        return part;
    }
    return undefined;
}
function getSprite(name) {
    return sprites[name];
}
function drawSpritePart(batch, part, px, py) {
    const sprite = getSprite(part.sprite);
    if (!sprite)
        return;
    const x = px + part.x;
    const y = py + part.y;
    const palette = paletteManager.addArray(sprite.palettes[0]);
    sprite.shadow && batch.drawSprite(sprite.shadow, colors_1.SHADOW_COLOR, defaultPalette, x, y);
    sprite.color && batch.drawSprite(sprite.color, colors_1.WHITE, palette, x, y);
    (0, paletteManager_1.releasePalette)(palette);
}
function drawPart(batch, part, x, y) {
    if (part.type === 'sprite') {
        return drawSpritePart(batch, part, x, y);
    }
    else if (part.type === 'cover' || part.type === 'collider') {
        return (0, graphicsUtils_1.drawOutline)(batch, colors[part.type], part.x + x, part.y + y, part.w, part.h);
    }
    else if (part.type === 'pickable') {
        return (0, graphicsUtils_1.drawOutline)(batch, colors[part.type], part.x + x, part.y + y, 1, 1);
    }
    else {
        throw new Error(`Invalid part type (${part.type})`);
    }
}
function drawBufferScaled(canvas, buffer, scale) {
    const context = canvas.getContext('2d');
    context.save();
    (0, canvasUtils_1.disableImageSmoothing)(context);
    context.scale(scale, scale);
    context.drawImage(buffer, 0, 0);
    context.restore();
}
function drawMixin(sprite, dx, dy, paletteIndex = 0) {
    const bounds = (0, mixins_1.getRenderableBounds)(sprite, dx, dy);
    if (SERVER && !TESTS)
        return { bounds };
    const defaultPalette = sprite.shadow && (0, mixins_1.createPalette)(sprites.defaultPalette);
    const palette = (0, mixins_1.createPalette)((0, utils_1.att)(sprite.palettes, paletteIndex));
    return {
        bounds,
        draw(batch, options) {
            const x = (0, positionUtils_1.toScreenX)(this.x + (this.ox || 0)) - dx;
            const y = (0, positionUtils_1.toScreenYWithZ)(this.y + (this.oy || 0), this.z + (this.oz || 0)) - dy;
            const opacity = 1 - 0.6 * (this.coverLifting || 0);
            if (sprite.shadow !== undefined) {
                batch.drawSprite(sprite.shadow, options.shadowColor, defaultPalette, x, y);
            }
            batch.globalAlpha = opacity;
            if (sprite.color !== undefined) {
                batch.drawSprite(sprite.color, colors_1.WHITE, palette, x, y);
            }
            batch.globalAlpha = 1;
        },
        palettes: (0, lodash_1.compact)([defaultPalette, palette]),
    };
}
//# sourceMappingURL=tools-entity.js.map