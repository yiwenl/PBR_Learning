// bubble.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

varying vec3 vNormal;
varying vec3 vNormalOrg;
varying vec3 vPosition;
varying vec3 vEye;

void main(void) {
	vec3 color = vNormal * .5 + .5;
    gl_FragColor = vec4(color, 1.0);
}