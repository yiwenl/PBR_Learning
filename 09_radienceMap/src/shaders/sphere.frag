// sphere.frag

#define SHADER_NAME SIMPLE_TEXTURE
#extension GL_EXT_shader_texture_lod : enable

precision highp float;
uniform sampler2D textureEnv;
uniform sampler2D textureRad;

uniform vec3 uBaseColor;
uniform float uRoughness;
uniform float uRoughness4;
uniform float uMetallic;
uniform float uSpecular;

uniform float uExposure;
uniform float uGamma;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWsNormal;
varying vec3 vEyePosition;
varying vec3 vWsPosition;


#define saturate(x) clamp(x, 0.0, 1.0)
const float PI = 3.1415926535897932384626433832795;
const float TwoPI = PI * 2.0;


const float A = 0.15;
const float B = 0.50;
const float C = 0.10;
const float D = 0.20;
const float E = 0.02;
const float F = 0.30;

vec3 Uncharted2Tonemap( vec3 x )
{
	return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}

// https://www.unrealengine.com/blog/physically-based-shading-on-mobile
vec3 EnvBRDFApprox( vec3 SpecularColor, float Roughness, float NoV )
{
	const vec4 c0 = vec4( -1.0, -0.0275, -0.572, 0.022 );
	const vec4 c1 = vec4( 1.0, 0.0425, 1.04, -0.04 );
	vec4 r = Roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( -9.28 * NoV ) ) * r.x + r.y;
	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
	return SpecularColor * AB.x + AB.y;
}


// http://the-witness.net/news/2012/02/seamless-cube-map-filtering/
vec3 fix_cube_lookup( vec3 v, float cube_size, float lod ) {
	float M = max(max(abs(v.x), abs(v.y)), abs(v.z));
	float scale = 1.0 - exp2(lod) / cube_size;
	if (abs(v.x) != M) v.x *= scale;
	if (abs(v.y) != M) v.y *= scale;
	if (abs(v.z) != M) v.z *= scale;
	return v;
}


vec2 envMapEquirect(vec3 wcNormal, float flipEnvMap) {
  //I assume envMap texture has been flipped the WebGL way (pixel 0,0 is a the bottom)
  //therefore we flip wcNorma.y as acos(1) = 0
  float phi = acos(-wcNormal.y);
  float theta = atan(flipEnvMap * wcNormal.x, wcNormal.z) + PI;
  return vec2(theta / TwoPI, phi / PI);
}

vec2 envMapEquirect(vec3 wcNormal) {
    //-1.0 for left handed coordinate system oriented texture (usual case)
    return envMapEquirect(wcNormal, -1.0);
}

void main(void) {
    vec3 N 				= normalize( vWsNormal );
    	vec3 V 				= normalize( vEyePosition );
    	
    	// deduce the diffuse and specular color from the baseColor and how metallic the material is
    	vec3 diffuseColor	= uBaseColor - uBaseColor * uMetallic;
    	vec3 specularColor	= mix( vec3( 0.08 * uSpecular ), uBaseColor, uMetallic );
    	
    	vec3 color;
    	
    	// sample the pre-filtered cubemap at the corresponding mipmap level
    	int numMips			= 6;
    	float mip			= float(numMips) - 1.0 + log2(uRoughness);
    	vec3 lookup			= -reflect( V, N );
    	// lookup				= fix_cube_lookup( lookup, 512.0, mip );
    	// vec3 radiance		= pow( textureLod( uRadianceMap, lookup, mip ).rgb, vec3( 2.2 ) );
    	vec2 uvLookUp 		= envMapEquirect(lookup);
    	vec3 radiance 		= pow(texture2D(textureEnv, uvLookUp, mip).rgb, vec3( 2.2 ));
    	vec2 uvNormal 		= envMapEquirect(N);
    	vec3 irradiance 	= pow(texture2D(textureRad, uvNormal).rgb, vec3(2.2));

    	// vec3 irradiance		= pow( texture( uIrradianceMap, N ).rgb, vec3( 2.2 ) );
    	
    	// get the approximate reflectance
    	float NoV			= saturate( dot( N, V ) );
    	vec3 reflectance	= EnvBRDFApprox( specularColor, uRoughness4, NoV );
    	
    	// combine the specular IBL and the BRDF
        vec3 diffuse  		= diffuseColor * irradiance;
        vec3 specular 		= radiance * reflectance;
    	color				= diffuse + specular;
    	
    	// apply the tone-mapping
    	color				= Uncharted2Tonemap( color * uExposure );
    	// white balance
    	color				= color * ( 1.0 / Uncharted2Tonemap( vec3( 20.0 ) ) );
    	
    	// gamma correction
    	color				= pow( color, vec3( 1.0 / uGamma ) );

    gl_FragColor = vec4(color, 1.0);
}