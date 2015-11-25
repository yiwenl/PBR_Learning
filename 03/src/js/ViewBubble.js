// ViewBubble.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBubb() {
	bongiovi.View.call(this, glslify("../shaders/bubble.vert"), glslify("../shaders/bubble.frag"));
}

var p = ViewBubb.prototype = new bongiovi.View();
p.constructor = ViewBubb;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var num = 40;
	var count = 0;

	for(var j=0; j<num/2; j++) {
		for(var i=0; i<num; i++) {
			positions.push([i, j+1, num]);
			positions.push([i+1, j+1, num]);
			positions.push([i+1, j, num]);
			positions.push([i, j, num]);

			coords.push([i/num, j/(num/2)]);
			coords.push([(i+1)/num, j/(num/2)]);
			coords.push([(i+1)/num, (j+1)/(num/2)]);
			coords.push([i/num, (j+1)/(num/2)]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;
		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	this.shader.uniform("size", "uniform1f", 100);
	GL.draw(this.mesh);
};

module.exports = ViewBubb;