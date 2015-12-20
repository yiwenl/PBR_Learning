// SceneApp.js

var GL = bongiovi.GL, gl;

var ViewPrefilteredEnvMap = require("./ViewPrefilteredEnvMap");

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
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vCopy = new bongiovi.ViewCopy();
	this._vFilterEnvMap = new ViewPrefilteredEnvMap();
};

p.render = function() {
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	var size = window.innerWidth/2;
	GL.setViewport(0, 0, size, size/2);
	this._vCopy.render(this.textureMap);
	GL.setViewport(0, size/2, size, size/2);
	this._vCopy.render(this.textureNormal);

	var W = window.innerWidth;
	GL.setViewport(0, window.innerHeight - W/2, W, W/2);
	this._vFilterEnvMap.render(this.textureMap, this.textureNormal);

};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;