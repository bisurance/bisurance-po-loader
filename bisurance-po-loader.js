var parsePo = require("gettext-parser").po.parse;

module.exports = function loadPo(source) {
	this.cacheable();
	// Parse the PO file.
	var originalDocument = parsePo(source);
	// Grab the plural forms formula.
	var pluralFormsFormula;
	if (undefined !== originalDocument.headers) {
		pluralFormsFormula = originalDocument.headers['plural-forms'];
	}
	if (undefined === pluralFormsFormula) {
		pluralFormsFormula = 'nplurals=2; plural=(n != 1);';
		if (undefined !== this.emitWarning) {
			this.emitWarning('This PO document contains no plural forms formula, "nplurals=2; plural=(n != 1)" is assumed');
		}
	}
	// Grab the strings.
	var strings = {};
	Object.keys(originalDocument.translations['']).forEach(function addString(identifier) {
		if (0 == identifier.length) {
			return;
		}
		strings[identifier] = originalDocument.translations[''][identifier]['msgstr'];
	});
	// Return the object. It is possible to return a "module.exports = ×" line here directly, but loaders should do one
	// thing and one thing only. So just use the json-loader for that last part.
	return {
		pluralFormsFormula: pluralFormsFormula,
		strings: strings
	};
};
