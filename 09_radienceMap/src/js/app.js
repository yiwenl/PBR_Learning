// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

window.params = {
	gamma:2.2,
	exposure:4.0,
	baseColor:[1, 1, 1],
	roughness:1.0,
	metallic:1.0,
	specular:1.0
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var l = new bongiovi.SimpleImageLoader();
		var a = ["assets/radienceMap.jpg", "assets/envMap.jpg"];
		l.load(a, this, this._onImageLoaded);

		
	}

	var p = App.prototype;

	p._onImageLoaded = function(imgs) {
		console.log(imgs);
		window.images = imgs;
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	};

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		this.gui = new dat.GUI({width:300});
		this.gui.add(params, 'roughness', 0, 1);
		this.gui.add(params, 'metallic', 0, 1);
		this.gui.add(params, 'specular', 0, 1);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();