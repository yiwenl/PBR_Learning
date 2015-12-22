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

	this.shader.uniform("uBaseColor", "uniform3fv", params.baseColor);
	this.shader.uniform("uExposure", "uniform1f", params.exposure);
	this.shader.uniform("uGamma", "uniform1f", params.gamma);
	this.shader.uniform("uSpecular", "uniform1f", params.specular);
	this.shader.uniform("uMetallic", "uniform1f", params.metallic);
	this.shader.uniform("uRoughness", "uniform1f", params.roughness);
	var roughness = params.roughness;
	roughness = Math.pow(roughness * roughness, 4.0);
	this.shader.uniform("uRoughness4", "uniform1f", roughness);
	// console.log(GL.matrix, GL.camera.projection);
	// this.shader.uniform("uViewMatrix", "uniformMatrix4fv", GL.matrix);
	// this.shader.uniform("uProjectionMatrix", "uniformMatrix4fv", GL.camera.projection);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;