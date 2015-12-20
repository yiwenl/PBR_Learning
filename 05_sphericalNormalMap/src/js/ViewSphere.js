// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere() {
	// bongiovi.View.call(this, null, bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify('../shaders/sphereNormal.vert'), glslify('../shaders/sphereNormal.frag'));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = bongiovi.MeshUtils.createSphere(100, 50);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("opacity", "uniform1f", 1);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;