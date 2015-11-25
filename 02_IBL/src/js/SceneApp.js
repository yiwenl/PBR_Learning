// SceneApp.js

var GL       = bongiovi.GL, gl;
var ViewBox  = require("./ViewBox");
var ViewBall = require("./ViewBall");

function SceneApp() {
	gl = GL.gl;
	console.log( gl.getExtension("EXT_shader_texture_lod") );
	console.log( gl.getExtension("GL_EXT_shader_texture_lod") );
	this.count = 0;
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
		magFilter:gl.LINEAR_MIPMAP_NEAREST,
		minFilter:gl.LINEAR_MIPMAP_NEAREST
	}
	console.log(o);
	this.cubeTexture = new bongiovi.GLCubeTexture(faces, o);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vCube = new ViewBox();
	this._vBall = new ViewBall();
};

p.render = function() {
	this.count += .01;
	this._vAxis.render();
	this._vDotPlane.render();

	var num = 9;
	var gap = 50;
	var roughness = 0.0;
	var metallic = 0.0;
	var pos = [0, 0, 0];
	var l = 100.0;
	var r = 300.0;
	var lightPosition = [Math.cos(this.count) * r, l, Math.sin(this.count) * r];
	for(var j=0; j<=num; j++) {
		metallic = j/num;
		pos[2] = -gap*num/2 + j*gap;
		for(var i=0; i<=num; i++) {
			roughness = i/num;
			pos[0] = -gap*num/2 + i*gap;
			// console.log(roughness, metallic);
			this._vBall.render(pos, lightPosition, roughness, metallic, this.cubeTexture);
		}
	}

	this._vCube.render(this.cubeTexture);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;