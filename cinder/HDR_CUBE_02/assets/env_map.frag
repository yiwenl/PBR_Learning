#version 150

uniform samplerCube uCubeMapTex;
uniform float uExposure;

in vec3	NormalWorldSpace;
in vec3 EyeDirWorldSpace;

out vec4 	oColor;

void main( void )
{
	// reflect the eye vector about the surface normal (all in world space)
	vec3 reflectedEyeWorldSpace = reflect( EyeDirWorldSpace, normalize(NormalWorldSpace) );
    vec4 color = texture( uCubeMapTex, reflectedEyeWorldSpace );
    color *= uExposure;
    color.a = 1.0;
    oColor = color;
}