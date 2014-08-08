var Engine = require (__dirname + "/../shared/engine");
var GameState = require (__dirname + "/../shared/gameState");
var Player = require (__dirname + "/../shared/player");
var fs		= require ("fs");
var PNG		= require ("pngjs").PNG;

/* GAME -----------------------------------------------------------------------
 * Controls the game on the server side. Manager synchronization between
 * clients and owns the engine. Sends the state to clients
 * ------------------------------------------------------------------------- */
function Game (clients_) {

	this.TICK_FREQ = 100;

	this.m_engine = new Engine ();
	this.m_clients = clients_;
	this.m_readys = [];

	for (var i = 0; i < this.m_clients.length; i++)
		this.m_readys.push (false);

	this.m_liveState = undefined;
}

// Private functions ----------------------------------------------------------
// Start the game
Game.prototype._startGame = function () {
	this.m_liveState = this._generateInitialState ();

	for (var c = 0; c < this.m_clients.length; c++)
		this.m_clients[c].socket.emit ("startGame", this.m_liveState);

	setInterval (this._tick.bind (this), this.TICK_FREQ);
};

Game.prototype._generateInitialState = function () {
	var state = new GameState ();
	state.simTime = 0;
	state.realTime = state.simStartTime;

	for (var p = 0; p < this.m_clients.length; p++) {
		state.players.push (new Player (this.m_clients [p].id));
	}

	state.simStartTime = (new Date ()).getTime ();
	return state;
};

// Load level data
Game.prototype._loadLevelData = function (callback_) {
	// Load the tile data
	var level = {};

	fs.createReadStream (__dirname + "/../resources/level.png")
		.pipe (new PNG({
			filterType:4
		}))
		.on ("parsed", function () {
			level.width = this.width;
			level.height = this.height;

			level.tiles = [];
			for (var i = 0; i < this.data.length; i++) {
				var val = parseInt (this.data[i].toString (16), 16);
				level.tiles.push (val);
			}
			
			return callback_ (level);
		});
};

// Advance the live state of the game by one tick and send it to clients
Game.prototype._tick = function () {
	this.m_liveState = this.m_engine.tick (this.m_liveState);

	for (var c = 0; c < this.m_clients.length; c++)
		this.m_clients[c].socket.emit ("newGameState", this.m_liveState);
};


// Public functions -----------------------------------------------------------
// Remember that the specified client is ready to play. If that client was
// the last client (i.e. all other clients are also ready) then start the game.
Game.prototype.setReady = function (client_) {

	var numReadys = 0;
	
	for (var c = 0; c < this.m_clients.length; c++) {
		if (this.m_readys[c] === true)
			numReadys++;

		if (this.m_clients[c] === client_)
		{
			this.m_readys[c] = true;
			numReadys++;
		}
	}

	if (numReadys === this.m_readys.length)
		this._startGame ();
};

// Retrieve static (client-specific) data. This includes level information, 
// the index of the given client in the player array, and the ids of the other
// players.
Game.prototype.clientData = function (clientID_, callback_) {
	var game = this;	
	this._loadLevelData (function (level_) {

		var index;
		for (var c = 0; c < game.m_clients.length; c++)
			if (game.m_clients[c].id === clientID_)
				index = c;

		var data = {"level": level_, "index": index};
		return callback_ (data);
	});
};

Game.prototype.handleAction = function (action_) {
	this.m_engine.pushAction (action_);
};
/*
// Handle user input
Game.prototype.handleInput = function (input) {
	var clientID = input.id;
	var keyCode = input.keyCode;
	var action; 

	switch (keyCode) {
	case 87:
		action = "up";
		break;
	case -87:
		action = "stopUp";
		break;
	case 83:
		action = "down";
		break;
	case -83:
		action = "stopDown";
		break;
	case 68:
		action = "right";
		break;
	case -68:
		action = "stopRight";
		break;
	case 65:
		action = "left";
		break;
	case -65:
		action = "stopLeft";
		break;
	default:
		console.log ("Unsupported keycode");
		return; 
	}

	var actionObj = this.engine.createAction (action, clientID);
	this.engine.queueAction (actionObj);
};
*/
module.exports = Game;