/* EVENT ---------------------------------------------------------------------
 * Stores information about a user input event
 * ------------------------------------------------------------------------- */
function Event (type_, x_, y_, keyCode_) {
	this.type = type_;
	this.x = x_;
	this.y = y_;
	this.keyCode = keyCode_;
}

Event.MOUSE_MOVE	= "mouseMove";
Event.MOUSE_DOWN	= "mouseDown";
Event.MOUSE_UP		= "mouseUp";
Event.KEY_DOWN		= "keyDown";
Event.KEY_UP		= "keyUp";

/* INPUT HANDLER --------------------------------------------------------------
 * Handles user input 
 * ------------------------------------------------------------------------- */
function InputHandler (handleFunc_) {
	this.m_handleEvent = handleFunc_;

	window.addEventListener ("mousemove", this.handleMouseMove.bind (this));
	window.addEventListener ("mousedown", this.handleMouseDown.bind (this));
	window.addEventListener ("mouseup", this.handleMouseUp.bind (this));
	window.addEventListener ("keydown", this.handleKeyDown.bind (this));
	window.addEventListener ("keyup", this.handleKeyUp.bind (this));

}

InputHandler.prototype.handleMouseMove = function (e_) {
	var ev = new Event (Event.MOUSE_MOVE, e_.clientX, e_.clientY, undefined);
	this.m_handleEvent (ev);
};

InputHandler.prototype.handleMouseDown = function (e_) {
	var ev = new Event (Event.MOUSE_DOWN, e_.clientX, e_.clientY, undefined);
	this.m_handleEvent (ev);
};

InputHandler.prototype.handleMouseUp = function (e_) {
	var ev = new Event (Event.MOUSE_UP, e_.clientX, e_.clientY, undefined);
	this.m_handleEvent (ev);
};

InputHandler.prototype.handleKeyDown = function (e_) {
	var ev = new Event (Event.KEY_DOWN, e_.clientX, e_.clientY, e_.keyCode);
	this.m_handleEvent (ev);
};

InputHandler.prototype.handleKeyUp = function (e_) {
	var ev = new Event (Event.KEY_UP, e_.clientX, e_.clientY, e_.keyCode);
	this.m_handleEvent (ev);
};
