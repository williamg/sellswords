// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function (p_) {

if (p_)
	Player = p_;

/* GAME STATE -----------------------------------------------------------------
 * Holds the current state of the game
 * ------------------------------------------------------------------------- */
function GameState () {
	this.simStartTime = undefined;
	this.simTime = undefined;
	this.realTime = undefined;
	this.players = [];
}

// Static functions -----------------------------------------------------------
GameState.fromConfig = function (config_) {
	var gameState = new GameState ();
	gameState.simStartTime = config_.simStartTime;
	gameState.simTime = config_.simTime;
	gameState.realTime = config_.realTime;

	for (var p = 0; p < config_.players.length; p++)
		gameState.players.push (Player.fromConfig (config_.players[p]));

	return gameState;
};

return GameState;
};

if (typeof window === 'undefined') {
	var Player = require (__dirname + "/player");
	module.exports = ex (Player);
} else {
	window.GameState = ex ();
}
