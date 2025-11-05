"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const htmlUtils_1 = require("../../client/htmlUtils");
const utils_1 = require("../../common/utils");
class MockHTMLElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.nodeType = 'element';
        this.children = [];
        this.events = {};
        this.attributes = {};
    }
    get firstChild() {
        return this.children[0];
    }
    get lastChild() {
        return this.children[this.children.length - 1];
    }
    setAttribute(key, value) {
        this.attributes[key] = value;
    }
    addEventListener(key, callback) {
        this.events[key] = callback;
    }
    appendChild(node) {
        this.children.push(node);
    }
    removeChild(node) {
        (0, utils_1.removeItem)(this.children, node);
    }
}
class MockTextNode {
    constructor(nodeValue) {
        this.nodeValue = nodeValue;
    }
}
describe('htmlUtils', () => {
    let querySelectorAll;
    beforeEach(() => {
        querySelectorAll = (0, sinon_1.stub)();
        global.document = {
            createElement(tagName) {
                return new MockHTMLElement(tagName);
            },
            createTextNode(value) {
                return new MockTextNode(value);
            },
            querySelectorAll,
        };
    });
    afterEach(() => {
        delete global.document;
    });
    describe('createHtmlNodes()', () => {
        it('creates single text node with given text', () => {
            const nodes = (0, htmlUtils_1.createHtmlNodes)('foo bar', 1);
            (0, chai_1.expect)(nodes.length).equal(1);
            (0, chai_1.expect)(nodes[0]).instanceof(MockTextNode);
            (0, chai_1.expect)(nodes[0].nodeValue).equal('foo bar');
        });
        it('creates empty array for empty text', () => {
            const nodes = (0, htmlUtils_1.createHtmlNodes)('', 1);
            (0, chai_1.expect)(nodes.length).equal(0);
        });
    });
    describe('textNode()', () => {
        it('creates new text node', () => {
            const node = (0, htmlUtils_1.textNode)('foo');
            (0, chai_1.expect)(node).instanceof(MockTextNode);
            (0, chai_1.expect)(node.nodeValue).equal('foo');
        });
    });
    describe('element()', () => {
        it('creates new HTML element', () => {
            const div = (0, htmlUtils_1.element)('div', 'foo-bar');
            (0, chai_1.expect)(div).instanceof(MockHTMLElement);
            (0, chai_1.expect)(div.tagName).equal('div');
        });
        it('sets class name', () => {
            const div = (0, htmlUtils_1.element)('div', 'foo-bar');
            (0, chai_1.expect)(div.className).equal('foo-bar');
        });
        it('sets attribute values', () => {
            const div = (0, htmlUtils_1.element)('div', undefined, undefined, { foo: 'bar', test: 'boo' });
            (0, chai_1.expect)(div.attributes).eql({ foo: 'bar', test: 'boo' });
        });
        it('sets event listeners', () => {
            const click = () => { };
            const touch = () => { };
            const div = (0, htmlUtils_1.element)('div', undefined, undefined, undefined, { click, touch });
            (0, chai_1.expect)(div.events.click).equal(click);
            (0, chai_1.expect)(div.events.touch).equal(touch);
        });
        it('appends child nodes', () => {
            const a = (0, htmlUtils_1.element)('a');
            const b = (0, htmlUtils_1.element)('b');
            const div = (0, htmlUtils_1.element)('div', undefined, [a, b]);
            (0, chai_1.expect)(div.children[0]).equal(a);
            (0, chai_1.expect)(div.children[1]).equal(b);
        });
        it('skips undefined nodes when appending child nodes', () => {
            const a = (0, htmlUtils_1.element)('a');
            const b = (0, htmlUtils_1.element)('b');
            const div = (0, htmlUtils_1.element)('div', undefined, [a, undefined, b]);
            (0, chai_1.expect)(div.children[0]).equal(a);
            (0, chai_1.expect)(div.children[1]).equal(b);
        });
    });
    describe('removeAllNodes()', () => {
        it('removes all child nodes from element', () => {
            const div = (0, htmlUtils_1.element)('div', undefined, [(0, htmlUtils_1.element)('a'), (0, htmlUtils_1.element)('b')]);
            (0, htmlUtils_1.removeAllNodes)(div);
            (0, chai_1.expect)(div.children).eql([]);
        });
        it('does nothing for no child nodes', () => {
            const div = (0, htmlUtils_1.element)('div', undefined, []);
            (0, htmlUtils_1.removeAllNodes)(div);
            (0, chai_1.expect)(div.children).eql([]);
        });
    });
    describe('removeFirstChild()', () => {
        it('removes all child nodes from element', () => {
            const a = (0, htmlUtils_1.element)('a');
            const b = (0, htmlUtils_1.element)('b');
            const div = (0, htmlUtils_1.element)('div', undefined, [a, b]);
            (0, htmlUtils_1.removeFirstChild)(div);
            (0, chai_1.expect)(div.children.length).equal(1);
            (0, chai_1.expect)(div.children[0]).equal(b);
        });
        it('does nothing for no child nodes', () => {
            const div = (0, htmlUtils_1.element)('div', undefined, []);
            (0, htmlUtils_1.removeFirstChild)(div);
            (0, chai_1.expect)(div.children).eql([]);
        });
    });
    describe('replaceNodes()', () => {
        it('adds new child nodes', () => {
            const div = (0, htmlUtils_1.element)('div', undefined, []);
            (0, htmlUtils_1.replaceNodes)(div, 'foo bar');
            (0, chai_1.expect)(div.children.length).equal(1);
            (0, chai_1.expect)(div.children[0]).instanceof(MockTextNode);
            (0, chai_1.expect)(div.children[0].nodeValue).equal('foo bar');
        });
        it('removes all but first node', () => {
            const a = (0, htmlUtils_1.textNode)('a');
            const b = (0, htmlUtils_1.textNode)('b');
            const div = (0, htmlUtils_1.element)('div', undefined, [a, b]);
            (0, htmlUtils_1.replaceNodes)(div, 'foo bar');
            (0, chai_1.expect)(div.children.length).equal(1);
            (0, chai_1.expect)(div.children[0]).equal(a);
            (0, chai_1.expect)(div.children[0].nodeValue).equal('foo bar');
        });
    });
    describe('findParentElement()', () => {
        it('returns matched parent element', () => {
            const div1 = (0, htmlUtils_1.element)('div');
            const div2 = (0, htmlUtils_1.element)('div');
            div1.parentElement = div2;
            querySelectorAll.withArgs('foo > bar').returns([div2]);
            (0, chai_1.expect)((0, htmlUtils_1.findParentElement)(div1, 'foo > bar')).equal(div2);
        });
        it('returns matched parent element', () => {
            const div1 = (0, htmlUtils_1.element)('div');
            const div2 = (0, htmlUtils_1.element)('div');
            const div3 = (0, htmlUtils_1.element)('div');
            div1.parentElement = div2;
            div2.parentElement = div3;
            querySelectorAll.withArgs('foo > bar').returns([div3]);
            (0, chai_1.expect)((0, htmlUtils_1.findParentElement)(div1, 'foo > bar')).equal(div3);
        });
    });
});
//# sourceMappingURL=htmlUtils.spec.js.map