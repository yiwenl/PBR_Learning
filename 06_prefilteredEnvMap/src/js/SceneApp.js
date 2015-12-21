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
	// this._vFilterEnvMap = new ViewPrefilteredEnvMap();

	this._envMaps = [];
	for(var i=0; i<6; i++) {
		var v = new ViewPrefilteredEnvMap(i);
		this._envMaps.push(v);
	}
};

p.render = function() {
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	var h = window.innerHeight / 6;
	var w = Math.min(h*2, window.innerHeight);

	for(var i=0; i<this._envMaps.length; i++) {
		GL.setViewport(0, h*i, w, h);
		var v = this._envMaps[i];
		v.render(this.textureMap, this.textureNormal);
	}

};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;