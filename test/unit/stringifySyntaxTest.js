var should = require('chai').should();
// var app = require("../../proofEngine.js");
var setEngine = require("../../setEngine.js");

describe("stringifySyntax() Test", function() {
	it("'A' returns 'A'", function(){
		var str = setEngine.stringifySyntax("A");
		str.should.equal("A");
	});

	it("['B', 'n', 'C'] returns 'B n C'", function(){
		var str = setEngine.stringifySyntax(["B", "n", "C"]);
		str.should.equal("B n C");
	});

	it("[['B', 'n', 'C'], 'n', A] returns '(B n C) n A'", function() {
		var str = setEngine.stringifySyntax([["B", "n", "C"], "n", "A"]);
		str.should.equal("(B n C) n A");
	});

	it("['A', 'n', ['B', 'n', 'C'] returns 'A n (B n C)'", function() {
		var str = setEngine.stringifySyntax(['A', 'n', ['B', 'n', 'C']]);
		str.should.equal("A n (B n C)");
	});

	it("[['A', 'n', 'B'], 'U', ['C', 'n' 'D']] returns '(A n B) U (C n D)", function(){
		var str = setEngine.stringifySyntax([['A', 'n', 'B'], 'U', ['C', 'n', 'D']]);
		str.should.equal("(A n B) U (C n D)");
	});

	it("[[['A', 'n', 'B'], 'U', ['C', 'n', 'D']], 'n', ['E', 'U', 'F']] returns '((A n B) U (C n D)) n (E U F)", function(){
		var str = setEngine.stringifySyntax([[['A', 'n', 'B'], 'U', ['C', 'n', 'D']], 'n', ['E', 'U', 'F']]);
		str.should.equal("((A n B) U (C n D)) n (E U F)");
	});
});