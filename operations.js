var setEngine = require('./setEngine.js');

//Returns the union of two sets (another set) with the given name
var union = function(name, x, y) {
	var unionSyntax = [x.equivalents[x.eqActiveIndex], 'U', y.equivalents[y.eqActiveIndex]];
	var res = new setEngine.Set("union", name, unionSyntax);
	//Put everything from x into res
	x.elements.forEach(function(e, i, list) {
		res.putIn(e);
	});

	//Put elements of y not already in res into res
	y.elements.forEach(function(e, i, list) {
		var goesIn = true;
		res.elements.forEach(function(el, index) {
			if (e.name === el.name) {
				goesIn = false;
			}
		});
		if (goesIn) {
			res.putIn(e);		}
	});

	return res;
}

//Returns the intersection of two sets (another set) with the given name
var intersection = function(name, x, y) {
	var intersectSyntax = [x.equivalents[x.eqActiveIndex], 'n', y.equivalents[y.eqActiveIndex]];
	//Create the new set (will be empty)
	var res = new setEngine.Set("intersection", name, intersectSyntax);
	//Put the common elements from x into res
	x.elements.forEach(function(element, index, list) {
		y.elements.forEach(function(yElement, yIndex, yList) {
			if (element.name === yElement.name) {
				res.putIn(element);
			}
		});
	});

	return res;
};


module.exports = {
	union: union,
	intersection: intersection
}