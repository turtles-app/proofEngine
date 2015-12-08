var Set = function (name, firstEquivalence) {
	this.name = name;
	this.elements = [];
	this.equivalents = []; //List of syntactic representations of the set coded to read with regex
	if (firstEquivalence) {
		this.equivalents.push(firstEquivalence);
	}
	this.eqActiveIndex = 0;
};

//A copy of a set in which a given element will reside
//Called before you add an element to a set;
//Includes the index of the element within the set
var eSet = function (set) {
	this.name = set.name;
	this.elements = set.elements;
	this.equivalents = set.equivalents;
	this.eqActiveIndex = set.eqActiveIndex;
	this.elementIndex = set.length; //Index of particular element for which this eSet exists within set/eSet
}

var Element = function (name, set) {
	this.name = name;
	var firstContainingSet = new eSet(set);
	this.containingSets = []
	this.containingSets.push(set);

	set.elements.push(this);
}

var a = new Set("A");
var b = new Set("B");
var c = new Set("C");

var x = new Element('x', a);
var y = new Element('y', b);



//Function that verifies if an element is in a given atmoic set (A set represented by its own name, not the result of an operation of other sets), 
//based on an array of facts,each of which is a 3 element array like ['x', 'isAnElementOf', 'A']
//Returns true if element is verifiably in the set, and false otherwise
var inAtomic = function(eName, setName, facts) {
	var res = false;
	facts.forEach(function(fact, index, list) {
		if (fact[0] === eName && fact[1] === 'isAnElementOf' && fact[2] === setName) {
			res = true; //Only return true if one of the facts is that element is a member of set
		}
	});
	return res;
};




//Function that verifies if an element is in any set based on
//an array of facts. Element obj's are defined above, and facts are explained in the above comment.

//The Syntax argument is a 3-element array, where the first and third elements are syntactic representations
//of sets; either a string (set's name), or another syntax array. The second element is a string representing the operation.
//Syntax arrays represent the set that results from an operation sets. A U (B n C) = ['A', 'U', ['B', 'n', C]]
var contained = function(eName, syntax, facts) {
	var inFirst  = false;
	var inSecond = false;

	//Is element in the first set?
	switch (typeof(syntax[0])) {
		case 'string':
			inFirst = inAtomic(eName, syntax[0], facts);
			break;
		case 'object':
			inFirst = contained(eName, syntax[0], facts);
			break;
	}

	//Is element in the second set?
	switch (typeof(syntax[2])) {
		case 'string':
			inSecond = inAtomic(eName, syntax[2], facts);
			break;
		case 'object':
			inSecond = contained(eName, syntax[2], facts);
			break;
	}

	//Return true or false, based on inFirst, inSecond, and the set operator (syntax[1])
	switch (syntax[1]) {
		case 'U': //Definition of Union operator
			return inFirst || inSecond;
			break;
		case 'n': //Definition of Intersect operator
			return inFirst && inSecond;
			break;
		case '/': //Definition of Set Difference operator
			return inFirst && (!inSecond);
	}

};


//Test logs. This call asserts: (x is an element of A U (B n C)), based on the facts
//Comment out the facts and run the script to observe whether the above assertion is 
//justified by the facts
console.log("\ncontained output:");
console.log(contained( //inputs:
	//element name
	x.name, 

	//A syntax object. Represents A U (B n C)
	[a.name, 'U', [b.name, 'n', c.name]], 

	//The array of facts
	[
		[x.name, 'isAnElementOf', a.name],//One fact (x is an element of A)
		[x.name, 'isAnElementOf', b.name],//One fact (x is an element of B)
		[x.name, 'isAnElementOf', c.name] //another fact 
	]
));