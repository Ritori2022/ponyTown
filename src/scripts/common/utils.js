"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectCache = exports.setTransform = void 0;
exports.invalidEnum = invalidEnum;
exports.invalidEnumReturn = invalidEnumReturn;
exports.fromDate = fromDate;
exports.fromNow = fromNow;
exports.compareDates = compareDates;
exports.maxDate = maxDate;
exports.minDate = minDate;
exports.formatDuration = formatDuration;
exports.formatISODate = formatISODate;
exports.parseISODate = parseISODate;
exports.createValidBirthDate = createValidBirthDate;
exports.parseSpriteColor = parseSpriteColor;
exports.clamp = clamp;
exports.lerp = lerp;
exports.normalize = normalize;
exports.computeCRC = computeCRC;
exports.computeFriendsCRC = computeFriendsCRC;
exports.lerpColor = lerpColor;
exports.toInt = toInt;
exports.dispose = dispose;
exports.cloneDeep = cloneDeep;
exports.hasFlag = hasFlag;
exports.setFlag = setFlag;
exports.flagsToString = flagsToString;
exports.includes = includes;
exports.array = array;
exports.repeat = repeat;
exports.times = times;
exports.last = last;
exports.flatten = flatten;
exports.at = at;
exports.att = att;
exports.findById = findById;
exports.findIndexById = findIndexById;
exports.removeItem = removeItem;
exports.removeItemFast = removeItemFast;
exports.removeById = removeById;
exports.arraysEqual = arraysEqual;
exports.pushUniq = pushUniq;
exports.createPlainMap = createPlainMap;
exports.point = point;
exports.contains = contains;
exports.containsPoint = containsPoint;
exports.containsPointWitBorder = containsPointWitBorder;
exports.pointInRect = pointInRect;
exports.pointInXYWH = pointInXYWH;
exports.randomPoint = randomPoint;
exports.lengthOfXY = lengthOfXY;
exports.distanceXY = distanceXY;
exports.distanceSquaredXY = distanceSquaredXY;
exports.distance = distance;
exports.entitiesIntersect = entitiesIntersect;
exports.collidersIntersect = collidersIntersect;
exports.boundsIntersect = boundsIntersect;
exports.intersect = intersect;
exports.createError = createError;
exports.delay = delay;
exports.observableToPromise = observableToPromise;
exports.bitmask = bitmask;
exports.isCommand = isCommand;
exports.processCommand = processCommand;
exports.isTouch = isTouch;
exports.getButton = getButton;
exports.getX = getX;
exports.getY = getY;
exports.isKeyEventInvalid = isKeyEventInvalid;
const constants_1 = require("./constants");
const errors_1 = require("./errors");
// enum
function invalidEnum(value) {
    if (DEVELOPMENT) {
        throw new Error(`Invalid enum value: ${value}`);
    }
}
function invalidEnumReturn(value, ret) {
    if (DEVELOPMENT && !TESTS) {
        throw new Error(`Invalid enum value: ${value}`);
    }
    return ret;
}
// date
function fromDate(date, duration) {
    date.setTime(date.getTime() + duration);
    return date;
}
function fromNow(duration) {
    return fromDate(new Date(), duration);
}
function compareDates(a, b) {
    return a ? (b ? a.getTime() - b.getTime() : 1) : (b ? -1 : 0);
}
function maxDate(a, b) {
    return (compareDates(a, b) > 0 ? a : b) || a || b;
}
function minDate(a, b) {
    return (compareDates(a, b) < 0 ? a : b) || a || b;
}
function formatDuration(duration) {
    const s = Math.floor(duration / constants_1.SECOND) % 60;
    const m = Math.floor(duration / constants_1.MINUTE) % 60;
    const h = Math.floor(duration / constants_1.HOUR) % 24;
    const d = Math.floor(duration / constants_1.DAY);
    if (d > 0) {
        return h ? `${d}d ${h}h` : `${d}d`;
    }
    else if (h > 0) {
        return m ? `${h}h ${m}m` : `${h}h`;
    }
    else if (m > 0) {
        return s ? `${m}m ${s}s` : `${m}m`;
    }
    else {
        return `${s}s`;
    }
}
function formatISODate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}
function parseISODate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    let day = 0;
    let month = 0;
    let year = 0;
    if (match) {
        year = parseInt(match[1], 10);
        month = parseInt(match[2], 10);
        day = parseInt(match[3], 10);
    }
    return { day, month, year };
}
function createValidBirthDate(day, month, year) {
    const date = new Date(0);
    const currentYear = (new Date()).getFullYear();
    date.setFullYear(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === (month - 1) && date.getDate() === day &&
        year >= (currentYear - 120) && year < currentYear) {
        return date;
    }
    else {
        return undefined;
    }
}
// color
function parseSpriteColor(str) {
    return str === '0' ? 0 : (str.length === 6 ? (((parseInt(str, 16) << 8) | 0xff) >>> 0) : (parseInt(str, 16) >>> 0));
}
// numbers
function clamp(value, min, max) {
    return value > min ? (value < max ? value : max) : min;
}
function lerp(a, b, t) {
    return a + t * (b - a);
}
function normalize(x, y) {
    const d = Math.sqrt(x * x + y * y);
    return { x: x / d, y: y / d };
}
function computeCRC(colors) {
    let crc = 0;
    for (let i = 0; i < colors.length; i++) {
        crc ^= colors[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc & 1) ? ((crc >>> 1) ^ 0x82f63b78) : (crc >>> 1);
        }
    }
    return crc >>> 0;
}
function computeFriendsCRC(friends) {
    if (!friends.length) {
        return 0;
    }
    friends.sort();
    const data = new Uint32Array(friends.length * 3);
    for (let i = 0; i < friends.length; i++) {
        const id = friends[i];
        data[i * 3] = parseInt(id.substr(0, 8), 16);
        data[i * 3 + 1] = parseInt(id.substr(8, 8), 16);
        data[i * 3 + 2] = parseInt(id.substr(16, 8), 16);
    }
    return computeCRC(data);
}
function lerpColor(a, b, t) {
    a[0] = t * b[0] + (1 - t) * a[0];
    a[1] = t * b[1] + (1 - t) * a[1];
    a[2] = t * b[2] + (1 - t) * a[2];
    a[3] = t * b[3] + (1 - t) * a[3];
}
// common
function toInt(value) {
    return value | 0;
}
function dispose(obj) {
    obj && obj.dispose();
    return undefined;
}
function cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
}
// enums
function hasFlag(value, flag) {
    return (value & flag) === flag;
}
function setFlag(value, flag, on) {
    return (value & ~flag) | (on ? flag : 0);
}
function flagsToString(value, flags, none = 'None') {
    return flags
        .filter(flag => hasFlag(value, flag.value))
        .map(flag => flag.name).join(' | ') || none;
}
// collections
function includes(array, item) {
    return array !== undefined && array.indexOf(item) !== -1;
}
function array(size, defaultValue) {
    const result = [];
    for (let i = 0; i < size; i++) {
        result.push(defaultValue);
    }
    return result;
}
function repeat(count, ...values) {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(...values);
    }
    return result;
}
function times(count, action) {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(action(i));
    }
    return result;
}
function last(array) {
    return array.length > 0 ? array[array.length - 1] : undefined;
}
function flatten(arrays) {
    return [].concat(...arrays);
}
function at(items, index) {
    return items[clamp(index | 0, 0, items.length - 1)];
}
function att(items, index) {
    return items ? items[clamp(index | 0, 0, items.length - 1)] : undefined;
}
function findById(items, id) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return items[i];
        }
    }
    return undefined;
}
function findIndexById(items, id) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return i;
        }
    }
    return -1;
}
function removeItem(items, item) {
    const index = items.indexOf(item);
    if (index !== -1) {
        items.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
}
function removeItemFast(items, item) {
    const index = items.indexOf(item);
    if (index !== -1) {
        items[index] = items[items.length - 1];
        items.pop();
        return true;
    }
    else {
        return false;
    }
}
function removeById(items, id) {
    const index = findIndexById(items, id);
    if (index !== -1) {
        const item = items[index];
        items.splice(index, 1);
        return item;
    }
    else {
        return undefined;
    }
}
function arraysEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
function pushUniq(array, item) {
    const index = array.indexOf(item);
    if (index === -1) {
        array.push(item);
        return array.length;
    }
    else {
        return index + 1;
    }
}
function createPlainMap(values) {
    return Object.keys(values).reduce((obj, key) => (obj[key] = values[key], obj), Object.create(null));
}
// rects / points
function point(x, y) {
    return { x, y };
}
function contains(x, y, bounds, point) {
    const bx = bounds.x / constants_1.tileWidth + x;
    const by = bounds.y / constants_1.tileHeight + y;
    const bw = bounds.w / constants_1.tileWidth;
    const bh = bounds.h / constants_1.tileHeight;
    return point.x > bx && point.x < bx + bw && point.y > by && point.y < by + bh;
}
function containsPoint(dx, dy, rect, px, py) {
    return pointInXYWH(px, py, rect.x + dx, rect.y + dy, rect.w, rect.h);
}
function containsPointWitBorder(dx, dy, rect, px, py, border) {
    return pointInXYWH(px, py, rect.x + dx - border, rect.y + dy - border, rect.w + border * 2, rect.h + border * 2);
}
function pointInRect(x, y, rect) {
    return x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;
}
function pointInXYWH(px, py, rx, ry, rw, rh) {
    return px > rx && px < rx + rw && py > ry && py < ry + rh;
}
function randomPoint({ x, y, w, h }) {
    return {
        x: x + w * Math.random(),
        y: y + h * Math.random(),
    };
}
function lengthOfXY(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
}
function distanceXY(ax, ay, bx, by) {
    return lengthOfXY(ax - bx, ay - by);
}
function distanceSquaredXY(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
}
function distance(a, b) {
    return distanceXY(a.x, a.y, b.x, b.y);
}
function entitiesIntersect(a, b) {
    const aBounds = a.bounds;
    const bBounds = b.bounds;
    if (!aBounds || !bBounds) {
        return false;
    }
    const ax = a.x * constants_1.tileWidth + aBounds.x;
    const ay = a.y * constants_1.tileHeight + aBounds.y;
    const bx = b.x * constants_1.tileWidth + bBounds.x;
    const by = b.y * constants_1.tileHeight + bBounds.y;
    return intersect(ax, ay, aBounds.w, aBounds.h, bx, by, bBounds.w, bBounds.h);
}
function collidersIntersect(ax, ay, a, bx, by, b) {
    const axmin = Math.floor((ax + a.x) * constants_1.tileWidth) | 0;
    const axmax = Math.ceil((ax + a.x + a.w) * constants_1.tileWidth) | 0;
    const aymin = Math.floor((ay + a.y) * constants_1.tileHeight) | 0;
    const aymax = Math.ceil((ay + a.y + a.h) * constants_1.tileHeight) | 0;
    const bxmin = Math.floor((bx + b.x) * constants_1.tileWidth) | 0;
    const bxmax = Math.ceil((bx + b.x + b.w) * constants_1.tileWidth) | 0;
    const bymin = Math.floor((by + b.y) * constants_1.tileHeight) | 0;
    const bymax = Math.ceil((by + b.y + b.h) * constants_1.tileHeight) | 0;
    return axmin < bxmax && axmax > bxmin && aymin < bymax && aymax > bymin;
}
function boundsIntersect(ax, ay, a, bx, by, b) {
    return !!(a && b && intersect(ax * constants_1.tileWidth + a.x, ay * constants_1.tileHeight + a.y, a.w, a.h, bx * constants_1.tileWidth + b.x, by * constants_1.tileHeight + b.y, b.w, b.h));
}
function intersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax <= (bx + bw) && (ax + aw) >= bx && ay <= (by + bh) && (ay + ah) >= by;
}
function createError(status, data) {
    if (status > 500 && status < 600) {
        return new Error(errors_1.PROTECTION_ERROR);
        // } else if (status === 400) {
        // 	return new Error('Bad Request');
    }
    else if (status === 403) {
        return new Error(errors_1.ACCESS_ERROR);
    }
    else if (status === 404) {
        return new Error(errors_1.NOT_FOUND_ERROR);
    }
    else if (typeof data === 'string') {
        return new Error(data || errors_1.OFFLINE_ERROR);
    }
    else {
        return new Error((data && data.error) || errors_1.OFFLINE_ERROR);
    }
}
function delay(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
function observableToPromise(observable) {
    return observable.toPromise()
        .catch(({ status, error }) => {
        const text = error && error.text;
        try {
            error = JSON.parse(error);
        }
        catch { }
        const e = createError(status || 0, error);
        e.status = status;
        e.text = text;
        throw e;
    });
}
// other
function setTransformDefault(element, transform) {
    if (element) {
        element.style.transform = transform;
    }
}
function setTransformSafari(element, transform) {
    if (element) {
        element.style.webkitTransform = transform;
    }
}
exports.setTransform = (typeof document !== 'undefined' && 'transform' in document.body.style) ?
    setTransformDefault : setTransformSafari;
class ObjectCache {
    constructor(limit, ctor) {
        this.limit = limit;
        this.ctor = ctor;
        this.cache = [];
    }
    get() {
        return this.cache.pop() || this.ctor();
    }
    put(item) {
        if (this.cache.length < this.limit) {
            this.cache.push(item);
        }
    }
}
exports.ObjectCache = ObjectCache;
function bitmask(data, key) {
    if (key) {
        for (let i = 0; i < data.length; i++) {
            data[i] = data[i] ^ key;
        }
    }
    return data;
}
function isCommand(text) {
    return /^\//.test(text);
}
function processCommand(text) {
    text = text.substr(1);
    const space = text.indexOf(' ');
    const command = (space === -1 ? text : text.substr(0, space)).trim();
    const args = space === -1 ? '' : text.substr(space + 1).trim();
    return { command, args };
}
function isTouch(e) {
    return /^touch/i.test(e.type);
}
function getButton(e) {
    return ('button' in e) ? (e.button || 0) : 0;
}
function getX(e) {
    return ('touches' in e && e.touches.length > 0) ? e.touches[0].pageX : e.pageX;
}
function getY(e) {
    return ('touches' in e && e.touches.length > 0) ? e.touches[0].pageY : e.pageY;
}
function isKeyEventInvalid(e) {
    return e.target && /^(input|textarea|select)$/i.test(e.target.tagName);
}
//# sourceMappingURL=utils.js.map