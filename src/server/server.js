var express = require("express");
var path = require("path");

function Server(port) {
	this._express = express();
	this._root = path.resolve (__dirname + "/../../");
	this._port = port;
	this._server = undefined;

	// Setup routing
	var server = this;
	this._express.get("/", function(req, res) {
		res.sendFile(server._root + "/public/index.html");
	});
}

Server.prototype.start = function () {
	this._server = this._express.listen(this._port, function() {
		console.log ("Listening on port 3333");
	});
};

module.exports = Server;
