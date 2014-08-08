/* global Engine, Action, TEX */
/* GAME SCENE -----------------------------------------------------------------
 * Scene responsible for rendering the game state, telling the server about
 * user input, reciving state updates from the server, and managing the engine.
 * In other words, way too much and it'll probably have to be refactored at
 * some point.
 * ------------------------------------------------------------------------- */
function GameScene (renderer_, clientID_, gameData_, state_, sendActionFunc_) {
	this.TILE_SIZE = 40;
	this.TILE_WIDTH = renderer_.WIDTH / this.TILE_SIZE;
	this.TILE_HEIGHT = renderer_.HEIGHT / this.TILE_SIZE;

	this.m_renderer = renderer_;
	this.m_clientID = clientID_;
	this.m_gameData = gameData_;
	this.m_curState = state_;
	this.m_sendAction = sendActionFunc_;
	this.m_actionIndex = 0;
	//this.m_engine = new Engine ();

	// Should the engine start here or should it be a separate functions?
	//this.m_engine.start ();
}

// Private functions ----------------------------------------------------------
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

	console.log (minx + " " + miny);
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
			console.log ("Unsupported keycode");
			break;
	}

	return new Action (clientID_, this.m_actionIndex++, actionType, undefined);
};

// Public functions -----------------------------------------------------------
// Add user input to the event queue and send the event to the server
GameScene.prototype.handleInput = function (event_) {
	var action = this._getAction (event_, this.m_clientID);
	this.m_sendAction (action);
};

// Set the current state of game according to the server's state
GameScene.prototype.setState = function (state_) {
	this.m_curState = state_;
	this._render (this.m_curState);
};
