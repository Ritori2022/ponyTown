"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const emoji_1 = require("../../client/emoji");
describe('emotes', () => {
    describe('findEmote()', () => {
        let appleEmoji;
        before(() => {
            appleEmoji = emoji_1.emojis.find(e => e.symbol === '🍎');
            (0, chai_1.expect)(appleEmoji).not.undefined;
        });
        it('returns found emoji by symbol', () => {
            (0, chai_1.expect)((0, emoji_1.findEmoji)('🍎')).equal(appleEmoji);
        });
        it('returns found emoji by name', () => {
            (0, chai_1.expect)((0, emoji_1.findEmoji)('apple')).equal(appleEmoji);
        });
        it('returns undefined if emoji does not exists', () => {
            (0, chai_1.expect)((0, emoji_1.findEmoji)('foobar')).undefined;
        });
    });
    describe('replaceEmotes()', () => {
        it('replaces emoji names with emojis', () => {
            (0, chai_1.expect)((0, emoji_1.replaceEmojis)(':apple:')).equal('🍎');
        });
        it('works with additional text around emoji', () => {
            (0, chai_1.expect)((0, emoji_1.replaceEmojis)('text :apple: hi')).equal('text 🍎 hi');
        });
        it('works with multiple emojis', () => {
            (0, chai_1.expect)((0, emoji_1.replaceEmojis)(':orange: text :apple: hi')).equal('🍊 text 🍎 hi');
        });
        it('does nothing if does not contain any emoji names', () => {
            (0, chai_1.expect)((0, emoji_1.replaceEmojis)('plain text')).equal('plain text');
        });
        it('does nothing if emojis are already converted', () => {
            (0, chai_1.expect)((0, emoji_1.replaceEmojis)('text 🍎 hi')).equal('text 🍎 hi');
        });
        it('does nothing if emoji name is not found', () => {
            (0, chai_1.expect)((0, emoji_1.replaceEmojis)('text :foo: hi')).equal('text :foo: hi');
        });
        it('returns empty string for undefined', () => {
            (0, chai_1.expect)((0, emoji_1.replaceEmojis)(undefined)).equal('');
        });
    });
    describe('splitEmotes()', () => {
        it('returns array for plain text', () => {
            (0, chai_1.expect)((0, emoji_1.splitEmojis)('foo bar')).eql(['foo bar']);
        });
        it('returns array for plain text', () => {
            (0, chai_1.expect)((0, emoji_1.splitEmojis)('foo 🍎 bar')).eql(['foo ', '🍎', ' bar']);
        });
    });
    describe('hasEmotes()', () => {
        it('returns true if contains emotes', () => {
            (0, chai_1.expect)((0, emoji_1.hasEmojis)('foo 🍎 bar')).true;
        });
        it('returns false if does not contain emotes', () => {
            (0, chai_1.expect)((0, emoji_1.hasEmojis)('foo bar')).false;
        });
    });
    describe('autocompleteMesssage()', () => {
        it('does nothing for empty text', () => {
            (0, chai_1.expect)((0, emoji_1.autocompleteMesssage)('', false, {})).equal('');
        });
        it('does nothing for regular text', () => {
            const state = {};
            (0, chai_1.expect)((0, emoji_1.autocompleteMesssage)('hello world', false, state)).equal('hello world');
            (0, chai_1.expect)(state).eql({});
        });
        it('autocompletes an emote', () => {
            const state = {};
            (0, chai_1.expect)((0, emoji_1.autocompleteMesssage)('hello :app', false, state)).equal('hello :apple:');
            (0, chai_1.expect)(state).eql({ lastEmoji: ':app' });
        });
        it('autocompletes considering previous autocomplete', () => {
            const state = {};
            (0, chai_1.expect)((0, emoji_1.autocompleteMesssage)('hello :a', false, state)).equal('hello :angry:');
            (0, chai_1.expect)((0, emoji_1.autocompleteMesssage)('hello :angry:', false, state)).equal('hello :apple:');
            (0, chai_1.expect)(state).eql({ lastEmoji: ':a' });
        });
        it('autocompletes with reversed order', () => {
            const state = {};
            (0, chai_1.expect)((0, emoji_1.autocompleteMesssage)('hello :b', false, state)).equal('hello :banana:');
            (0, chai_1.expect)((0, emoji_1.autocompleteMesssage)('hello :bat:', false, state)).equal('hello :black_heart:');
            (0, chai_1.expect)((0, emoji_1.autocompleteMesssage)('hello :black_heart:', true, state)).equal('hello :bat:');
            (0, chai_1.expect)(state).eql({ lastEmoji: ':b' });
        });
        it('does nothing if does not match any emoji', () => {
            const state = { lastEmoji: 'xyz' };
            (0, chai_1.expect)((0, emoji_1.autocompleteMesssage)('hello :abc', false, state)).equal('hello :abc');
        });
    });
});
//# sourceMappingURL=emoji.spec.js.map