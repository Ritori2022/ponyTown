"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHtmlNodes = createHtmlNodes;
exports.textNode = textNode;
exports.element = element;
exports.appendAllNodes = appendAllNodes;
exports.removeAllNodes = removeAllNodes;
exports.removeFirstChild = removeFirstChild;
exports.removeElement = removeElement;
exports.replaceNodes = replaceNodes;
exports.findParentElement = findParentElement;
exports.findFocusableElements = findFocusableElements;
exports.focusFirstElement = focusFirstElement;
exports.focusElement = focusElement;
exports.focusElementAfterTimeout = focusElementAfterTimeout;
exports.isParentOf = isParentOf;
exports.showTextInNewTab = showTextInNewTab;
exports.addStyle = addStyle;
const emoji_1 = require("./emoji");
const fonts_1 = require("./fonts");
const spriteFont_1 = require("../graphics/spriteFont");
function createHtmlNodes(value, scale) {
    return value ? (0, emoji_1.splitEmojis)(value).map(x => {
        const sprite = (0, emoji_1.hasEmojis)(x) && fonts_1.font && (0, spriteFont_1.getCharacterSprite)(x, fonts_1.font);
        if (sprite) {
            const emote = (0, emoji_1.findEmoji)(x);
            const img = document.createElement('img');
            img.className = 'pixelart';
            img.style.display = 'inline-block';
            img.style.visibility = 'hidden';
            img.style.width = `${(sprite.w + sprite.ox) * scale}px`;
            img.style.height = `${10 * scale}px`;
            if (emote) {
                img.setAttribute('aria-label', emote.names[0]);
            }
            (0, emoji_1.getEmojiImageAsync)(sprite, src => {
                img.alt = x;
                img.src = src;
                img.style.visibility = 'visible';
            });
            return img;
        }
        else {
            return document.createTextNode(x);
        }
    }) : [];
}
function textNode(text) {
    return document.createTextNode(text);
}
function element(tag, className, nodes, attrs, events) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (nodes !== undefined) {
        appendAllNodes(element, nodes);
    }
    if (attrs !== undefined) {
        Object.keys(attrs).forEach(key => element.setAttribute(key, attrs[key]));
    }
    if (events !== undefined) {
        Object.keys(events).forEach(key => element.addEventListener(key, events[key]));
    }
    return element;
}
function appendAllNodes(element, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node !== undefined) {
            element.appendChild(node);
        }
    }
}
function removeAllNodes(element) {
    let child;
    while (child = element.lastChild) {
        element.removeChild(child);
    }
}
function removeFirstChild(element) {
    let child;
    if (child = element.firstChild) {
        element.removeChild(child);
    }
}
function removeElement(element) {
    element.parentElement && element.parentElement.removeChild(element);
}
function replaceNodes(element, text) {
    while (element.lastChild && element.lastChild !== element.firstChild) {
        element.removeChild(element.lastChild);
    }
    let firstChild = element.firstChild;
    if (!firstChild) {
        element.appendChild(firstChild = textNode(''));
    }
    if ((0, emoji_1.hasEmojis)(text)) {
        firstChild.nodeValue = '';
        appendAllNodes(element, createHtmlNodes(text, 2));
    }
    else {
        firstChild.nodeValue = text;
    }
}
function findParentElement(element, selector) {
    const elements = Array.from(document.querySelectorAll(selector));
    let current = element.parentElement;
    while (current && elements.indexOf(current) === -1) {
        current = current.parentElement;
    }
    return current;
}
function findFocusableElements(root) {
    const elements = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    return Array.from(elements);
}
function focusFirstElement(root) {
    const elements = findFocusableElements(root);
    if (elements.length) {
        elements[0].focus();
        return elements[0];
    }
    return undefined;
}
function focusElement(root, selector) {
    const target = root.querySelector(selector);
    if (target) {
        target.focus();
    }
}
function focusElementAfterTimeout(root, selector) {
    setTimeout(() => focusElement(root, selector), 10);
}
function isParentOf(parent, child) {
    for (let current = child.parentElement; current; current = current.parentElement) {
        if (current === parent) {
            return true;
        }
    }
    return false;
}
function showTextInNewTab(text) {
    const wnd = window.open();
    const pre = wnd.document.createElement('pre');
    pre.innerText = text;
    wnd.document.body.appendChild(pre);
}
function addStyle(style) {
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(style));
    document.head.appendChild(styleElement);
    return styleElement;
}
//# sourceMappingURL=htmlUtils.js.map