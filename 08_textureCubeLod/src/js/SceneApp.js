// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewBox  = require("./ViewBox");

function SceneApp() {
	gl = GL.gl;
	console.log( gl.getExtension("EXT_shader_texture_lod") );
	console.log( gl.getExtension("GL_EXT_shader_texture_lod") );

	bongiovi.Scene.call(this);
	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');

	var faces = [images.posx, images.negx, images.posy, images.negy, images.posz, images.negz];
	var o = {
		magFilter:gl.LINEAR,
		minFilter:gl.LINEAR
	}
	console.log(o);
	this.cubeTexture = new bongiovi.GLCubeTexture(faces);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vCube = new ViewBox();
};

p.render = function() {
	this._vAxis.render();
	this._vDotPlane.render();

	this._vCube.render(this.cubeTexture);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;