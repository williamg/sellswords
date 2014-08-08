/* global TEX, Event */
/* MENU SCENE -----------------------------------------------------------------
 * This scene is used to build and draw basic menus
 * ------------------------------------------------------------------------- */
function MenuScene (renderer_) {
	this.m_renderer = renderer_;

	this.m_elements = [];
}

// Private functions ----------------------------------------------------------

// Public functions
MenuScene.prototype.addElement = function (element_) {
	this.m_elements.push (element_);
};

MenuScene.prototype.handleInput = function (event_) {
	for (var e = 0; e < this.m_elements.length; e++) {
		this.m_elements[e].handle (event_);
	}

	this.draw ();
};

MenuScene.prototype.draw = function () {
	this.m_renderer.clear ();
	for (var e = 0; e < this.m_elements.length; e++) {
		var element = this.m_elements[e];
		element.draw (this.m_renderer);
	}
};
/* ELEMENT --------------------------------------------------------------------
 * A generic element that can be added to a menu scene
 * ------------------------------------------------------------------------- */
function Element (x_, y_) {
	this.m_x = x_;
	this.m_y = y_;
}

Element.prototype.handle = function (event_) { /* jshint unused: false */ };

/* BUTTON ---------------------------------------------------------------------
 * Button element that can be added to a menu scene
 * ------------------------------------------------------------------------- */
function Button (label_, x_, y_, onclick_) {	
	this.base = Element;
	this.base (x_, y_);
	
	this.WIDTH	= TEX.BUTTON_NORM.w;
	this.HEIGHT = TEX.BUTTON_NORM.h;

	this.m_label = label_;
	this.m_width = this.WIDTH;
	this.m_height = this.HEIGHT;
	this.m_texture = TEX.BUTTON_NORM;
	this.m_onclick = onclick_;

	this.mouseDown = false;
}

Button.prototype = new Element;

// Private functions ----------------------------------------------------------
Button.prototype._inBounds = function (x_, y_)
{
	return (x_ >= this.m_x && x_ <= this.m_x + this.m_width &&
			y_ >= this.m_y && y_ <= this.m_y + this.m_height);
};
// Public functions -----------------------------------------------------------
Button.prototype.handle = function (event_) {
	if (event_.type === Event.MOUSE_MOVE) {
		if (this._inBounds (event_.x, event_.y))
			this.m_texture = TEX.BUTTON_HOVER;
		else
			this.m_texture = TEX.BUTTON_NORM;
	} else if (event_.type === Event.MOUSE_DOWN) {
		this.mouseDown = this._inBounds (event_.x, event_.y);
	} else if (event_.type === Event.MOUSE_UP) {
		if (this.mouseDown && this._inBounds (event_.x, event_.y))
				this.m_onclick ();
	}
};

Button.prototype.draw = function (renderer_) {
	renderer_.drawTexture (this.m_texture, this.m_x, this.m_y);
	renderer_.drawText (this.m_label, this.m_x+35, this.m_y+60);
};

/* LABEL ----------------------------------------------------------------------
 * Text that can be added to a menu scene
 * ------------------------------------------------------------------------- */
function Label (text_, x_, y_) {
	this.base = Element;
	this.base (x_, y_);

	this.m_text = text_;
}

Label.prototype = new Element;

Label.prototype.draw = function (renderer_) {
	renderer_.drawText (this.m_text, this.m_x, this.m_y);
};
