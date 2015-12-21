// SceneApp.js

var GL = bongiovi.GL, gl;

var ViewPrefilteredEnvMap = require("./ViewPrefilteredEnvMap");
var ViewSphere = require("./ViewSphere");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this.textureMap = new bongiovi.GLTexture(images.uffizi);
	this.textureNormal = new bongiovi.GLTexture(images.sphereNormal);

	var size = 1024;
	this.fbos = [];
	for(var i=0; i<6; i++) {
		// console.log('FBO size :', size);
		var fbo = new bongiovi.FrameBuffer(size, size/2);
		this.fbos.push(fbo)
		// size /= 2;
	}
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vCopy = new bongiovi.ViewCopy();
	// this._vFilterEnvMap = new ViewPrefilteredEnvMap();

	this._envMaps = [];
	for(var i=0; i<6; i++) {
		var v = new ViewPrefilteredEnvMap(i);
		this._envMaps.push(v);
	}

	this._vSphere = new ViewSphere();
	this.prefilterEnvMap();
};


p.prefilterEnvMap = function() {
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);


	for(var i=0; i<this._envMaps.length; i++) {
		var fbo = this.fbos[i];

		GL.setViewport(0, 0, fbo.width, fbo.height);
		fbo.bind();
		GL.clear(0, 0, 0, 0);
		var v = this._envMaps[i];
		v.render(this.textureMap, this.textureNormal);	
		fbo.unbind();
		
	}
};

p.render = function() {
	this._vAxis.render();
	this._vDotPlane.render();

	this._vSphere.render(this.textureMap, this.fbos);
/*
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);
	GL.setViewport(0, 0, 1024, 512);
	this._vCopy.render(this.fbos[0].getTexture());

	GL.setViewport(0, 512, 1024, 512);
	this._vCopy.render(this.textureMap);
*/
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;