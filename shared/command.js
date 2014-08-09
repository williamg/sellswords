// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function (a_) {

if (a_)
	Action = a_;

/* COMMAND -------------------------------------------------------------------
 * Composes actions to form a complete command
 * ------------------------------------------------------------------------- */
function Command (clientID_, id_) {
	this.clientID = clientID_;
	this.id = id_;

	this.up = undefined;
	this.down = undefined;
	this.left = undefined;
	this.right = undefined;
	
}

Command.prototype.applyAction = function (action_) {
	switch (action_.type) {
		case Action.UP:
			this.up = action_.realTime;
			break;
		case Action.STOP_UP:
			this.up = undefined;
			break;
		case Action.DOWN:
			this.down = action_.realTime;
			break;
		case Action.STOP_DOWN:
			this.down = undefined;
			break;
		case Action.RIGHT:
			this.right = action_.realTime;
			break;
		case Action.STOP_RIGHT:
			this.right = undefined;
			break;
		case Action.LEFT:
			this.left = action_.realTime;
			break;
		case Action.STOP_LEFT:
			this.left = undefined;
	}
};

Command.prototype.generate = function () {
	var command = {
		"id": this.id,
		"clientID": this.clientID,
		"up": false,
		"down": false,
		"left": false,
		"right": false
	};

	if (this.up && this.down) {
		command.up = this.up > this.down;
		command.down = !command.up;
	} else {
		command.up = (this.up !== undefined);
		command.down = (this.down !== undefined);
	}

	if (this.left && this.right) {
		command.left = this.left > this.right;
		command.right = !command.left;
	} else {
		command.left = (this.left !== undefined);
		command.right = (this.right !== undefined);
	}

	return command;
};

return Command;
};

if (typeof window === 'undefined') {
	var Action = require ("action.js");
	module.exports = ex (Action);
} else {
	window.Command = ex ();
}
