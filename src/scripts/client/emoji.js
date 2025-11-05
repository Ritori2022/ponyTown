"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emojiNames = exports.emojiMap = exports.emojis = void 0;
exports.findEmoji = findEmoji;
exports.replaceEmojis = replaceEmojis;
exports.getEmojiImageAsync = getEmojiImageAsync;
exports.splitEmojis = splitEmojis;
exports.hasEmojis = hasEmojis;
exports.nameToHTML = nameToHTML;
exports.autocompleteMesssage = autocompleteMesssage;
const lodash_1 = require("lodash");
const canvasUtils_1 = require("./canvasUtils");
const contextSpriteBatch_1 = require("../graphics/contextSpriteBatch");
const colors_1 = require("../common/colors");
const sprites_1 = require("../generated/sprites");
const utils_1 = require("../common/utils");
exports.emojis = [
    // faces
    ['🙂', 'face', 'tiny', 'tinyface', 'slight_smile'],
    ['😵', 'derp', 'dizzy_face'],
    ['😠', 'angry'],
    ['😐', 'neutral', 'neutral_face'],
    ['😑', 'expressionless'],
    ['😆', 'laughing'],
    ['😍', 'heart_eyes'],
    ['😟', 'worried'],
    ['🤔', 'thinking'],
    ['🙃', 'upside_down'],
    ['😈', 'evil', 'smiling_imp'],
    ['👿', 'imp', 'angry_evil'],
    ['👃', 'nose', 'c'],
    // cat faces
    ['🐱', 'cat'],
    ['😺', 'smiley_cat'],
    ['😸', 'smile_cat'],
    ['😹', 'joy_cat'],
    ['😻', 'heart_eyes_cat'],
    ['😼', 'smirk_cat'],
    ['😽', 'kissing_cat'],
    ['🙀', 'scream_cat'],
    ['😿', 'cryingcat', 'crying_cat_face'],
    ['😾', 'pouting_cat'],
    // hearts
    ['❤', 'heart'],
    ['💙', 'blue_heart', 'meno'],
    ['💚', 'green_heart', 'chira'],
    ['💛', 'yellow_heart'],
    ['💜', 'purple_heart'],
    ['🖤', 'black_heart', 'shino'],
    ['💔', 'broken_heart'],
    ['💖', 'sparkling_heart'],
    ['💗', 'heartpulse'],
    ['💕', 'two_hearts'],
    // food / objects
    ['🥌', 'rock', 'stone'],
    ['🍕', 'pizza'],
    ['🍎', 'apple'],
    ['🍏', 'gapple', 'green_apple'],
    ['🍊', 'orange', 'tangerine'],
    ['🍐', 'pear'],
    ['🥭', 'mango'],
    ['🥕', 'carrot'],
    ['🍇', 'grapes'],
    ['🍌', 'banana'],
    ['⛏', 'pick'],
    ['🥚', 'egg'],
    ['💮', 'flower', 'white_flower'],
    ['🌸', 'cherry_blossom'],
    ['🍬', 'candy'],
    ['🍡', 'candy_cane'],
    ['🍭', 'lollipop'],
    ['⭐', 'star'],
    ['🌟', 'star2'],
    ['🌠', 'shooting_star'],
    ['⚡', 'zap'],
    ['❄', 'snow', 'snowflake'],
    ['⛄', 'snowpony', 'snowman'],
    ['🏀', 'pumpkin'],
    ['🎃', 'jacko', 'jack_o_lantern'],
    ['🌲', 'evergreen_tree', 'pinetree'],
    ['🎄', 'christmas_tree'],
    ['🕯', 'candle'],
    ['🎅', 'santa_hat', 'santa_claus'],
    ['💐', 'holly'],
    ['🌿', 'mistletoe'],
    ['🎲', 'die', 'dice', 'game_die'],
    ['✨', 'sparkles'],
    ['🎁', 'gift', 'present'],
    ['🔥', 'fire'],
    ['🎵', 'musical_note'],
    ['🎶', 'notes'],
    ['🌈', 'rainbow'],
    ['🐾', 'feet', 'paw', 'paws'],
    ['👑', 'crown'],
    ['💎', 'gem'],
    ['☘', 'shamrock', 'clover'],
    ['🍀', 'four_leaf_clover'],
    ['🍪', 'cookie'],
    // animals
    ['🦋', 'butterfly'],
    ['🦇', 'bat'],
    ['🕷', 'spider'],
    ['👻', 'ghost'],
    ['🐈', 'cat2'],
    // other
    ['™', 'tm'],
    ['♂', 'male'],
    ['♀', 'female'],
    ['⚧', 'trans', 'transgender'],
].map(createEmoji);
exports.emojiMap = new Map();
exports.emojiNames = exports.emojis.slice().sort().map(e => `:${e.names[0]}:`);
exports.emojis.forEach(e => e.names.forEach(name => exports.emojiMap.set(`:${name}:`, e.symbol)));
function findEmoji(name) {
    return exports.emojis.find(e => name === e.symbol || (0, utils_1.includes)(e.names, name));
}
function replaceEmojis(text) {
    return (text || '').replace(/:[a-z0-9_]+:/ig, match => exports.emojiMap.get(match) || match);
}
function createEmoji([symbol, ...names]) {
    return { symbol, names: [...names, ...names.filter(n => /_/.test(n)).map(n => n.replace(/_/g, ''))] };
}
const emojiImages = new Map();
const emojiImagePromises = new Map();
function getEmojiImageAsync(sprite, callback) {
    const src = emojiImages.get(sprite);
    if (src) {
        callback(src);
        return;
    }
    const promise = emojiImagePromises.get(sprite);
    if (promise) {
        promise.then(callback);
        return;
    }
    const width = sprite.w + sprite.ox;
    // const height = sprite.h + sprite.oy;
    const canvas = (0, contextSpriteBatch_1.drawCanvas)(width, 10, sprites_1.normalSpriteSheet, undefined, batch => batch.drawSprite(sprite, colors_1.WHITE, 0, 0));
    const newPromise = (0, canvasUtils_1.canvasToSource)(canvas);
    emojiImagePromises.set(sprite, newPromise);
    newPromise
        .then(src => {
        emojiImages.set(sprite, src);
        emojiImagePromises.delete(sprite);
        return src;
    })
        .then(callback);
}
const emojisRegex = new RegExp(`(${[
    ...exports.emojis.map(e => e.symbol),
    '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎',
].join('|')})`, 'g');
function splitEmojis(text) {
    return text.split(emojisRegex);
}
function hasEmojis(text) {
    return emojisRegex.test(text);
}
function nameToHTML(name) {
    return (0, lodash_1.escape)(name);
}
const names = exports.emojiNames.slice().sort();
function autocompleteMesssage(message, shift, state) {
    return message.replace(/:[a-z0-9_]+:?$/, match => {
        state.lastEmoji = state.lastEmoji || match;
        const matches = names.filter(e => e.indexOf(state.lastEmoji) === 0);
        const index = matches.indexOf(match);
        const offset = index === -1 ? 0 : (index + matches.length + (shift ? -1 : 1)) % matches.length;
        return matches[offset] || match;
    });
}
//# sourceMappingURL=emoji.js.map