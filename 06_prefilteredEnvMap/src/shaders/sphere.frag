// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D texture5;
uniform sampler2D texture6;

uniform float roughness;


void main(void) {
	float gap = 1.0 / 6.0;
	float p = 0.0;

	vec4 color0;
	vec4 color1;

	if(roughness < gap) {
		p = roughness / gap;
		color0 = texture2D(texture0, vTextureCoord);
		color1 = texture2D(texture1, vTextureCoord);
	} else if(roughness < gap * 2.0) {
		p = (roughness - gap) / gap;
		color0 = texture2D(texture1, vTextureCoord);
		color1 = texture2D(texture2, vTextureCoord);
	} else if(roughness < gap * 3.0) {
		p = (roughness - gap * 2.0) / gap;
		color0 = texture2D(texture2, vTextureCoord);
		color1 = texture2D(texture3, vTextureCoord);
	} else if(roughness < gap * 4.0) {
		p = (roughness - gap * 3.0) / gap;
		color0 = texture2D(texture3, vTextureCoord);
		color1 = texture2D(texture4, vTextureCoord);
	} else if(roughness < gap * 5.0) {
		p = (roughness - gap * 4.0) / gap;
		color0 = texture2D(texture4, vTextureCoord);
		color1 = texture2D(texture5, vTextureCoord);
	} else {
		p = (roughness - gap * 5.0) / gap;
		color0 = texture2D(texture5, vTextureCoord);
		color1 = texture2D(texture6, vTextureCoord);
	} 

    gl_FragColor = mix(color0, color1, p);
    // gl_FragColor.rgb = vNormal * .5 + .5;
}