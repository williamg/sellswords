// Usable as a module both serverside and clientside
// From http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/
var ex = function () {

/* UTILITY --------------------------------------------------------------------
 * Non-class specific functionality
 * ------------------------------------------------------------------------- */
function Utility () {}

Utility.clamp = function (min_, max_, val_) {
	return Math.min (Math.max (val_, min_), max_);
};

Utility.interpolate = function (val1_, val2_, strength_) {
	strength_ = Utility.clamp (0, 1, strength_);
	return (strength_ * val1_) + ((1 - strength_) * val2_);
};

return Utility;
};

if (typeof window === 'undefined') {
	module.exports = ex ();
} else {
	window.Utility = ex ();
}
