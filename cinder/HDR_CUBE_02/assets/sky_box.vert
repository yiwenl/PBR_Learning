#version 150

uniform mat4	ciModelViewProjection;

in vec4			ciPosition;
in vec2         ciTexCoord0;

out highp vec3	NormalWorldSpace;
out highp vec2	TexCoord;

void main( void )
{
	NormalWorldSpace = vec3( ciPosition );
	gl_Position = ciModelViewProjection * ciPosition;
    TexCoord	= ciTexCoord0;
}
