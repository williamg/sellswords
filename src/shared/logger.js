var Utility = require("./utility");

// The logger is a simple, consolidated class that controls output written
// to the console/log files
function Logger() {
	this._currentLogLevel = Logger.ALL;
	this._timestamps = true;
}

// Logging levels
Logger.prototype.ALL		= 0;
Logger.prototype.INFO		= 0;
Logger.prototype.DEBUG	= 1;
Logger.prototype.WARNING	= 2;
Logger.prototype.ERROR	= 3;
Logger.prototype.FATAL	= 4;
Logger.prototype.NONE		= 5;

Logger.prototype._getLogLevelString = function(logLevel) {
	if(!Utility.isInt(logLevel)) {
		this.log(Logger.ERROR, "logger.js:22: Expected int.");
		return;
	}

	if(logLevel === 0) return "INFO";
	if(logLevel === 1) return "DEBUG";
	if(logLevel === 2) return "WARNING";
	if(logLevel === 3) return "ERROR";
	if(logLevel === 4) return "FATAL";
};

Logger.prototype.setLogLevel = function(logLevel) {
	if(!Utility.isInt(logLevel)) {
		this.log(Logger.ERROR, "logger.js:setLogLevel: Expected int.");
		return;
	}

	this._currentLogLevel = logLevel;
};

Logger.prototype.displayTimestamps = function(displayTimestamps) {
	this._timestamps = displayTimestamps;
};

Logger.prototype.log = function(logLevel, msg) {
	if(!Utility.isInt(logLevel)) {
		this.log(Logger.ERROR, "logger.js:log: Expected int.");
		return;
	}

	if(!Utility.isString(msg)) {
		this.log(Logger.ERROR, "logger.js:log: Expected string.");
		return;
	}
	
	if(logLevel < this._currentLogLevel)
		return;

	var ts = (this._timestamps) ? "[" + Utility.getTimestamp() + "] " : "";
	var out = ts + this._getLogLevelString(logLevel) + ": " + msg;
	console.log(out);
};

// Logger is a singleton
Logger.instance = undefined;

Logger.getInstance = function() {
	if(Logger.instance === undefined)
		Logger.instance = new Logger();

	return Logger.instance;
};

module.exports = Logger.getInstance();
