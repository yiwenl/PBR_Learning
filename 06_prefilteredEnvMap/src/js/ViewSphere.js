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

p.render = function(texture, fbos) {
	this.shader.bind();
	this.shader.uniform("texture0", "uniform1i", 0);
	texture.bind(0);

	for(var i=0; i<fbos.length; i++) {
		var index = i + 1;
		var t = fbos[i].getTexture();
		this.shader.uniform("texture"+index, "uniform1i", index);
		t.bind(index);
	}

	var roughness = params.roughness;
	// roughness = Math.pow(roughness*roughness, 4.0);
	this.shader.uniform("roughness", "uniform1f", roughness);
	GL.draw(this.mesh);
};

module.exports = ViewSphere;