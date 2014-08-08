var TEX = {};

(function () {

var textureSrc = "/resources/textures.png";
var img = new Image ();
img.src = textureSrc;

TEX.BACKGROUND = {
    "x": 0,
    "y": 0,
    "w": 40,
    "h": 40,
	"img": img
};

TEX.FOREGROUND = {
    "x": 40,
    "y": 0,
    "w": 40,
    "h": 40,
	"img": img
};

TEX.PLAYER = {
	"x": 0,
	"y": 40,
	"w": 40,
	"h": 80,
	"img": img
};

TEX.BUTTON_NORM = {
	"x": 0,
	"y": 300,
	"w": 250,
	"h": 100,
	"img": img
};

TEX.BUTTON_HOVER = {
	"x": 250,
	"y": 300,
	"w": 250,
	"h": 100,
	"img": img
};

TEX.getTx = function (r_) {
	if (r_ === 0)
		return TEX.FOREGROUND;
	else if (r_ === 255)
		return TEX.BACKGROUND;
};

}) ();
