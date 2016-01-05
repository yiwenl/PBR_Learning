#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"

#include "cinder/CameraUi.h"
#include "cinder/ImageIo.h"
#include "cinder/ImageFileTinyExr.h"
#include "cinder/params/Params.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class ImageBasedLighting_04App : public App {
  public:
	void setup() override;
	void mouseDown( MouseEvent event ) override;
    void keyDown( KeyEvent evnet) override;
	void update() override;
	void draw() override;
    void resize() override;
    void loadHDR();
    
private :
    CameraPersp         mCam;
    CameraUi            mCamUI;
    
    gl::BatchRef        mBatchModel, mBatchSkyBox;
    gl::GlslProgRef     mShaderPBR, mShaderSkyBox;
    
    gl::TextureCubeMapRef   mTextureIrradianceMap, mTextureRadianceMap;
    gl::Texture2dRef		mNormalMap, mRoughnessMap, mMetallicMap;
    
    int                     mGridSize;
    Color                   mBaseColor;
    float                   mGamma = 2.2, mExposure = 6.0;
    float					mRoughness, mMetallic, mSpecular;
    int                     mEnvIndex = 0;
    vector<string>          mEnvironments = {"uffizi", "grace", "pisa", "ennis", "glacier", "road", "river", "rooftop", "factory", "forest", "milkyway", "ireland" };
    
    params::InterfaceGlRef  _params;
};

void ImageBasedLighting_04App::setup()
{
    setWindowSize(1280, 720);
    setWindowPos(0, 0);
    
    //  CAMERA CONTROL
    mCam	= CameraPersp( getWindowWidth(), getWindowHeight(), 50.0f, 1.0f, 1000.0f ).calcFraming( Sphere( vec3( 0.0f ), 12.0f ) );
    mCamUI  = CameraUi(&mCam, getWindow(), -1);
    
    //  LOAD TEXTURES
    loadHDR();
    auto textureFormat	= gl::Texture2d::Format().mipmap().minFilter( GL_LINEAR_MIPMAP_LINEAR ).magFilter( GL_LINEAR );
    mNormalMap			= gl::Texture2d::create( loadImage( loadAsset( "normal.png" ) ) );
    mRoughnessMap		= gl::Texture2d::create( loadImage( loadAsset( "roughness.png" ) ), textureFormat );
    mMetallicMap		= gl::Texture2d::create( loadImage( loadAsset( "metallic.png" ) ), textureFormat );

    
    //  INIT SHADERS
    mShaderPBR          = gl::GlslProg::create( loadAsset("PBR.vert"), loadAsset("PBR.frag"));
    mShaderSkyBox       = gl::GlslProg::create( loadAsset("SkyBox.vert"), loadAsset("SkyBox.frag"));
    
    
    //  INIT BATCHES
    mBatchModel         = gl::Batch::create(geom::Sphere().subdivisions(100).radius(5), mShaderPBR);
    mBatchSkyBox        = gl::Batch::create(geom::Cube().size(vec3(500)), mShaderSkyBox);
    
    
    //  OTHERS
    mGridSize           = 5.0;
    mRoughness			= 1.0f;
    mMetallic			= 1.0f;
    mSpecular			= 1.0f;
    mBaseColor          = Color::white();
    
    //  PARAMETERS
    _params             = params::InterfaceGl::create( "Image Based Lighting", vec2( 300, getWindowHeight()-100 ) );
    _params->addParam("Gamma", &mGamma, "min=0.0 max=22.0 step=.1");
    _params->addParam("Exposure", &mExposure, "min=0.0 max=22.0 step=.1");
//    _params->addParam("Roughness", &mRoughness, "min=0.0 max=1.0 step=.1");
//    _params->addParam("Metallic", &mMetallic, "min=0.0 max=1.0 step=.1");
//    _params->addParam("Specular", &mSpecular, "min=0.0 max=1.0 step=.1");
    _params->addParam("Base Color", &mBaseColor);
    
    
    _params->addParam("Env Map", mEnvironments, &mEnvIndex)
    .keyDecr( "[" )
    .keyIncr( "]" )
    .updateFn( [this] {
        console() << "enum updated: " << mEnvironments[mEnvIndex] << endl;
        loadHDR();
    } );

}

void ImageBasedLighting_04App::loadHDR() {
    
    auto cubeMapFormat	= gl::TextureCubeMap::Format().mipmap().internalFormat( GL_RGB16F ).minFilter( GL_LINEAR_MIPMAP_LINEAR ).magFilter( GL_LINEAR );
    string mapName = mEnvironments[mEnvIndex];
    
    cout << "Load HDR : " << mapName << endl;
    
    mTextureIrradianceMap   = gl::TextureCubeMap::createFromDds( loadAsset(mapName+"Irradiance.dds"), cubeMapFormat );
    mTextureRadianceMap     = gl::TextureCubeMap::createFromDds( loadAsset(mapName+"Radiance.dds"), cubeMapFormat );
    
}

void ImageBasedLighting_04App::resize()
{
    mCam.setAspectRatio( getWindowAspectRatio() );
}

void ImageBasedLighting_04App::mouseDown( MouseEvent event )
{
}


void ImageBasedLighting_04App::keyDown(KeyEvent event) {
    if(event.getChar() == 's') {
        writeImage("pbr.png", copyWindowSurface());
    }
}

void ImageBasedLighting_04App::update()
{
}

void ImageBasedLighting_04App::draw()
{
	gl::clear( Color( 0, 0, 0 ) );
    
    gl::clear( Color( 1, 0, 0 ) );
    gl::setMatrices( mCam );
    
    // enable depth testing
    gl::ScopedDepth scopedDepth( true );
    
    // bind the cubemap textures
    gl::ScopedTextureBind scopedTexBind0( mTextureRadianceMap, 0 );
    gl::ScopedTextureBind scopedTexBind1( mTextureIrradianceMap, 1 );
    gl::ScopedTextureBind scopedTexBind2( mNormalMap, 2 );
    gl::ScopedTextureBind scopedTexBind3( mRoughnessMap, 3 );
    gl::ScopedTextureBind scopedTexBind4( mMetallicMap, 4 );
    
    auto shader = mBatchModel->getGlslProg();
    shader->uniform( "uRadianceMap", 0 );
    shader->uniform( "uIrradianceMap", 1 );
    shader->uniform( "uNormalMap", 2 );
    shader->uniform( "uRoughnessMap", 3 );
    shader->uniform( "uMetallicMap", 4 );
    
    // sends the base color, the specular opacity,
    // the light position, color and radius to the shader
    shader->uniform( "uBaseColor", mBaseColor );
    shader->uniform( "uSpecular", mSpecular );
    
    // sends the tone-mapping uniforms
    shader->uniform( "uExposure", mExposure );
    shader->uniform( "uGamma", mGamma );
    
    // render a grid of sphere with different roughness/metallic values and colors
    {
        
        shader->uniform( "uRoughness", mRoughness );
        shader->uniform( "uRoughness4", pow( mRoughness, 4.0f ) );
        shader->uniform( "uMetallic", mMetallic );

        mBatchModel->draw();

    }
    
    // render skybox
    shader = mBatchSkyBox->getGlslProg();
    shader->uniform( "uExposure", mExposure );
    shader->uniform( "uGamma", mGamma );
    mBatchSkyBox->draw();
    
    //  DRAW SETTINGS
    _params->draw();
}

CINDER_APP( ImageBasedLighting_04App, RendererGl )
