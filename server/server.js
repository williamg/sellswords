(function () {

// Modules
var express = require ("express");
//var uuid	= require ("node-uuid");
var path	= require ("path");
var io		= require ("socket.io");
var MatchMakingQueue	= require (__dirname + "/matchMaking");
var Game	= require (__dirname + "/game");

/* SERVER  --------------------------------------------------------------------
 * There should ever only be a single server. The server receives and manages
 * client connections.
 * ------------------------------------------------------------------------- */
function Server (port_) {
	this.PORT		= port_;
	/// TODO: Should become global to the project or something
	this.BASE_DIR	= path.resolve (__dirname + "/../");
	this.m_clients = [];
	this.m_queue = new MatchMakingQueue (this._handleNewGame.bind (this));

	console.log ("STAT: Server started on port " + this.PORT);

	var app = express ();
	var service = app.listen (this.PORT);

	this._setupRouting (app);
	this._bindEvents (service);
}

// Private functions ----------------------------------------------------------
// Tell the server how to handle different requests
Server.prototype._setupRouting = function (app_) {

	var server = this;

	app_.get ("/", function (req, res) {
		res.sendfile (server.BASE_DIR + "/index.html");
	});

	// Handle other pages
	// Load resources
	app_.get ("/*", function (req, res) {
		var file = req.params[0];

		res.sendfile (server.BASE_DIR + "/"  + file);
	});
};

// Tell the server how to respond to events
Server.prototype._bindEvents = function (service_) {
	var server = this;	
	var sio = io.listen (service_);
	// New user on the page
	sio.sockets.on ("connection", function (socket_) {
		// Create a new client
		server._handleNewClient (socket_);

		socket_.emit ("connected", {"id": socket_.id});
	});
};

// Handle a new client connection
Server.prototype._handleNewClient = function (socket_) {
	var client = {};
	client.id = socket_.id;
	client.index = this.m_clients.length;
	client.socket = socket_;
	client.game = undefined;

	this._bindClientEvents (client);
	this.m_clients.push (client);

	console.log ("STAT: Client connected: " + client.id);
};

// Tell the server how to respond to client events
Server.prototype._bindClientEvents = function (client_) {
	var server = this;

	client_.socket.on ("authenticate", function (data_) {
		client_.socket.emit ("authenticated", server._authClient (data_));
	});

	client_.socket.on ("disconnect", function (res_) {
		console.log ("STAT: Client disconnected: " + client_.id + "\nINFO: " + res_);
		server.m_clients = server.m_clients.splice (1, client_.index);
	});

	client_.socket.on ("requestGame", function () {
		server.m_queue.add (client_);
		// Tell the user that they"ve been put in the queue
	});

	client_.socket.on ("readyForGame", function () {
		client_.game.setReady (client_);
	});

	client_.socket.on ("newAction", function (action_) {
		client_.game.handleAction (action_);
	});
};

// Authorize a client based on some credentials
Server.prototype._authClient = function (data_) {
	/* jshint unused: false */	
	return {"success": true};
};

// Create a new game with the designate players
Server.prototype._handleNewGame = function (players_)
{
	var game = new Game (players_);
	console.log ("found game");
	for (var p = 0; p < players_.length; p++) {
		var player = players_[p];
		player.game = game;

		game.clientData (player.id, function (data_) {
			var player = players_[data_.index];
			player.socket.emit ("newGame", data_);
		});
	}
};

new Server (3333);

}) ();
