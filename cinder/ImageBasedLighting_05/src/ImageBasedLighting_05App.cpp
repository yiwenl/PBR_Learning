#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"

#include "cinder/ObjLoader.h"
#include "cinder/CameraUi.h"
#include "cinder/ImageIo.h"
#include "cinder/ImageFileTinyExr.h"
#include "cinder/params/Params.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class ImageBasedLighting_05App : public App {
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
    gl::Texture2dRef		mNormalMap, mRoughnessMap, mMetallicMap, mSpecularMap, mColorMap, mAOMap;
    
    int                     mGridSize;
    Color                   mBaseColor;
    float                   mGamma = 2.2, mExposure = 20.0;
    float					mRoughness, mMetallic, mSpecular, mNormalMapScale;
    int                     mEnvIndex = 0;
    int                     count = 0;
    vector<string>          mEnvironments = {"uffizi", "grace", "pisa", "ennis", "glacier", "road", "river", "rooftop", "factory", "forest", "milkyway", "ireland" };
    
    params::InterfaceGlRef  _params;
};

void ImageBasedLighting_05App::setup()
{
    setWindowSize(1280, 720);
    setWindowPos(0, 0);
    
    //  CAMERA CONTROL
    mCam	= CameraPersp( getWindowWidth(), getWindowHeight(), 50.0f, 0.1f, 1000.0f ).calcFraming( Sphere( vec3( 0.0f, 0.1f, 0.0f ), 0.5f ) );
    mCamUI  = CameraUi(&mCam, getWindow(), -1);
    
    //  LOAD TEXTURES
    loadHDR();
    auto textureFormat	= gl::Texture2d::Format().mipmap().minFilter( GL_LINEAR_MIPMAP_LINEAR ).magFilter( GL_LINEAR );
    mNormalMap			= gl::Texture2d::create( loadImage( loadAsset( "normal.png" ) ) );
    mRoughnessMap		= gl::Texture2d::create( loadImage( loadAsset( "roughness.png" ) ), textureFormat );
    mMetallicMap		= gl::Texture2d::create( loadImage( loadAsset( "metallic.png" ) ), textureFormat );
    mSpecularMap		= gl::Texture2d::create( loadImage( loadAsset( "specular.png" ) ), textureFormat );
    mColorMap           = gl::Texture2d::create( loadImage( loadAsset( "maskColor.png" ) ), textureFormat );
    mAOMap              = gl::Texture2d::create( loadImage( loadAsset( "maskAO.png" ) ), textureFormat );
    
    
    //  INIT SHADERS
    mShaderPBR          = gl::GlslProg::create( loadAsset("PBR.vert"), loadAsset("PBR.frag"));
    mShaderSkyBox       = gl::GlslProg::create( loadAsset("SkyBox.vert"), loadAsset("SkyBox.frag"));
    
    
    //  INIT BATCHES
    auto dataSource = loadAsset("mask-highpoly.obj");
    ObjLoader loader( dataSource );
    auto mMesh = TriMesh::create( loader );
    
    if( ! loader.getAvailableAttribs().count( geom::NORMAL ) )
        mMesh->recalculateNormals();
    
    mMesh->recalculateTangents();
    
    mBatchModel         = gl::Batch::create(*mMesh, mShaderPBR);
    mBatchSkyBox        = gl::Batch::create(geom::Cube().size(vec3(500)), mShaderSkyBox);
    
    
    //  OTHERS
    mGridSize           = 5.0;
    mRoughness			= 1.0f;
    mMetallic			= 1.0f;
    mSpecular			= 1.0f;
    mNormalMapScale     = 0.0;
    mBaseColor          = Color::white();
    
    //  PARAMETERS
    _params             = params::InterfaceGl::create( "Image Based Lighting", vec2( 300, getWindowHeight()-100 ) );
    _params->addParam("Gamma", &mGamma, "min=0.0 max=22.0 step=.1");
    _params->addParam("Exposure", &mExposure, "min=0.0 max=50.0 step=.1");
    //    _params->addParam("Roughness", &mRoughness, "min=0.0 max=1.0 step=.1");
    //    _params->addParam("Metallic", &mMetallic, "min=0.0 max=1.0 step=.1");
    _params->addParam("Normal Map", &mNormalMapScale, "min=0.0 max=1.0 step=.1");
    _params->addParam("Base Color", &mBaseColor);
    
    
    _params->addParam("Env Map", mEnvironments, &mEnvIndex)
    .keyDecr( "[" )
    .keyIncr( "]" )
    .updateFn( [this] {
        console() << "enum updated: " << mEnvironments[mEnvIndex] << endl;
        loadHDR();
    } );
}

