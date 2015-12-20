// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewSphere = require("./ViewSphere");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
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


	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	this._vSphere.render();
};

p.resize = function() {
	var scale = 1.5;
	GL.setSize(1024*scale, 512*scale);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;