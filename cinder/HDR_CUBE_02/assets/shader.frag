#version 150

uniform sampler2D   uTex0;
uniform float       uExposure;

in vec2             TexCoord;

out vec4            oColor;

void main( void )
{
    vec4 color = texture( uTex0, TexCoord );
    
    oColor = color * uExposure;
    oColor.a = 1.0;
}