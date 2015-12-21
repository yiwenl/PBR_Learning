// ViewLod.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewLod() {
	this.time = 0;
	bongiovi.View.call(this, null, glslify('../shaders/lod.frag'));
}

var p = ViewLod.prototype = new bongiovi.View();
p.constructor = ViewLod;


p._init = function() {
	gl = GL.gl;

	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.time += .02;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("time", "uniform1f", this.time);
	GL.draw(this.mesh);
};

module.exports = ViewLod;