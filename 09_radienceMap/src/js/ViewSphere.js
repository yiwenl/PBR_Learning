// ViewSphere.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSphere() {
	bongiovi.View.call(this, glslify('../shaders/sphere.vert'), glslify('../shaders/sphere.frag'));
}

var p = ViewSphere.prototype = new bongiovi.View();
p.constructor = ViewSphere;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createSphere(100, 50);
};

p.render = function(textureEnv, textureRad) {
	this.shader.bind();
	this.shader.uniform("textureEnv", "uniform1i", 0);
	textureEnv.bind(0);
	this.shader.uniform("textureRad", "uniform1i", 1);
	textureRad.bind(1);


	// console.log(GL.matrix, GL.camera.projection);
	// this.shader.uniform("uViewMatrix", "uniformMatrix4fv", GL.matrix);
	// this.shader.uniform("uProjectionMatrix", "uniformMatrix4fv", GL.camera.projection);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;