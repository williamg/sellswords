// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function () {

/* PLAYER ---------------------------------------------------------------------
 * Holds the state for a single player
 * ------------------------------------------------------------------------- */
function Player (clientID_) {
	this.clientID = clientID_;
	this.pos = {"x": 0, "y": 0};
	this.vel = {"x": 0, "y": 0};
	this.acc = {"x": 0, "y": 0};
}

return Player;
};

if (typeof window === 'undefined') {
	module.exports = ex ();
} else {
	window.Player = ex ();
}
