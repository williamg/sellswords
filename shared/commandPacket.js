// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function () {

/* COMMAND PACKET -------------------------------------------------------------
 * A group of actions to be sent to the server
 * ------------------------------------------------------------------------- */
function CommandPacket (id_, simTime_, clientID_) {
	this.clientID = clientID_;
	this.id = id_;
	this.simTime = simTime_;
	this.realTime = (new Date ()).getTime ();
	this.actions = [];
}

CommandPacket.prototype.pushAction = function (action_) {
	this.actions.push (action_);
};

return CommandPacket;
};

if (typeof window === 'undefined') {
	module.exports = ex ();
} else {
	window.CommandPacket = ex ();
}
