// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function (a_) {

// This lets us require the action code if this is a server-side engine
if (a_)
	Action = a_;

/* ENGINE ---------------------------------------------------------------------
 * Updates the state of the game
 * ------------------------------------------------------------------------- */
function Engine () {
	this.m_actionQueue = [];
}

Engine.DT = 15;

// Private functions ----------------------------------------------------------
Engine.prototype._applyActions = function (state_) {
	for (var a = 0; a < this.m_actionQueue.length; a++) {
		var action = this.m_actionQueue[a];
		var id = action.clientID;
		var type = action.type;
		
		for (var p = 0; p < state_.players.length; p++) {
			var player = state_.players[p];

			if (player.clientID === id)
				state_.players[p] = this._applyAction (player, type);
		}
	}

	this.m_actionQueue = [];
	return state_;
};

Engine.prototype._applyAction = function (player_, actionType_) {
	if (actionType_ === Action.LEFT)
		player_.vel.x = -1;
	else if (actionType_ === Action.STOP_LEFT)
		player_.vel.x = 0;
	else if (actionType_ === Action.UP)
		player_.vel.y = -1;
	else if (actionType_ === Action.STOP_UP)
		player_.vel.y = 0;
	else if (actionType_ === Action.RIGHT)
		player_.vel.x = 1;
	else if (actionType_ === Action.STOP_RIGHT)
		player_.vel.x = 0;
	else if (actionType_ === Action.DOWN)
		player_.vel.y = 1;
	else if (actionType_ === Action.STOP_DOWN)
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

	gs = this._applyActions (currentState_);
	gs = this._applyPhysics (gs);
	gs.simTime += Engine.DT;

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
	var Action = require (__dirname + '/../shared/action.js');
	module.exports = ex (Action);
} else {
	window.Engine = ex ();
}