void ImageBasedLighting_05App::loadHDR() {
    
    auto cubeMapFormat	= gl::TextureCubeMap::Format().mipmap().internalFormat( GL_RGB16F ).minFilter( GL_LINEAR_MIPMAP_LINEAR ).magFilter( GL_LINEAR );
    string mapName = mEnvironments[mEnvIndex];
    
    cout << "Load HDR : " << mapName << endl;
    
    mTextureIrradianceMap   = gl::TextureCubeMap::createFromDds( loadAsset(mapName+"Irradiance.dds"), cubeMapFormat );
    mTextureRadianceMap     = gl::TextureCubeMap::createFromDds( loadAsset(mapName+"Radiance.dds"), cubeMapFormat );
    
}

void ImageBasedLighting_05App::resize()
{
    mCam.setAspectRatio( getWindowAspectRatio() );
}

void ImageBasedLighting_05App::mouseDown( MouseEvent event )
{
}

void ImageBasedLighting_05App::keyDown(KeyEvent event) {
    if(event.getChar() == 's') {
        std::string s = std::to_string(count);
        count++;
        writeImage("pbr"+s+".png", copyWindowSurface());
    }
}

void ImageBasedLighting_05App::update()
{
}

void ImageBasedLighting_05App::draw()
{
    gl::clear( Color( 0, 0, 0 ) );
    
    gl::setMatrices( mCam );
    
    // enable depth testing
    gl::ScopedDepth scopedDepth( true );
    
    // bind the cubemap textures
    gl::ScopedTextureBind scopedTexBind0( mTextureRadianceMap, 0 );
    gl::ScopedTextureBind scopedTexBind1( mTextureIrradianceMap, 1 );
    gl::ScopedTextureBind scopedTexBind2( mNormalMap, 2 );
    gl::ScopedTextureBind scopedTexBind3( mRoughnessMap, 3 );
    gl::ScopedTextureBind scopedTexBind4( mMetallicMap, 4 );
    gl::ScopedTextureBind scopedTexBind5( mColorMap, 5 );
    gl::ScopedTextureBind scopedTexBind6( mAOMap, 6 );
    gl::ScopedTextureBind scopedTexBind7( mSpecularMap, 7 );
    
    auto shader = mBatchModel->getGlslProg();
    shader->uniform( "uRadianceMap", 0 );
    shader->uniform( "uIrradianceMap", 1 );
    shader->uniform( "uNormalMap", 2 );
    shader->uniform( "uRoughnessMap", 3 );
    shader->uniform( "uMetallicMap", 4 );
    shader->uniform( "uColorMap", 5 );
    shader->uniform( "uAOMap", 6 );
    shader->uniform( "uSpecularMap", 7);
    
    // sends the base color, the specular opacity,
    // the light position, color and radius to the shader
//    shader->uniform( "uBaseColor", mBaseColor );
//    shader->uniform( "uSpecular", mSpecular );
//    shader->uniform( "uNormalMapScale",mNormalMapScale);
    
    // sends the tone-mapping uniforms
    shader->uniform( "uExposure", mExposure );
    shader->uniform( "uGamma", mGamma );
    
    // render a grid of sphere with different roughness/metallic values and colors
    {
        
//        shader->uniform( "uRoughness", mRoughness );
//        shader->uniform( "uRoughness4", pow( mRoughness, 4.0f ) );
//        shader->uniform( "uMetallic", mMetallic );
        
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

CINDER_APP( ImageBasedLighting_05App, RendererGl( RendererGl::Options().msaa( 16 ) ) )
