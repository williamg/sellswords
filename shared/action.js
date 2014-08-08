// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function () {

/* ACTION ---------------------------------------------------------------------
 * Holds information about an action commanded by the user 
 * ------------------------------------------------------------------------- */
function Action (clientID_, id_, type_, simTime_) {
	this.clientID = clientID_;
	this.id = id_;
	this.type = type_;
	this.simTime = simTime_;
	this.realTime = (new Date ()).getTime ();
}

Action.UP			= "up";
Action.STOP_UP		= "stopup";
Action.RIGHT		= "right";
Action.STOP_RIGHT	= "stopright";
Action.LEFT			= "left";
Action.STOP_LEFT	= "stopleft";
Action.DOWN			= "down";
Action.STOP_DOWN	= "stopdown";

return Action;
};

if (typeof window === 'undefined') {
	module.exports = ex ();
} else {
	window.Action = ex ();
}
