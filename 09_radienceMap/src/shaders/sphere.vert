// sphere.vert
#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 invertMVMatrix;
uniform mat3 normalMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWsNormal;
varying vec3 vEyePosition;
varying vec3 vWsPosition;

void main(void) {
	vec4 worldSpacePosition = vec4(aVertexPosition, 1.0);
	vec4 viewSpacePosition  = uMVMatrix * worldSpacePosition;
	
	
	vNormal                 = normalMatrix * normalize(aVertexPosition);
	vPosition               = viewSpacePosition.xyz;
	vWsPosition             = worldSpacePosition.xyz;
	
	vec4 eyeDirViewSpace    = viewSpacePosition - vec4( 0.0, 0.0, 0.0, 1.0 );
	vEyePosition            = -( invertMVMatrix * eyeDirViewSpace.rgb );
	vWsNormal               = ( invertMVMatrix * vec4( vNormal, 0.0 ).rgb );
	
	gl_Position             = uPMatrix * viewSpacePosition;
	vTextureCoord           = aTextureCoord;
}