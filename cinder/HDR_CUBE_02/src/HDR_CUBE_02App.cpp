#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"
#include "cinder/ImageIo.h"
#include "cinder/CameraUi.h"
#include "cinder/ImageFileTinyExr.h"
#include "cinder/params/Params.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class HDR_CUBE_02App : public App {
  public:
    void setup() override;
    void mouseDown( MouseEvent event ) override;
    void update() override;
    void draw() override;
    void mouseDrag( MouseEvent event ) override;
    void fileDrop( FileDropEvent event ) override;
    void loadHdr( const fs::path &path );
    
    
private:
    gl::TextureRef          mHdrTexture;
    gl::TextureCubeMapRef   mCubeMap;
    gl::BatchRef            mBatch, mSkyboxBatch;
    gl::GlslProgRef         mShaderProg;
    gl::GlslProgRef         mShaderSkybox;
    gl::GlslProgRef         mShaderEnvMap;
    CameraPersp             mCam;
    CameraUi                mCamUI;
    
    float                   mExposure = 1.0f;
    params::InterfaceGlRef          _params;
};


const int SKY_BOX_SIZE = 500;

void HDR_CUBE_02App::setup()
{
    setWindowPos(0, 0);
    setWindowSize(1280, 720);
    
    mShaderSkybox   = gl::GlslProg::create( loadAsset("sky_box.vert"), loadAsset("sky_box.frag"));
    mShaderProg     = gl::GlslProg::create(loadAsset("shader.vert"), loadAsset("shader.frag"));
    mShaderEnvMap   = gl::GlslProg::create(loadAsset("env_map.vert"), loadAsset("env_map.frag"));
    
    
    mSkyboxBatch = gl::Batch::create(geom::Cube(), mShaderSkybox);
    mSkyboxBatch->getGlslProg()->uniform("uCubeMapTex", 0);
    
//    mBatch = gl::Batch::create( geom::Teapot().subdivisions( 7 ), mShaderEnvMap );
    mBatch = gl::Batch::create( geom::Sphere().subdivisions(30), mShaderEnvMap);
    mBatch->getGlslProg()->uniform( "uCubeMapTex", 0 );

    
    mCamUI = CameraUi(&mCam, getWindow(), -1);
    
    gl::enableDepthWrite();
    gl::enableDepthRead();
    
    ImageSourceFileTinyExr::registerSelf();
    ImageTargetFileTinyExr::registerSelf();
    
    loadHdr( getAssetPath( "doge2_radiance.hdr" ) );
    
    
    _params         = params::InterfaceGl::create( "HDR CUBE MAP", vec2( 300, getWindowHeight()-200 ) );
    _params->addParam("Exposure", &mExposure, "min=0.0 max=12.0 step=.1");
//    _params->addPa
}


void HDR_CUBE_02App::fileDrop( FileDropEvent event )
{
    loadHdr( event.getFile( 0 ) );
}

void HDR_CUBE_02App::loadHdr( const fs::path &path )
{
    Surface32f s( loadImage( path ) );
    
    mCubeMap = gl::TextureCubeMap::create( s, gl::TextureCubeMap::Format().mipmap().minFilter( GL_LINEAR_MIPMAP_LINEAR ).magFilter( GL_LINEAR ) );
    mHdrTexture = gl::Texture::create( s, gl::Texture::Format().mipmap() );

}

void HDR_CUBE_02App::mouseDrag( MouseEvent event )
{
    mExposure = powf( event.getPos().x / (float)getWindowWidth() * 2, 4 );
    console() << "Exposure: " << mExposure << std::endl;
}


//void HDR_CUBE_02App::

void HDR_CUBE_02App::mouseDown( MouseEvent event )
{
}

void HDR_CUBE_02App::update()
{
}

void HDR_CUBE_02App::draw()
{
	gl::clear( Color( 0, 0, 0 ) );
    
    
    /*/
    gl::ScopedGlslProg shaderScp( mShaderProg );
    gl::ScopedTextureBind texBindScp( mHdrTexture );
    mShaderProg->uniform( "uExposure", mExposure );
    gl::drawSolidRect( mHdrTexture->getBounds() );
    
    /*/
    gl::setMatrices( mCam );
    
    mCubeMap->bind();
    mShaderSkybox->uniform( "uExposure", mExposure );
    mShaderEnvMap->uniform( "uExposure", mExposure );
    
    gl::pushMatrices();
        gl::scale( vec3( 4 ) );
        mBatch->draw();
    gl::popMatrices();
    
    gl::pushMatrices();
        gl::scale( SKY_BOX_SIZE, SKY_BOX_SIZE, SKY_BOX_SIZE );
        mSkyboxBatch->draw();
    gl::popMatrices();
     //*/
    
    _params->draw();
}

CINDER_APP( HDR_CUBE_02App, RendererGl( RendererGl::Options().msaa( 16 ) ) )
