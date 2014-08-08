/* RENDERER -------------------------------------------------------------------
 * There should be one renderer per client. The renderer "owns" the canvas and
 * is used by scenes to draw things on the canvas.
 * ------------------------------------------------------------------------- */
function Renderer () {	
	this.WIDTH = 1920;
	this.HEIGHT = 1080;
	this.ASPECT_RATIO = this.WIDTH / this.HEIGHT;

    this.canvas = document.getElementById ('canvas');
    this.context = this.canvas.getContext ('2d'); 

	// Initialize the canvas
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this._resizeCanvas ();

    window.onresize = this._resizeCanvas.bind (this);
}

// Private functions ----------------------------------------------------------
// This function makes the canvas as large as possible within the window while
// maintaining its aspect ratio
Renderer.prototype._resizeCanvas = function () {
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    var cWidth = width;
    var cHeight = height;
	var vPadding = 0;
	var hPadding = 0;

    // The canvas will be the same size as the window in at least one dimension
    // If the window is too short, use the full height and adjust the width
    // If the window is too wide, use the full width and adjust the height
    if (width / this.ASPECT_RATIO > height) {
        cWidth = height * this.ASPECT_RATIO;
		hPadding = (width - cWidth) / 2;
    } else {
        cHeight = width / this.ASPECT_RATIO;
		vPadding = (height - cHeight) / 2;
    }

    this.canvas.style.width = cWidth + 'px';
    this.canvas.style.height = cHeight + 'px';
    this.canvas.style.top = vPadding + 'px';
    this.canvas.style.left = hPadding + 'px';

	this.context.fillRect (0, 0, this.WIDTH, this.HEIGHT);
};

// Public functions -----------------------------------------------------------
// Translate a point from window coordinates to window coordinates
Renderer.prototype.translate = function (wX_, wY_) {
	var rect = this.canvas.getBoundingClientRect ();

	var left = rect.left;
	var top = rect.top;

	var cx = wX_ - left;
	var cy = wY_ - top;

	var width = rect.right - left;
	var height = rect.bottom - top;

	cx = cx / width * this.WIDTH;
	cy = cy / height * this.HEIGHT;

	return {'x': cx, 'y': cy};
};

// Clear everything on the canvas
Renderer.prototype.clear = function () {
	this.context.fillRect (0, 0, this.WIDTH, this.HEIGHT);
};

// Draw a texture on the canvas
Renderer.prototype.drawTexture = function (texture_, x_, y_) {
/*	
	if (x_ + w_ <= 0 || x_ > this.WIDTH || y_ + h_ <= 0 || y_ > this.HEIGHT)
		return;
*/	
	this.context.drawImage (texture_.img, texture_.x, texture_.y,
							texture_.w, texture_.h, x_, y_,
							texture_.w, texture_.h);
};

// Draw some text on the canvas
Renderer.prototype.drawText = function (text_, x_, y_) {
	this.context.fillStyle = "white";
	this.context.font = "24pt Arial";
	this.context.fillText (text_, x_, y_);
	this.context.fillStyle = "black";
};
