// sphereNormal.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
	const float scale = 2.0;
	vec3 pos = vec3(aTextureCoord-vec2(.5), 0.0) * scale;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = normalize(aVertexPosition);
}