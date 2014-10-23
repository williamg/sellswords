var express = require("express");
var path = require("path");
var Logger = require(__dirname + "/../shared/logger");

function Server(port) {
	this._express = express();
	this._root = path.resolve(__dirname + "/../../");
	this._port = port;
	this._server = undefined;

	// Setup routing
	var server = this;
	this._express.get("/", function(req, res) {
		res.sendFile(server._root + "/public/index.html");
	});
	this._express.use("/", express.static(server._root));

}

Server.prototype.start = function() {
	var s = this;
	this._server = this._express.listen(this._port, function() {
		Logger.log(Logger.INFO, "Listening on port " + s._port);
	});
};

module.exports = Server;
