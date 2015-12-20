// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere() {
	bongiovi.View.call(this);
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createSphere(1500, 50);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;