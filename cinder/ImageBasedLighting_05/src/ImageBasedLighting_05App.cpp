#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class ImageBasedLighting_05App : public App {
  public:
	void setup() override;
	void mouseDown( MouseEvent event ) override;
	void update() override;
	void draw() override;
};

void ImageBasedLighting_05App::setup()
{
}

void ImageBasedLighting_05App::mouseDown( MouseEvent event )
{
}

void ImageBasedLighting_05App::update()
{
}

void ImageBasedLighting_05App::draw()
{
	gl::clear( Color( 0, 0, 0 ) ); 
}

CINDER_APP( ImageBasedLighting_05App, RendererGl )
