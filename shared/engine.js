// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function () {

/* ENGINE ---------------------------------------------------------------------
 * Updates the state of the game
 * ------------------------------------------------------------------------- */
function Engine () {
	this.m_commandQueue = [];
}

Engine.DT = 15;

// Private functions ----------------------------------------------------------
Engine.prototype._applyCommands = function (state_) {
	for (var a = 0; a < this.m_commandQueue.length; a++) {
		var command = this.m_commandQueue[a];
		var id = command.clientID;

		for (var p = 0; p < state_.players.length; p++) {
			var player = state_.players[p];

			if (player.clientID === id)
				state_.players[p] = this._applyCommand (player, command);
		}
	}

	this.m_commandQueue = [];
	return state_;
};

Engine.prototype._applyCommand = function (player_, command_) {
	if (command_.left)
		player_.vel.x = -1;
	else if (command_.right)
		player_.vel.x = 1;
	else
		player_.vel.x = 0;

	if (command_.up)
		player_.vel.y = -1;
	else if (command_.down)
		player_.vel.y = 1;
	else
		player_.vel.y = 0;
	
	return player_;
};

Engine.prototype._applyPhysics = function (state_) {
	for (var p = 0; p < state_.players.length; p++) {
		var player = state_.players[p];
		player.pos.x += player.vel.x * Engine.DT;
		player.pos.y += player.vel.y * Engine.DT;
		state_.players[p] = player;
	}

	return state_;
};
// Public functions -----------------------------------------------------------
// Advance the state of the simulation
Engine.prototype.tick = function (currentState_) {
	
	var gs = currentState_;
	gs.realTime = (new Date ()).getTime ();
	gs.simTime = currentState_.simTime;

	if (gs.realTime < gs.simStartTime)
		return currentState_;

	gs = this._applyCommands (currentState_);
	gs = this._applyPhysics (gs);
	gs.simTime += Engine.DT;

	return gs;
};

Engine.prototype.pushCommand = function (command_) {
	this.m_commandQueue.push (command_);
};

return Engine;
};

if (typeof window === 'undefined') {
	module.exports = ex ();
} else {
	window.Engine = ex ();
}
