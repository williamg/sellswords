/* global Engine, Action, CommandPacket, TEX */
/* GAME SCENE -----------------------------------------------------------------
 * Scene responsible for rendering the game state, telling the server about
 * user input, reciving state updates from the server, and managing the engine.
 * In other words, way too much and it'll probably have to be refactored at
 * some point.
 * ------------------------------------------------------------------------- */
function GameScene (renderer_, clientID_, gameData_, state_, sendCommandFunc_) {
	this.TILE_SIZE = 40;
	this.TILE_WIDTH = renderer_.WIDTH / this.TILE_SIZE;
	this.TILE_HEIGHT = renderer_.HEIGHT / this.TILE_SIZE;

	this.m_renderer = renderer_;
	this.m_clientID = clientID_;
	this.m_gameData = gameData_;
	this.m_curState = state_;
	this.m_sendCommand = sendCommandFunc_;
	this.m_commandPacket = new CommandPacket (0, this.m_curState.simTime, this.m_clientID);
	this.m_commandIndex = 1;
	this.m_unackedCommands = [];
	this.m_unackedStart = 0;
	this.m_engine = new Engine ();

	// Should the engine start here or should it be a separate functions?
	setInterval (this._tick.bind (this), Engine.DT);
	//this.m_engine.start ();
}

// Private functions ----------------------------------------------------------
GameScene.prototype._tick = function () {
	this.m_sendCommand (this.m_commandPacket);
	this.m_unackedCommands.push (this.m_commandPacket);
	this.m_curState = this.m_engine.tick (this.m_curState);
	this._render (this.m_curState);
	this.m_commandPacket = new CommandPacket (this.m_commandIndex++,
											  this.m_curState.simTime,
											  this.m_clientID);
};

// Render the game according to the given state
GameScene.prototype._render = function (state_) {
	// TODO: Render game state
	var player = state_.players[this.m_gameData.index];
	var px = player.pos.x;
	var py = player.pos.y;
	var rw = this.m_renderer.WIDTH;
	var rh = this.m_renderer.HEIGHT;
	var lw = this.m_gameData.level.width * this.TILE_SIZE;
	var lh = this.m_gameData.level.height * this.TILE_SIZE;
	
	// Determine the visible bounds, in pixels
	// Assumes that the level is at least m_renderer.WIDTH wide and 
	// m_renderer.HEIGHT tall
	var minx, miny;
	if (px - (rw / 2) <= 0)
		minx = 0;
	else if (px + (rw / 2) >= lw)
		minx = lw - rw;
	else
		minx = px - (rw / 2);

	if (py - (rh / 2) <= 0)
		miny = 0;
	else if (py + (rh / 2) >= lh)
		miny = lh - rh;
	else
		miny = py - (rh / 2);

	var tileX = Math.floor (minx / this.TILE_SIZE);
	var tileY = Math.floor (miny / this.TILE_SIZE);
	var maxTileX = Math.min (tileX + this.TILE_WIDTH, this.m_gameData.level.width-1);
	var maxTileY = Math.min (tileY + this.TILE_HEIGHT, this.m_gameData.level.height-1);

	// Draw tiles
	this.m_renderer.clear ();
	
	for (var tx = tileX; tx <= maxTileX; tx++)
		for (var ty = tileY; ty <= maxTileY; ty++) {
			var index = (this.m_gameData.level.width * ty + tx) << 2;

			var r = this.m_gameData.level.tiles[index];

			var drawX = tx * this.TILE_SIZE - minx;
			var drawY = ty * this.TILE_SIZE - miny;
			this.m_renderer.drawTexture (TEX.getTx (r), drawX, drawY);
		}
	
	// Draw players
	for (var p = 0; p < state_.players.length; p++)
	{
		var t = state_.players[p];
		this.m_renderer.drawTexture (TEX.PLAYER, t.pos.x - minx, t.pos.y - miny);
	}
};

GameScene.prototype._getAction = function (event_, clientID_) {
	// TODO: Add actions to shared directory
	var actionType;
	var pressed = (event_.type === Event.KEY_DOWN);
	switch (event_.keyCode) {
		case 65:
			actionType = pressed ? Action.LEFT : Action.STOP_LEFT;
			break;
		case 68:
			actionType = pressed ? Action.RIGHT : Action.STOP_RIGHT;
			break;
		case 87:
			actionType = pressed ? Action.UP : Action.STOP_UP;
			break;
		case 83:
			actionType = pressed ? Action.DOWN : Action.STOP_DOWN;
			break;
		default:
			return;
	}

	return new Action (clientID_, this.m_actionIndex++, actionType, this.m_curState.simTime);
};

// Public functions -----------------------------------------------------------
// Add user input to the event queue and send the event to the server
GameScene.prototype.handleInput = function (event_) {
	var action = this._getAction (event_, this.m_clientID);
	
	if (action) {
		this.m_commandPacket.pushAction (action);
		this.m_engine.pushAction (action);
	}
};

// Set the current state of game according to the server's state
GameScene.prototype.updateState = function (data_) {
	var lastCommand = data_.lastAction;
	
	if (lastCommand !== undefined) {
		// Discard all commands before and including that last one acked
		this.m_unackedCommands.splice (0, lastCommand - this.m_unackedStart + 1);
		this.m_unackedStart = lastCommand + 1;
	}
	
	var clientState = data_.state;

	// Need to reapply any unacked commands
	if (this.m_unackedCommands.length > 0) {
		var engine = new Engine ();

		for (var c = 0; c < this.m_unackedCommands.length; c++) {
			var cp = this.m_unackedCommands[c];
			
			for (var a = 0; a < cp.actions.length; a++) {
				engine.pushAction (cp.actions[a]);
			}
			clientState = engine.tick (clientState);
		}
	}

	// Render the new state
	this.m_curState = clientState;
};
