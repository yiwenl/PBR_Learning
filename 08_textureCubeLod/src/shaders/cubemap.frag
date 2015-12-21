// cubemap.frag

#define SHADER_NAME SIMPLE_TEXTURE
#extension GL_EXT_shader_texture_lod : enable

precision highp float;
varying vec2 vTextureCoord;
uniform samplerCube texture;
uniform vec3 camera;
uniform float time;
varying vec3 vNormal;
varying vec3 vEye;
varying vec3 vVertex;

void main(void) {
    gl_FragColor = textureCube(texture, vVertex);

    float lod = (5.0 + 5.0*sin( time ))*step( vTextureCoord.x, 0.5 );
    gl_FragColor = textureCubeLodEXT(texture, vVertex, lod);

    // textureCubeLodEXT
    // gl_FragColor = textureCube(texture, reflect(vEye, vNormal));
    // gl_FragColor = textureCube(texture, refract(vEye, vNormal, 1.0));
    // gl_FragColor = vec4(1.0);
    // gl_FragColor.rgb = vNormal*.5+.5;
}