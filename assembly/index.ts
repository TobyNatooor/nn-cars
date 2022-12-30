export * from '../node_modules/asdom/assembly/glue'

import {
	document,
	Audio,
	Element,
	HTMLDivElement,
	HTMLTemplateElement,
	Text,
	HTMLElement,
	HTMLImageElement,
	Node,
	HTMLHeadingElement,
	HTMLSpanElement,
	window,
	EmptyHistoryState,
	HTMLCanvasElement,
	WebGLRenderingContext,
	ANGLE_instanced_arrays,
	GLenum,
	WebGLShader,
	WebGLProgram,
	WebGLBuffer,
	GLint,
	WebGLUniformLocation,
	GLfloat,
} from '../node_modules/asdom/assembly/index'

export function getCoordsFromPoint(radius: f32, degrees: f32, x: f32, y: f32): Array<f32> {
    let radians = degrees * Math.PI / 180 as f32
    let array = new Array<f32>(2)
    array[0] = x + radius * Math.sin(radians) as f32
    array[1] = y - radius * Math.cos(radians) as f32
    return array
}
