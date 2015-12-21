// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewLod = require("./ViewLod");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this.texture = new bongiovi.GLTexture(images.uffizi)
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vCopy = new bongiovi.ViewCopy();

	this._vLod = new ViewLod();
};

p.render = function() {
	// this._vAxis.render();
	// this._vDotPlane.render();

	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	// this._vCopy.render(this.texture);
	this._vLod.render(this.texture);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;