/// <reference path="../../typings/my.d.ts" />

import { readFileAsync, readFileSync } from 'fs';

// Try to load canvas, but allow graceful degradation if not available
let createNodeCanvas: any;
let Image: any;
let canvasAvailable = false;

try {
	const canvas = require('canvas');
	createNodeCanvas = canvas.createCanvas;
	Image = canvas.Image;
	canvasAvailable = true;
} catch (e) {
	console.warn('Canvas module not available, image processing features will be disabled');
	// Provide stub implementations
	createNodeCanvas = () => { throw new Error('Canvas not available'); };
	Image = class { constructor() { throw new Error('Canvas not available'); } };
}

export const createCanvas = createNodeCanvas;

export async function loadImage(src: string) {
	if (!canvasAvailable) {
		throw new Error('Canvas module not available');
	}
	const buffer = await readFileAsync(src);
	const image = new Image();
	image.src = buffer;
	return image;
}

export function loadImageSync(src: string) {
	if (!canvasAvailable) {
		throw new Error('Canvas module not available');
	}
	const image = new Image();
	image.src = readFileSync(src);
	return image;
}

if (canvasAvailable) {
	const { setup } = require('../client/canvasUtils');
	setup({ createCanvas: createNodeCanvas, loadImage });
}
