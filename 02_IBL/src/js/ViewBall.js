// ViewBall.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBall() {
	bongiovi.View.call(this, glslify("../shaders/ball.vert"), glslify("../shaders/ball.frag"));
}

var p = ViewBall.prototype = new bongiovi.View();
p.constructor = ViewBall;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = bongiovi.MeshUtils.createSphere(20, 50);
};

p.render = function(pos, lightPos, roughness, metallic, texture) {
	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);
	var specular = 1.0;
	var exposure = 1.5;
	var gamma    = 2.2;

	this.shader.uniform("cameraPosition", "uniform3fv", GL.camera.position);
	this.shader.uniform("lightPosition", "uniform3fv", lightPos || [0, 0, 0]);
	this.shader.uniform("position", "uniform3fv", pos || [0, 0, 0]);
	this.shader.uniform("baseColor", "uniform3fv", [1, 1, 1]);
	// this.shader.uniform("roughness", "uniform1f", Math.pow(roughness * roughness, 4.0)  );
	this.shader.uniform("roughness", "uniform1f", roughness);
	this.shader.uniform("metallic", "uniform1f", metallic);
	this.shader.uniform("specular", "uniform1f", specular);
	this.shader.uniform("exposure", "uniform1f", exposure);
	this.shader.uniform("gamma", "uniform1f", gamma);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewBall;