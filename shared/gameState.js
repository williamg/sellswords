// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function () {

	/* GAME STATE -----------------------------------------------------------------
 * Holds the current state of the game
 * ------------------------------------------------------------------------- */
function GameState () {
	this.simStartTime = undefined;
	this.simTime = undefined;
	this.realTime = undefined;
	this.players = [];
}

return GameState;
};

if (typeof window === 'undefined') {
	module.exports = ex ();
} else {
	window.GameState = ex ();
}
