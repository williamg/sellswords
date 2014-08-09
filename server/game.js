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

	this.TICK_FREQ = Engine.DT;

	this.m_engine = new Engine ();
	this.m_clients = clients_;
	this.m_readys = [];
	this.m_unackedCommands = [];

	for (var i = 0; i < this.m_clients.length; i++) {
		this.m_readys.push (false);
		this.m_unackedCommands.push ([]);
	}

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
	
	for (var i = 0; i < this.m_clients.length; i++) {
		var oldestComm = this.m_unackedCommands[i].splice (0, 1)[0];

		if (oldestComm) {
			this.m_engine.pushCommand (oldestComm);

			this.m_clients[i].lastAction = oldestComm.id;
		}
	}
	
	this.m_liveState = this.m_engine.tick (this.m_liveState);

	for (var c = 0; c < this.m_clients.length; c++) {
		var client = this.m_clients[c];
		var data = {"state": this.m_liveState, "lastAction": client.lastAction};
		client.socket.emit ("newGameData", data);
	}
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

Game.prototype.handleCommand = function (command_) {
	for (var c = 0; c < this.m_clients.length; c++)
		if (this.m_clients[c].id === command_.clientID)
		{
			this.m_unackedCommands[c].push (command_);
			break;
		}
};

module.exports = Game;
