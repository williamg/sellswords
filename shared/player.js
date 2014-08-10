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

Player.fromConfig = function (config_) {
	var player = new Player (config_.clientID);

	// Assign the values not the objects so that the values are copied not the
	// references to the objects
	player.pos.x = config_.pos.x;
	player.pos.y = config_.pos.y;
	player.vel.x = config_.vel.x;
	player.vel.y = config_.vel.y;
	player.acc.x = config_.acc.x;
	player.acc.y = config_.acc.y;

	return player;
};

return Player;
};

if (typeof window === 'undefined') {
	module.exports = ex ();
} else {
	window.Player = ex ();
}
