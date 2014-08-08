/* MATCH MAKING QUEUE ---------------------------------------------------------
 * Maintains the matchmaking queue and groups players together to form games
 * ------------------------------------------------------------------------- */
function MatchMakingQueue (newGameFunc_) {
	this.GAME_SIZE = 1;

	this.m_queue = [];
	this.handleNewGame = newGameFunc_;
}

// Private functions ----------------------------------------------------------
MatchMakingQueue.prototype._checkForGames = function () {
	if (this.m_queue.length < this.GAME_SIZE)
		return;

	var players = this.m_queue.splice (0, this.GAME_SIZE);
	this.handleNewGame (players);
};

// Public functions -----------------------------------------------------------
MatchMakingQueue.prototype.add = function (client_) {
	this.m_queue.push (client_);

	this._checkForGames ();
};

module.exports = MatchMakingQueue;
