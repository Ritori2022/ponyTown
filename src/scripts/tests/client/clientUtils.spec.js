"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const clientUtils_1 = require("../../client/clientUtils");
const utils_1 = require("../../common/utils");
const constants_1 = require("../../common/constants");
const data_1 = require("../../client/data");
const cleanNameTests = [
    [undefined, '', 'undefined'],
    ['', '', 'empty string'],
    ['rainbow dash', 'rainbow dash', 'valid name'],
    ['foo—bar', 'foo—bar', 'dash'],
    ['   pony   ', 'pony', 'trimming'],
    ['a           pony', 'a pony', 'multiple spaces'],
    ['a_po-ny(yay)[foo].,/|&#@!?aaa', 'a_po-ny(yay)[foo].,/|&#@!?aaa', 'allowed symbols'],
    ['a\t\r\npony1', 'apony1', 'other whitespace symbols'],
    ['a\u0000\u0008\u009f\u007fpony2', 'apony2', 'control'],
    ['a\u0300\u0359\u036a\u05c2\ua94fpony3', 'apony3', 'mark, nonspacing'],
    ['a\ufe00\ufe0fpony4', 'apony4', 'variation'],
    ['a▇▗pony5', 'apony5', 'blocks'],
    ['a⠟⠳⠀pony6', 'apony6', 'braile'],
    ['aᶌᶗᶭpony7', 'apony7', 'phonetic extensions'],
    ['aʰʷ〮pony8', 'apony8', 'modifiers'],
    ['aⅨⅩⅪpony9', 'apony9', 'roman numerals'],
    ['aᏅᏆᏇpony10', 'apony10', 'cherokee'],
    ['\ud800apony11', 'apony11', 'invalid unicode'],
    ['😺🦇🤡⏰', '😺🦇🤡⏰', 'emoji'],
    ['aponߦy߃߄߅13', 'apony13', 'NKo'],
    ['ap҉ony꙰14', 'apony14', 'Mark, Enclosing'],
    ['ap󠀗ony󠀩15', 'apony15', 'Tags'],
    ['apＡ＄ｚony16', 'apA$zony16', 'Romaji'],
    ['apony🖕17', 'apony17', 'filtered emoji'],
    ['[△▽△]❥Pony™✔18', '[△▽△]❥Pony™✔18', 'triangles and symbols'],
    ['ニキフォーオブ', 'ニキフォーオブ', 'allow katakana'],
    ['ﷺ	ﷻ﷽long', 'long', 'Weird long symbols'],
    ['꧁Adam', 'Adam', 'Weird symbols'],
    ['⎝Perro', 'Perro', 'weird long symbol'],
    ['aaa\u1160bbb', 'aaa bbb', 'Converts hangul space to regular space'],
    ['aaa\u3000bbb', 'aaa bbb', 'Converts ideographic space to regular space'],
    ['aaa\u3164bbb', 'aaa bbb', 'Converts hangul filler to regular space'],
    ['sắp sáng rồi', 'sắp sáng rồi', 'Vietnamese'],
    ['x\u00ady', 'xy', 'Remove soft hyphen'],
    ['a\u2800b', 'ab', 'Remove braille pattern blank'],
];
const cleanMessageTests = [
    [undefined, ''],
    ['', ''],
    ['hello', 'hello'],
    ['😺🦇🤡⏰', '😺🦇🤡⏰'], // emoji
    ['🍪🥚', '🍪🥚'], // egg
    ['a_po-ny(yay)[foo].,/|&#@!?aaa', 'a_po-ny(yay)[foo].,/|&#@!?aaa'], // allowed symbols
    ['E̸̢͕̬̹̠̘̬̲̠͖͓͂̾ͧ̈́ͮͮ̈́̄͛̉ͪͤ͒͊̏̅́͘͘R̸̴̅̌͋ͯͦ̔͊̎͊͑҉̶̪͕̳̙̦̤̞̹̀R̃͛̂ͣ͊ͤ̔', 'ERR'],
    ['ap󠀗ony󠀩15', 'apony15'], // Tags
    ['a\u0000\u0008\u009f\u007fpony2', 'apony2'], // control
    ['apＡ＄ｚony16', 'apA$zony16'], // Romaji
    ['spe｟｠｡｢｣､･￣ˊcial', 'spe｟｠｡｢｣､･￣ˊcial'], // Special
    ['ニキフォーオブ', 'ニキフォーオブ'], // allow katakana
    ['、。〃々〈〉「」『』〒〓〜〝〞〟〡〢〣〤〦〧〨〩〰〱〲〳〴〵',
        '、。〃々〈〉「」『』〒〓〜〝〞〟〡〢〣〤〦〧〨〩〰〱〲〳〴〵'], // allow special japanese/chinese characters
    ['ﷺ	ﷻ﷽long', 'long'], // Weird long symbols
    ['aaa\u1160bbb', 'aaa bbb'], // Converts hangul space to regular space
    ['aaa\u3000bbb', 'aaa bbb'], // Converts ideographic space to regular space
    ['aaa\u3164bbb', 'aaa bbb'], // Converts hangul filler to regular space
    ['aaa‐‑‒–—bbb‰‱′″‴', 'aaa‐‑‒–—bbb‰‱′″‴'], // General punctuation
    ['ققفقلسخهقسل', 'ققفقلسخهقسل'], // Arabic
    ['₠₡₢₣₤₥', '₠₡₢₣₤₥'], // Currency symbols
    ['Hi! 근데 왜-호ㅔ', 'Hi! 근데 왜-호ㅔ'], // Hangul
    ['sắp sáng rồi', 'sắp sáng rồi'], // Vietnamese
    ['דברים נראים כחולים', 'דברים נראים כחולים'], // Hebrew
    ['℀℁ℂ℃℄℅℆ℇ℈℉', '℀℁ℂ℃℄℅℆ℇ℈℉'], // Letterlike Symbols
    ['🇦🇧🇿', '🇦🇧🇿'], // regional indicators
    ['誒ㄟㄝㄍ', '誒ㄟㄝㄍ'], // Bopomofo
    ['⌂⌃⌄⌅⌆⌇', '⌂⌃⌄⌅⌆⌇'], // Technical
    ['⅐⅑⅒⅓ⅢⅣⅤ', '⅐⅑⅒⅓ⅢⅣⅤ'], // Number Forms
    ['︰︱︲︳︴︵︶', '︰︱︲︳︴︵︶'], // CJK Compatibility Forms
    ['ஐஜ', 'ஐஜ'], // Tamil
    ['߶߷߸߹', '߶߷߸߹'], // NKo
    ['ತಥದಠ', 'ತಥದಠ'], // Kannada
    ['ԳԴԵԶԷ', 'ԳԴԵԶԷ'], // Armenian
    ['Τι συμβαίνει', 'Τι συμβαίνει'], // Greek
    ['ႠႡႢႣႤႥ', 'ႠႡႢႣႤႥ'], // Georgian
    ['╣╤╥', '╣╤╥'], // Box Drawing
    ['🃉🃊🃋🃌🃍🃎🃏', '🃉🃊🃋🃌🃍🃎🃏'], // Playing Cards
    ['🀀🀁🀂🀃🀄', '🀀🀁🀂🀃🀄'], // Mahjong Tiles
    ['⡳⡣⡤⡥', '⡳⡣⡤⡥'], // Braille Patterns
    ['ऒओऔकख', 'ऒओऔकख'], // Devanagari
    ['ᐁᐂᐃᐄᐅᐆ', 'ᐁᐂᐃᐄᐅᐆ'], // Unified Canadian Aboriginal Syllabics
    ['X\u200eX', 'XX'], // Remove LEFT-TO-RIGHT MARK
    ['x\u00ady', 'xy'], // Remove soft hyphen
];
describe('clientUtils', () => {
    describe('cleanName()', () => {
        cleanNameTests.forEach(([value, expected, test]) => it(`cleans '${value}' to '${expected}' (${test})`, () => {
            (0, chai_1.expect)((0, clientUtils_1.cleanName)(value)).equal(expected);
        }));
    });
    describe('cleanMessage()', () => {
        cleanMessageTests.forEach(([value, expected], i) => it(`cleans '${value}' to '${expected}' (${i})`, () => {
            (0, chai_1.expect)((0, clientUtils_1.cleanMessage)(value)).equal(expected);
        }));
    });
    describe('toSocialSiteInfo()', () => {
        const provider = { id: 'prov', name: 'prov', color: '#123456' };
        beforeEach(() => {
            data_1.oauthProviders.push(provider);
        });
        afterEach(() => {
            (0, utils_1.removeItem)(data_1.oauthProviders, provider);
        });
        it('returns social site info', () => {
            data_1.oauthProviders.push();
            (0, chai_1.expect)((0, clientUtils_1.toSocialSiteInfo)({ id: 'foo', name: 'Foo', url: 'www.foo.com', provider: 'prov' })).eql({
                id: 'foo',
                name: 'Foo',
                url: 'www.foo.com',
                icon: 'prov',
                color: '#123456',
            });
        });
        it('return undefined icon and color for missing provider', () => {
            data_1.oauthProviders.push();
            (0, chai_1.expect)((0, clientUtils_1.toSocialSiteInfo)({ id: 'foo', name: 'Foo', url: 'www.foo.com', provider: 'non-prov' })).eql({
                id: 'foo',
                name: 'Foo',
                url: 'www.foo.com',
                icon: undefined,
                color: undefined,
            });
        });
    });
    describe('filterString()', () => {
        it('returns empty string for empty string', () => {
            (0, chai_1.expect)((0, clientUtils_1.filterString)('', () => false)).equal('');
        });
        it('returns empty string for undefined', () => {
            (0, chai_1.expect)((0, clientUtils_1.filterString)(undefined, () => false)).equal('');
        });
        it('return the same string for no filtered characters', () => {
            (0, chai_1.expect)((0, clientUtils_1.filterString)('hello', () => true)).equal('hello');
        });
        it('removes filtered characters', () => {
            (0, chai_1.expect)((0, clientUtils_1.filterString)('hello world', x => x !== 'o'.charCodeAt(0))).equal('hell wrld');
        });
        it('removes all filtered characters', () => {
            (0, chai_1.expect)((0, clientUtils_1.filterString)('hello world', () => false)).equal('');
        });
        it('removes 4 byte filtered characters', () => {
            (0, chai_1.expect)((0, clientUtils_1.filterString)('hello😺', x => x !== '😺'.codePointAt(0))).equal('hello');
        });
        it('removes invalid utf-16 characters', () => {
            (0, chai_1.expect)((0, clientUtils_1.filterString)('hello\udb40world', () => true)).equal('helloworld');
        });
    });
    describe('isSpamMessage()', () => {
        it('returns false for no last messages', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('hello', [])).false;
        });
        it('returns false for mismatching last messages', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('hello', ['boop'])).false;
        });
        it('returns false for command', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('/command', ['/command'])).false;
        });
        it('returns true for same last message', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('hello', ['hello'])).true;
        });
        it('returns true for doubled message', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('hellohello', ['hello'])).true;
        });
        it('returns true for trippled message', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('hellohellohello', ['hello'])).true;
        });
        it('returns false for really short doubled message "a"', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('aa', ['a'])).false;
        });
        it('returns false for really short doubled message "ha"', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('haha', ['ha'])).false;
        });
        it('returns false for really short doubled message "lol"', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('lollol', ['lol'])).false;
        });
        it('returns true for multiplied cut to length message message', () => {
            const message = (0, utils_1.repeat)(100, 'hello').join('').substr(0, constants_1.SAY_MAX_LENGTH);
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)(message, ['hello'])).true;
        });
        it('returns true for added one character', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('message!', ['message'])).true;
        });
        it('returns true for added two characters', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('message!!', ['message'])).true;
        });
        it('returns false for added one character if message is too short', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('ha!', ['ha'])).false;
        });
        it('returns true for added one character (in prev message)', () => {
            (0, chai_1.expect)((0, clientUtils_1.isSpamMessage)('message', ['message!'])).true;
        });
    });
});
//# sourceMappingURL=clientUtils.spec.js.map