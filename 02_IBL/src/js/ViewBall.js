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

	this.mesh = bongiovi.MeshUtils.createSphere(20, 20);
};

p.render = function(pos, lightPos, roughness, metallic) {
	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);
	var specular = 1.0;
	var exposure = 1.5;
	var gamma    = 2.2;

	this.shader.uniform("lightPosition", "uniform3fv", lightPos || [0, 0, 0]);
	this.shader.uniform("position", "uniform3fv", pos || [0, 0, 0]);
	this.shader.uniform("baseColor", "uniform3fv", [.5, 0.5, .095]);
	this.shader.uniform("roughness", "uniform1f", Math.pow(roughness * roughness, 4.0)  );
	this.shader.uniform("metallic", "uniform1f", metallic);
	this.shader.uniform("specular", "uniform1f", specular);
	this.shader.uniform("exposure", "uniform1f", exposure);
	this.shader.uniform("gamma", "uniform1f", gamma);
	GL.draw(this.mesh);
};

module.exports = ViewBall;