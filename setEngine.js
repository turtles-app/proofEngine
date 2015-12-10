var proofEngine = require('./proofEngine.js');

var Set = function (name, firstEquivalence) {
	this.equivalents = [name]; //List of syntactic representations of the set coded to read with regex
	this.elements = [];
	
	if (firstEquivalence) {
		this.equivalents.push(firstEquivalence);
	}
	this.eqActiveIndex = 0;

};
	Set.prototype.contains = proofEngine.contains;

//A copy of a set in which a given element will reside
//Called before you add an element to a set;
//Includes the index of the element within the set
var eSet = function (set) {
	this.equivalents = set.equivalents;
	this.eqActiveIndex = set.eqActiveIndex;
	this.elementIndex = set.elements.length; //Index of particular element for which this eSet exists within set/eSet
}

var Element = function (name, set) {
	this.name = name;
	var firstContainingSet = new eSet(set);
	this.containingSets = [];
	this.containingSets.push(firstContainingSet);

	set.elements.push(this);
}


module.exports = {
	Set: Set,
	Element: Element,
	eSet: eSet,
};