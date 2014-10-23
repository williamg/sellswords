Logger = require ("../shared/logger");

function createClient () {
	Logger.log(Logger.DEBUG, "Creating client");
}

window.onload = createClient;
