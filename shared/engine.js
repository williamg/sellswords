// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function () {
/* ENGINE ---------------------------------------------------------------------
 * Updates the state of the game
 * ------------------------------------------------------------------------- */
function Engine () {
	this.DT = 100;

	this.m_actionQueue = [];
}

// Private functions ----------------------------------------------------------
Engine.prototype._applyActions = function (state_) {
	for (var a = 0; a < this.m_actionQueue.length; a++) {
		var id = this.m_actionQueue[a].id;
		var actionStr = this.m_actionQueue[a].actionStr;
		
		for (var p = 0; p < state_.players.length; p++) {
			var player = state_.players[p];

			if (player.clientID === id)
				state_.players[p] = this._applyAction (player, actionStr);
		}
	}

	this.m_actionQueue = [];
	return state_;
};

Engine.prototype._applyAction = function (player_, actionStr_) {
	if (actionStr_ === "left")
		player_.vel.x = -1;
	else if (actionStr_ === "stopleft")
		player_.vel.x = 0;
	else if (actionStr_ === "up")
		player_.vel.y = -1;
	else if (actionStr_ === "stopup")
		player_.vel.y = 0;
	else if (actionStr_ === "right")
		player_.vel.x = 1;
	else if (actionStr_ === "stopright")
		player_.vel.x = 0;
	else if (actionStr_ === "down")
		player_.vel.y = 1;
	else if (actionStr_ === "stopdown")
		player_.vel.y = 0;
	
	return player_;
};

Engine.prototype._applyPhysics = function (state_) {
	for (var p = 0; p < state_.players.length; p++) {
		var player = state_.players[p];
		player.pos.x += player.vel.x * this.DT;
		player.pos.y += player.vel.y * this.DT;
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

	var simTime = gs.realTime - gs.simStartTime;
	var unaccounted = simTime - currentState_.simTime;
	
	while (unaccounted > this.DT) {
		gs = this._applyActions (currentState_);
		gs = this._applyPhysics (gs);
		unaccounted -= this.DT;
		gs.simTime += this.DT;
	}

	return gs;
};

Engine.prototype.pushAction = function (action_) {
	this.m_actionQueue.push (action_);
};

/*
Engine.prototype.createAction = function (action, playerID) {
	return {'action': action, 'playerID': playerID};
};

Engine.prototype.queueAction = function (action) {
	this.actionQueue.push (action);
};

Engine.prototype.updateState = function () {
	var d = new Date (); 
	var time = d.getTime ();
	var dt = time - this.state.time;
	this.leftover += dt;

	var newState = new GameState ();
	newState.level = this.state.level;
	newState.players = this.state.players;
	this.applyActions ();
	
	while (this.leftover > TICK_INTERVAL) {
		this.leftover -= TICK_INTERVAL;
		this.tick ();
	}
	console.log (newState.players[0].pos);
	this.state = newState;

};

Engine.prototype.applyActions = function () {
	while (this.actionQueue.length > 0)
	{
		var action = this.actionQueue[0];
		this.actionQueue.splice (0, 1);

		var player = this.getPlayer (action.playerID);
		var actionStr = action.action;
		var moveSpeed = 10;

		if (actionStr === 'up')
		{
			player.vel.y = -moveSpeed;
		} 
		else if (actionStr === 'stopUp')
		{
			if (player.vel.y === -moveSpeed)
				player.vel.y = 0;
		}
		else if (actionStr === 'down')
		{
			player.vel.y = moveSpeed;
		}
		else if (actionStr === 'stopDown')
		{
			if (player.vel.y === moveSpeed)
				player.vel.y = 0;
		}
		else if (actionStr === 'right')
		{
			player.vel.x = 10;
		}
		else if (actionStr === 'stopRight')
		{
			if (player.vel.x === moveSpeed)
				player.vel.x = 0;
		}
		else if (actionStr === 'left')
		{
			player.vel.x = -10;
		}
		else if (actionStr === 'stopLeft')
		{
			if (player.vel.x === -moveSpeed)
				player.vel.x = 0;
		}
	}
};
*/
return Engine;
};

if (typeof window === 'undefined') {
	module.exports = ex ();
} else {
	window.Engine = ex ();
}
