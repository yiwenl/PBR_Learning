// lod.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float time;

void main(void) {

	float lod = (5.0 + 5.0*sin( time ))*step( vTextureCoord.x, 0.5 );

    gl_FragColor = texture2D(texture, vTextureCoord, lod);
}