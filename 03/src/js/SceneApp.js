// SceneApp.js

var GL = bongiovi.GL, gl;

var ViewBall = require("./ViewBall");
var ViewDot = require("./ViewDot");
var ViewBubble = require("./ViewBubble");

function SceneApp() {
	gl = GL.gl;
	// gl.disable(gl.CULL_FACE);
	bongiovi.Scene.call(this);
	this.lightPosition = [0, 0, 0];
	this.count = 0;

	this.sceneRotation.lock(true);
	this.camera.lockRotation(false);
	this.camera._rx.value = this.camera._ry.value = -Math.PI/5;
	this.camera.radius.value = 800;

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vBall = new ViewBall();
	this._vDot = new ViewDot(0);

	this._vBubble = new ViewBubble();
};

p.render = function() {
	this.count += .01;
	// this._vAxis.render();
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
			// this._vBall.render(pos, lightPosition, roughness, metallic);
		}
	}

	this._vBubble.render();
	this._vDot.render(lightPosition);
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;