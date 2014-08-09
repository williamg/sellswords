/* global Renderer, InputHandler, MenuScene, Button, Label, GameScene, io */

(function () {

/* CLIENT --------------------------------------------------------------------
 * The client is run in the user"s browser. It receives messages from the
 * signal and manages handling the messages. The client also owns a renderer
 * object to draw to the user"s screen.
 * ------------------------------------------------------------------------- */
function Client () {
	// TODO: Authentication
	// var m_authenticated;
	// Username, characters, etc (?)
	// var m_playerInfo;
	this.m_renderer = new Renderer ();
	this.m_inputHandler = new InputHandler (this._handleInput.bind (this));
	this.m_scene = this._createLoadingScreen ();
	this.m_id = undefined;
	this.m_gameData = undefined; // Don't like that this is a member

	this.m_scene.draw ();
	this.m_socket = io.connect ("/");
	this._bindEvents (this.m_socket);
}

// Private functions ----------------------------------------------------------
// Handle various events from the server
Client.prototype._bindEvents = function (socket_) {
	if (socket_ === undefined) {
		console.log ("ERR: bindEvents () called before connect ()");
		return;
	}

	var client = this;

	socket_.on ("connected", function (res_) {
		client.m_id = res_.id;
		// Server has acknowledged the client, time to authenticate
		socket_.emit ("authenticate", null);
	});

	socket_.on ("authenticated", function (res) {
		if (res.success === false) {
			console.log ("ERR: Invalid authentication credentials ().");
			// TODO: Render error/login screen
			return;
		}
			
		// Authentication successful
		console.log ("STAT: User authenticated successfully.");
		// m_playerInfo = res.playerInfo;
		client.m_scene = client._createMainMenu.bind (client) ();
	});

	socket_.on ("newGame", function (data_) {
		console.log ("STAT: Game found.");
		client.m_scene = client._createReadyScreen.bind (client) ();
		client.m_scene.draw ();
		client.m_data = data_;
	});

	socket_.on ("startGame", function (state_) {
		console.log ("STAT: Game started.");
		client.m_scene = new GameScene (client.m_renderer, client.m_id,
										client.m_data, state_,
										client._sendCommand.bind (client));
	});

	socket_.on ("newGameData", function (data_) {
		// Assume/hope/pray that the scene is a game scene
		console.log ("LAG = " + ((new Date ()).getTime () - data_.state.realTime) + "ms");
		client.m_scene.updateState (data_);
	});
};
// Create a loading screen
Client.prototype._createLoadingScreen = function () {
	var scene = new MenuScene (this.m_renderer);
	scene.addElement (new Label ("Loading....", 835, 400));
	return scene;
};
// Create a main menu scene
Client.prototype._createMainMenu = function () {
	var scene = new MenuScene (this.m_renderer);
	scene.addElement (new Button ("Join Game", 835, 400, this._requestGame.bind (this)));
	scene.addElement (new Button ("Options", 835, 510));
	return scene;
};

// Create a ready screen scene
Client.prototype._createReadyScreen = function () {
	var scene = new MenuScene (this.m_renderer);
	scene.addElement (new Button ("Ready!", 835, 400, this._ready.bind (this)));
	return scene;
};

// Receive user input, translate it into the correct coordinate system, and
// pass it off to the scene to be handled
Client.prototype._handleInput = function (event_) {
	// Make coordinate relative to canvas
	var pt = this.m_renderer.translate (event_.x, event_.y);
	event_.x = pt.x;
	event_.y = pt.y;

	this.m_scene.handleInput (event_);
};

// Request a game from ther server
Client.prototype._requestGame = function () {
	this.m_socket.emit ("requestGame");
	// TODO: Show "Searching for game" scene or something
};

// Tell the server that the client is ready to play
Client.prototype._ready = function () {
	this.m_socket.emit ("readyForGame");
};

Client.prototype._sendCommand = function (command_) {
	this.m_socket.emit ("newCommand", command_);
};
// Public functions -----------------------------------------------------------

window.onload = function () {
	new Client ();
};

}) ();
