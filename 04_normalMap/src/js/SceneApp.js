// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewSphere = require("./ViewSphere");

function SceneApp() {
	gl = GL.gl;
	gl.disable(gl.CULL_FACE);
	bongiovi.Scene.call(this);

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera.setPerspective(90*Math.PI/180, window.innerWidth/window.innerHeight, 5, 3000);
	this.camera.radius.value = 1;

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this.texture = new bongiovi.GLTexture(images.latlng);
	console.log(this.texture);
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

	this._vSphere.render(this.texture);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;