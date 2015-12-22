// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
uniform sampler2D texture;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWsNormal;
varying vec3 vEyePosition;
varying vec3 vWsPosition;



void main(void) {
    gl_FragColor = vec4(vNormal * .5 + .5, 1.0);
}