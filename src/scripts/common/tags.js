"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyTag = void 0;
exports.getAllTags = getAllTags;
exports.getTag = getTag;
exports.getTagPalette = getTagPalette;
exports.canUseTag = canUseTag;
exports.getAvailableTags = getAvailableTags;
const accountUtils_1 = require("./accountUtils");
const colors_1 = require("./colors");
const placeholder = { id: '', tagClass: '', label: '' };
const tags = {
    'mod': { ...placeholder, name: 'moderator', className: 'mod', color: colors_1.MOD_COLOR },
    'dev': { ...placeholder, name: 'developer', className: 'dev', color: colors_1.ADMIN_COLOR },
    'dev:art': { ...placeholder, name: 'dev artist', className: 'dev', color: colors_1.ADMIN_COLOR },
    'dev:music': { ...placeholder, name: 'dev musician', className: 'dev', color: colors_1.ADMIN_COLOR },
    'sup1': { ...placeholder, name: 'supporter', className: 'sup1', color: colors_1.PATREON_COLOR },
    'sup2': { ...placeholder, name: 'supporter', className: 'sup2', color: colors_1.WHITE },
    'sup3': { ...placeholder, name: 'supporter', className: 'sup3', color: colors_1.WHITE },
    'hidden': { ...placeholder, name: 'hidden', className: 'hidden', color: colors_1.ANNOUNCEMENT_COLOR },
};
Object.keys(tags).forEach(id => {
    const tag = tags[id];
    tag.id = id;
    tag.label = `<${tag.name.toUpperCase()}>`;
    tag.tagClass = `tag-${tag.className}`;
});
exports.emptyTag = { id: '', name: 'no tag', label: '', className: '', tagClass: '', color: 0 };
function getAllTags() {
    return Object.keys(tags).map(key => tags[key]);
}
function getTag(id) {
    return id ? tags[id] : undefined;
}
function getTagPalette(tag, palettes) {
    switch (tag.id) {
        case 'sup2': return palettes.supporter2;
        case 'sup3': return palettes.supporter3;
        default: return palettes.white;
    }
}
function canUseTag(account, tag) {
    if (tag === 'mod') {
        return (0, accountUtils_1.hasRole)(account, 'mod');
    }
    else if (tag === 'dev' || /^dev:/.test(tag)) {
        return (0, accountUtils_1.hasRole)(account, 'dev');
    }
    else {
        return false;
    }
}
function getAvailableTags(account) {
    return getAllTags().filter(tag => canUseTag(account, tag.id));
}
//# sourceMappingURL=tags.js.map