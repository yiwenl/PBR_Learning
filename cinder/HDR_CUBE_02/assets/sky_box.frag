#version 150

uniform samplerCube uCubeMapTex;
uniform float       uExposure;

in vec3             NormalWorldSpace;
in vec2             TexCoord;

out vec4            oColor;

void main( void )
{
	vec4 color = texture( uCubeMapTex, NormalWorldSpace );
    
    oColor = color * uExposure;
//    oColor.rgb = vec3(uExposure/20.0);
    oColor.a = 1.0;
}