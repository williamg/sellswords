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
