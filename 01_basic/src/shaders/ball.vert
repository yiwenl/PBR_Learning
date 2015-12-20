// ball.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;
uniform vec3 position;
uniform vec3 lightPosition;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vNormalOrg;
varying vec3 vPosition;
varying vec3 vLightPosition;



void main(void) {
	vec3 pos    = aVertexPosition + position;
	gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);

	vTextureCoord  = aTextureCoord;
	vPosition      = pos;
	vNormalOrg     = normalize(aVertexPosition);
	vNormal        = vNormalOrg;
	vLightPosition = lightPosition;
}