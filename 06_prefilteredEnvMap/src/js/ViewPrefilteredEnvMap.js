// ViewPrefilteredEnvMap.j

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPrefilteredEnvMap(lod) {
	lod = lod == undefined ? 5 : lod;
	this._lod = lod;
	var fs = glslify('../shaders/prefiltredEnvMap.frag');
	var numSamples = Math.floor(8192 / Math.floor( 6 - Math.floor(lod) )*1.00);
	fs = fs.replace('{{NUM_SAMPLES}}', numSamples);

	bongiovi.View.call(this, null, fs);
}

var p = ViewPrefilteredEnvMap.prototype = new bongiovi.View();
p.constructor = ViewPrefilteredEnvMap;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureNormal) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNormal", "uniform1i", 1);
	textureNormal.bind(1);

	this.shader.uniform("uLod", "uniform1f", this._lod);
	this.shader.uniform("uMaxLod", "uniform1f", 6);
	this.shader.uniform("uSize", "uniform1f", 1024);
	GL.draw(this.mesh);
};

module.exports = ViewPrefilteredEnvMap;