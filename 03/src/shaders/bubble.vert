// bubble.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 normalMatrix;
uniform float size;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vNormalOrg;
varying vec3 vPosition;
varying vec3 vEye;

const float PI = 3.141592657;

vec3 getPosition(vec3 value) 
{
	vec3 pos = vec3(0.0);
	float rx = value.y / (value.z * .5) * PI - PI * .5;
	float ry = value.x / value.z * PI * 2.0;
	float r = cos(rx) * size;

	pos.y = sin(rx) * size;
	pos.x = cos(ry) * r;
	pos.z = sin(ry) * r;

	return pos;
}


void main(void) {
	vec3 pos = getPosition(aVertexPosition);
	vec4 mvPosition = uMVMatrix * vec4(pos, 1.0);
    gl_Position = uPMatrix * mvPosition;


	vTextureCoord = aTextureCoord;
	vEye          = normalize(mvPosition.xyz);
	vNormalOrg    = normalize(pos);
	vNormal       = normalMatrix * vNormalOrg;
	vPosition     = pos;
}