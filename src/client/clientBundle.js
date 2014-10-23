(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Logger = require ("../shared/logger");

function createClient () {
	console.log ("TEST");
	Logger.log(Logger.DEBUG, "Creating client");
}

window.onload = createClient;

},{"../shared/logger":2}],2:[function(require,module,exports){
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

},{"./utility":3}],3:[function(require,module,exports){
// The utility is simply a class of helpful utility functions
function Utility() {
	this._date = new Date();
}

Utility.prototype.getTimestamp = function() {
	return this._date.getTime();
};

// Type checking
Utility.prototype.isInt = function(val) {
	return (typeof val === "number" && isFinite(val) && val % 1 === 0);
};

Utility.prototype.isStringLiteral = function(val) {
	return (typeof val === "string");
};

Utility.prototype.isStringObject = function(val) {
	return (typeof val === "object" && val.constructor === String);
};

Utility.prototype.isString = function(val) {
	return (this.isStringLiteral(val) || this.isStringObject(val));
};

// Utility is a singleton
Utility.instance = undefined;

Utility.getInstance = function() {
	if(Utility.instance === undefined)
		Utility.instance = new Utility();

	return Utility.instance;
};

module.exports = Utility.getInstance();

},{}]},{},[1,2,3]);
