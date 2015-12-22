// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewSphere = require("./ViewSphere");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this.textureMap = new bongiovi.GLTexture(images.envMap);
	this.textureRad = new bongiovi.GLTexture(images.radienceMap);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vSphere = new ViewSphere();
};

p.render = function() {
	this._vAxis.render();
	this._vDotPlane.render();

	this._vSphere.render(this.textureMap, this.textureRad);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;