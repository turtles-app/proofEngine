var setEngine = require('./setEngine.js');

//Returns the union of two sets (another set) with the given name
var union = function(name, x, y) {
	var unionSyntax = [x.equivalents[x.eqActiveIndex], 'U', y.equivalents[y.eqActiveIndex]];
	var res = new setEngine.Set(name, unionSyntax);
	// var eRes = new setEngine.eSet(res);
	//Put everything from x into res
	x.elements.forEach(function(e, i, list) {
		e.containingSets.push(new setEngine.cpShell(res.setShell));
		res.setShell.elementIndex++;
		res.elements.push(e);
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
			e.containingSets.push(new setEngine.cpShell(res.setShell));
			res.setShell.elementIndex++;
			res.elements.push(e);
		}
	});

	return res;
}


module.exports = {
	union: union
}