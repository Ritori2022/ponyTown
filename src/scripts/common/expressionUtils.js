"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.horizontalEyesRight = exports.horizontalEyesLeft = exports.horizontalMuzzles = exports.verticalEyesLeft = exports.verticalEyesRight = exports.muzzlesLeft = exports.muzzlesRight = exports.TWO_LETTER_WORDS = exports.THREE_LETTER_WORDS = void 0;
exports.expression = expression;
exports.matchExpression = matchExpression;
exports.parseExpression = parseExpression;
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
const double = (items) => items.map(x => x + x);
const prefix = (items, fix) => items.map(x => fix + x);
const suffix = (items, fix) => items.map(x => x + fix);
exports.THREE_LETTER_WORDS = [
    'ace', 'act', 'ama', 'amp', 'amo', 'amu', 'amy', 'ana', 'ane', 'and', 'ant', 'any', 'ape', 'app', 'apo',
    'apt', 'ava', 'ave', 'avo', 'awe', 'awn', 'awp', 'axe',
    'boa', 'bob', 'bod', 'bog', 'bon', 'boo', 'bop', 'bot', 'boy', 'bub', 'bud', 'bug', 'bup', 'but', 'bun', 'buy',
    'dad', 'doe', 'dog', 'dot', 'doy', 'dna', 'dub', 'dud', 'due', 'dun', 'dug', 'duo', 'dup', 'dva', 'dvd',
    'eco', 'ecu', 'eme', 'emu', 'emo', 'eon', 'end', 'eng', 'eva', 'eve', 'exe', 'exp',
    'gnu', 'goa', 'god', 'gog', 'gon', 'goo', 'got', 'gud', 'gut', 'gun', 'guv', 'guy',
    'nnn', 'nog', 'non', 'noo', 'nop', 'not', 'nun', 'nut', 'nub',
    'oca', 'omo', 'one', 'ooo', 'oot', 'ope', 'opt', 'oud', 'out', 'ova', 'owe', 'own', 'oxo', 'oxe', 'omg',
    'pay', 'pnp', 'pod', 'pon', 'poo', 'pop', 'pot', 'pov', 'ppp', 'pub', 'pud', 'pug', 'pup', 'pun', 'put', 'pvp',
    'qqq', 'que', 'qua',
    'tnt', 'ton', 'top', 'tod', 'toe', 'tog', 'too', 'toy', 'tub', 'tug', 'tun', 'twa', 'two',
    'uuu', 'una', 'und', 'uno', 'ump', 'upo', 'uva',
    'voe', 'voy', 'vpn', 'vug', 'vvv',
    'yay', 'yob', 'yod', 'yon', 'you', 'yup',
];
exports.TWO_LETTER_WORDS = [
    'ox', 'ex', 'by', 'my', 'up', 'of', 'if', 'me', 'ow', 'am', 'we', 'uh', 'um', 'be', 'em', 'bi', 'oh',
    'go', 'eh', 'ah', 'ye', 'ya', 'he', 'hi', 'ho', 'ha', 'yo', 'us', 'on', 'id', 'an', 'do', 'no',
    'as', 'at', 'it', 'is', 'or', 'so', 'to', 'pc',
];
const threeLetterWords = new RegExp(`^(${exports.THREE_LETTER_WORDS.join('|')})$`);
const twoLetterWords = new RegExp(`^(${exports.TWO_LETTER_WORDS.join('|')})$`);
// vertical :)
const smilesRight = [')', ']', '}', '>'];
const smilesLeft = ['(', '[', '{', '<', 'C', 'c'];
const flatBoth = ['|', 'i', 'l'];
const concernedBoth = ['/', '\\', 's', 'S', '?'];
const muzzlesBoth = [
    [3 /* Muzzle.Scrunch */, 't', 'T', 'I'],
    [4 /* Muzzle.Blep */, 'P', 'p', 'd'],
    [25 /* Muzzle.FlatBlep */, 'b'],
    [6 /* Muzzle.Flat */, ...flatBoth],
    [7 /* Muzzle.Concerned */, ...concernedBoth],
    [8 /* Muzzle.ConcernedOpen */, '0', 'v'],
    [12 /* Muzzle.ConcernedOpen2 */, 'O'],
    [24 /* Muzzle.Oh */, 'o'],
    [13 /* Muzzle.Kiss */, '*', 'x', 'X'],
    [23 /* Muzzle.NeutralPant */, 'L'],
    [22 /* Muzzle.SmilePant */, 'Q'],
    [10 /* Muzzle.FrownOpen */, 'V'],
    [11 /* Muzzle.NeutralOpen2 */, 'u', 'n'],
    [15 /* Muzzle.NeutralOpen3 */, 'U'],
    [20 /* Muzzle.NeutralTeeth */, ...double(flatBoth)],
    [21 /* Muzzle.ConcernedTeeth */, ...double(concernedBoth)],
];
exports.muzzlesRight = createMap([
    ...muzzlesBoth,
    [0 /* Muzzle.Smile */, '3', ...smilesRight],
    [1 /* Muzzle.Frown */, ...smilesLeft],
    [5 /* Muzzle.SmileOpen */, 'D'],
    [9 /* Muzzle.SmileOpen2 */, 'DD'],
    [14 /* Muzzle.SmileOpen3 */, 'DDD'],
    [18 /* Muzzle.SmileTeeth */, ...double(smilesRight)],
    [19 /* Muzzle.FrownTeeth */, ...double(smilesLeft)],
]);
exports.muzzlesLeft = createMap([
    ...muzzlesBoth,
    [0 /* Muzzle.Smile */, ...smilesLeft],
    [1 /* Muzzle.Frown */, ...smilesRight],
    [12 /* Muzzle.ConcernedOpen2 */, 'D'],
    [16 /* Muzzle.ConcernedOpen3 */, 'DD', 'DDD'],
    [18 /* Muzzle.SmileTeeth */, ...double(smilesLeft)],
    [19 /* Muzzle.FrownTeeth */, ...double(smilesRight)],
]);
const neutralEyes = [';', ':', '=', '%', '8'];
const verticalEyesBoth = [
    [1 /* Eye.Neutral */, ...neutralEyes],
    [23 /* Eye.X */, 'X', 'x'],
    [3 /* Eye.Neutral3 */, 'B'],
    [11 /* Eye.Lines */, '|'],
];
exports.verticalEyesRight = createMap([
    ...verticalEyesBoth,
    [19 /* Eye.Angry */, ...prefix(neutralEyes, '>')],
    [20 /* Eye.Angry2 */, '>B'],
    [15 /* Eye.Sad */, ...prefix(neutralEyes, '<')],
    [16 /* Eye.Sad2 */, '<B'],
    [7 /* Eye.Frown */, ...prefix(neutralEyes, '|')],
    [8 /* Eye.Frown2 */, '|B'],
]);
exports.verticalEyesLeft = createMap([
    ...verticalEyesBoth,
    [19 /* Eye.Angry */, ...suffix(neutralEyes, '<')],
    [15 /* Eye.Sad */, ...suffix(neutralEyes, '>')],
    [7 /* Eye.Frown */, ...suffix(neutralEyes, '|')],
]);
// horizontal -_-
exports.horizontalMuzzles = createMap([
    [0 /* Muzzle.Smile */, 'c', 'C', 'v', 'V', 'u', 'U', 'w', 'W', '👃'],
    [22 /* Muzzle.SmilePant */, 'Q', 'P'],
    [1 /* Muzzle.Frown */, 'n', 'm', '^'],
    [2 /* Muzzle.Neutral */, '-', '//'],
    [23 /* Muzzle.NeutralPant */, 'q', 'p'],
    [6 /* Muzzle.Flat */, '_'],
    [13 /* Muzzle.Kiss */, '.', ',', '*', 'x', 'X', '3'],
    [7 /* Muzzle.Concerned */, '~'],
    [8 /* Muzzle.ConcernedOpen */, 'o'],
    [12 /* Muzzle.ConcernedOpen2 */, 'A', 'O', '0'],
]);
const horizontalEyes = [
    [1 /* Eye.Neutral */, `'`, '.', '0', '°', 'o', 'O', 'e', 'g', '9', '6', 'd', 'b'],
    [4 /* Eye.Neutral4 */, '='],
    [6 /* Eye.Closed */, '-', 'v', 'V', 'u', 'U', 'y', 'Y'],
    [14 /* Eye.ClosedHappy */, 'n'],
    [13 /* Eye.ClosedHappy2 */, '^'],
    [15 /* Eye.Sad */, 'q', 'Q', 'p', 'P', ';', ':', ','],
    [21 /* Eye.Peaceful */, 't', 'T'],
    [7 /* Eye.Frown */, 'ô', 'Ô', 'õ', 'Õ', 'ō', 'Ō', 'ŏ', 'Ŏ'],
    [8 /* Eye.Frown2 */, 'a'],
];
exports.horizontalEyesLeft = createMap([
    ...horizontalEyes,
    [2 /* Eye.Neutral2 */, '>'],
    [23 /* Eye.X */, '<'],
    [15 /* Eye.Sad */, 'ò', 'Ò'],
    [19 /* Eye.Angry */, 'ó', 'Ó'],
]);
exports.horizontalEyesRight = createMap([
    ...horizontalEyes,
    [2 /* Eye.Neutral2 */, '<'],
    [23 /* Eye.X */, '>'],
    [15 /* Eye.Sad */, 'ó', 'Ó'],
    [19 /* Eye.Angry */, 'ò', 'Ò'],
]);
const horizontalIrises = createMap([
    [1 /* Iris.Up */, '9'],
    [4 /* Iris.UpLeft */, 'e'],
    [5 /* Iris.UpRight */, 'g'],
    [3 /* Iris.Right */, '<', 'd'],
    [2 /* Iris.Left */, '>', 'b'],
]);
const muzzleToEye = [];
muzzleToEye[1 /* Muzzle.Frown */] = 15 /* Eye.Sad */;
muzzleToEye[10 /* Muzzle.FrownOpen */] = 15 /* Eye.Sad */;
muzzleToEye[12 /* Muzzle.ConcernedOpen2 */] = 15 /* Eye.Sad */;
muzzleToEye[16 /* Muzzle.ConcernedOpen3 */] = 15 /* Eye.Sad */;
const neutralToSmile = [];
neutralToSmile[8 /* Muzzle.ConcernedOpen */] = 9 /* Muzzle.SmileOpen2 */;
neutralToSmile[12 /* Muzzle.ConcernedOpen2 */] = 14 /* Muzzle.SmileOpen3 */;
function any(obj) {
    return `(${Object.keys(obj).map(lodash_1.escapeRegExp).join('|')})`;
}
const bigEyes = /[O0ÒÓÔÕŌŎQ]/;
const cryingEye = /[;pqPQTyY]/;
const tears = "(['`,]?)";
const tearsRegex = /['`,]/;
const verticalRightRegex = new RegExp(`^${any(exports.verticalEyesRight)}${tears}-?${any(exports.muzzlesRight)}$`);
const verticalLeftRegex = new RegExp(`^${any(exports.muzzlesLeft)}-?${tears}${any(exports.verticalEyesLeft)}$`);
const horizontalRegex = new RegExp(`^${any(exports.horizontalEyesRight)}(//)?${any(exports.horizontalMuzzles)}(//)?${any(exports.horizontalEyesLeft)}$`);
function matchVertical(text, regex, flip, muzzleMap, eyesMap) {
    if (/^([|]{2,}|BS|8x|x8|x-?x|\d+)$/i.test(text))
        return undefined;
    const match = regex.exec(text);
    if (!match)
        return undefined;
    const eyesStr = flip ? match[3] : match[1];
    const muzzleStr = flip ? match[1] : match[3];
    const muzzle = muzzleMap[muzzleStr];
    const veye = eyesMap[eyesStr];
    const eye = veye === 1 /* Eye.Neutral */ && !/[OV]/.test(muzzleStr) ? (muzzleToEye[muzzle] || veye) : veye;
    const blink = /;/.test(eyesStr);
    const tear = blink && muzzleToEye[muzzle] === 15 /* Eye.Sad */;
    const left = tear ? (/[<>]/.test(eyesStr) ? eye : 16 /* Eye.Sad2 */) : (blink && flip ? 6 /* Eye.Closed */ : eye);
    const right = tear ? (/[<>]/.test(eyesStr) ? eye : 16 /* Eye.Sad2 */) : (blink && !flip ? 6 /* Eye.Closed */ : eye);
    const shocked = /8/.test(eyesStr);
    const rightIris = shocked ? 6 /* Iris.Shocked */ : 0 /* Iris.Forward */;
    const leftIris = shocked ? 6 /* Iris.Shocked */ : (/%/.test(eyesStr) ? 1 /* Iris.Up */ : 0 /* Iris.Forward */);
    const extra = (tearsRegex.test(match[2]) || tear) ? 8 /* ExpressionExtra.Tears */ : 0 /* ExpressionExtra.None */;
    return { right, left, muzzle, rightIris, leftIris, extra };
}
function matchHorizontal(text) {
    if (/\.\.|--|vv|uu|qq|pp|nn|^\d+$/i.test(text)) {
        return undefined;
    }
    if (/[a-zA-Z][a-z][a-z]|[A-Z]{3}/.test(text)) {
        const clear = text.replace(/[^a-z]/ig, '').toLowerCase();
        if (clear.length === 3 && threeLetterWords.test(clear)) {
            return undefined;
        }
    }
    if (/[a-z][a-z][.,*-]/i.test(text)) {
        const clear = text.replace(/[^a-z]/ig, '').toLowerCase();
        if (clear.length === 2 && twoLetterWords.test(clear)) {
            return undefined;
        }
    }
    const match = horizontalRegex.exec(text);
    if (!match) {
        return undefined;
    }
    const [, rightStr, rightBlush, muzzleStr, leftBlush, leftStr] = match;
    if ((rightBlush || leftBlush) && rightBlush !== leftBlush) {
        return undefined;
    }
    const leftEye = exports.horizontalEyesLeft[leftStr];
    const rightEye = exports.horizontalEyesRight[rightStr];
    const muzzle = exports.horizontalMuzzles[muzzleStr];
    const same = rightStr === leftStr;
    const lookingToSide = same && /[<>]/.test(rightStr);
    const shocked = bigEyes.test(leftStr) && bigEyes.test(rightStr) && rightStr !== '0' && leftStr !== '0';
    const lookingDown = (same && rightStr === '6') || (rightStr === 'b' && leftStr === 'd');
    const unamused = !lookingDown && same && rightStr === '-' && /[.,_]/.test(muzzleStr);
    const left = (lookingToSide || (leftStr === 'o' && bigEyes.test(rightStr))) ? 2 /* Eye.Neutral2 */ : leftEye;
    const right = (lookingToSide || (rightStr === 'o' && bigEyes.test(leftStr))) ? 2 /* Eye.Neutral2 */ : rightEye;
    const blush = /[/][/]/.test(muzzleStr) || (rightBlush && rightBlush === leftBlush);
    const cry = cryingEye.test(leftStr) || cryingEye.test(rightStr);
    return {
        left: unamused ? 8 /* Eye.Frown2 */ : left,
        right: unamused ? 8 /* Eye.Frown2 */ : right,
        muzzle: same && (leftEye === 14 /* Eye.ClosedHappy */ || leftEye === 13 /* Eye.ClosedHappy2 */) ? (neutralToSmile[muzzle] || muzzle) : muzzle,
        rightIris: lookingDown ? 7 /* Iris.Down */ : (shocked ? 6 /* Iris.Shocked */ : (horizontalIrises[rightStr] || 0 /* Iris.Forward */)),
        leftIris: lookingDown ? 7 /* Iris.Down */ : (shocked ? 6 /* Iris.Shocked */ : (horizontalIrises[leftStr] || 0 /* Iris.Forward */)),
        extra: (blush ? 1 /* ExpressionExtra.Blush */ : 0 /* ExpressionExtra.None */) | (cry ? 4 /* ExpressionExtra.Cry */ : 0 /* ExpressionExtra.None */),
    };
}
function expression(right, left, muzzle, rightIris = 0 /* Iris.Forward */, leftIris = 0 /* Iris.Forward */, extra = 0 /* ExpressionExtra.None */) {
    return { right, left, muzzle, rightIris, leftIris, extra };
}
const constants = (0, utils_1.createPlainMap)({
    '^^': () => expression(13 /* Eye.ClosedHappy2 */, 13 /* Eye.ClosedHappy2 */, 0 /* Muzzle.Smile */),
    '))': () => expression(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 0 /* Muzzle.Smile */),
    '((': () => expression(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 1 /* Muzzle.Frown */),
    '>>': () => expression(2 /* Eye.Neutral2 */, 2 /* Eye.Neutral2 */, 6 /* Muzzle.Flat */, 2 /* Iris.Left */, 2 /* Iris.Left */),
    '<<': () => expression(2 /* Eye.Neutral2 */, 2 /* Eye.Neutral2 */, 6 /* Muzzle.Flat */, 3 /* Iris.Right */, 3 /* Iris.Right */),
    '🙂': () => expression(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 0 /* Muzzle.Smile */),
    '😵': () => expression(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 0 /* Muzzle.Smile */, 1 /* Iris.Up */, 0 /* Iris.Forward */),
    '😐': () => expression(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 6 /* Muzzle.Flat */),
    '😑': () => expression(11 /* Eye.Lines */, 11 /* Eye.Lines */, 6 /* Muzzle.Flat */),
    '😆': () => expression(23 /* Eye.X */, 23 /* Eye.X */, 5 /* Muzzle.SmileOpen */),
    '😟': () => expression(15 /* Eye.Sad */, 15 /* Eye.Sad */, 2 /* Muzzle.Neutral */),
    '😠': () => expression(19 /* Eye.Angry */, 19 /* Eye.Angry */, 0 /* Muzzle.Smile */),
    '🤔': () => expression(1 /* Eye.Neutral */, 8 /* Eye.Frown2 */, 13 /* Muzzle.Kiss */),
    '😈': () => expression(19 /* Eye.Angry */, 19 /* Eye.Angry */, 0 /* Muzzle.Smile */, 1 /* Iris.Up */, 0 /* Iris.Forward */),
    '👿': () => expression(19 /* Eye.Angry */, 19 /* Eye.Angry */, 18 /* Muzzle.SmileTeeth */),
});
function matchOther(text) {
    if (/^A{5,}\.*$/.test(text)) {
        return expression(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 16 /* Muzzle.ConcernedOpen3 */, 6 /* Iris.Shocked */, 6 /* Iris.Shocked */);
    }
    else if (/^a{5,}\.*$/.test(text)) {
        return expression(1 /* Eye.Neutral */, 1 /* Eye.Neutral */, 16 /* Muzzle.ConcernedOpen3 */);
    }
    else if (/^z{3,}\.*$/i.test(text)) {
        return expression(6 /* Eye.Closed */, 6 /* Eye.Closed */, 2 /* Muzzle.Neutral */);
    }
    else {
        return constants[text] && constants[text]();
    }
}
function matchExpression(text) {
    if (/тот/ui.test(text)) {
        return undefined;
    }
    text = replaceRussian(text)
        .replace(/D{4,}/, 'DDD')
        .replace(/\\/g, '/')
        .replace(/\/{3,}/g, '//');
    return matchVertical(text, verticalRightRegex, false, exports.muzzlesRight, exports.verticalEyesRight)
        || matchVertical(text, verticalLeftRegex, true, exports.muzzlesLeft, exports.verticalEyesLeft)
        || matchHorizontal(text)
        || matchOther(text);
}
function parseExpression(text) {
    const emoteMatch = /(?:^| )(\S+)\s*$/.exec(text);
    const emote = emoteMatch && emoteMatch[1].trim();
    return emote ? matchExpression(emote) : undefined;
}
function createMap(values) {
    return values.reduce((obj, [exp, ...values]) => (values.forEach(v => obj[v] = exp), obj), Object.create(null));
}
const charMap = (0, utils_1.createPlainMap)({
    'З': '3', 'з': '3', 'Э': '3', 'э': '3',
    'А': 'A', 'а': 'a', 'Д': 'A', 'д': 'A',
    'В': 'B', 'в': 'B',
    'Г': 'L',
    'М': 'M', 'м': 'M',
    'О': 'O', 'о': 'o',
    'П': 'n', 'п': 'n',
    'Р': 'P', 'р': 'p',
    'С': 'C', 'с': 'c',
    'Т': 'T', 'т': 'T',
    'Х': 'X', 'х': 'x',
    'Ш': 'W', 'ш': 'w',
    'Ь': 'b', 'ь': 'b',
    'е': 'e',
    'у': 'y', 'У': 'Y',
});
const charRegex = new RegExp(`[${Object.keys(charMap).join('')}]`, 'g');
function mapChar(x) {
    return charMap[x];
}
function replaceRussian(text) {
    return text.replace(charRegex, mapChar);
}
//# sourceMappingURL=expressionUtils.js.map