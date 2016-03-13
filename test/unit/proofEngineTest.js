
var should = require('chai').should();
var app = require("../../proofEngine.js");
var setEngine = require("../../setEngine.js");
var val;

var fact1 =  new setEngine.Fact('x', true, 'A'), fact2 = new setEngine.Fact('x', true, 'B'), fact3 = new setEngine.Fact('x', false, 'C'), 
fact4 = new setEngine.Fact("x", false, "A"), fact5 = new setEngine.Fact("x", true, "C"), fact6 = new setEngine.Fact('x', true, 'D'),
fact7 = new setEngine.Fact("x", true, [["B", "n", "C"], "n", "D"]),
fact8 = new setEngine.Fact("y", true, [["B", "n", "C"], "n", "D"]),
fact9 = new setEngine.Fact("x", true, ["B", "n", "C"]),
factA = new setEngine.Fact("x", true, ["A", "U", ["B", "n", "C"]]);
factB = new setEngine.Fact("x", false, ["B", "n", "C"]),
factC = new setEngine.Fact("x", true, ["A", "n", "B"]),
factD = new setEngine.Fact("x", true, ["A", "/", "B"]),
factE = new setEngine.Fact("x", true, ["A", "U", "B"]),
factF = new setEngine.Fact("x", false, ["A", "U", "B"]);

//	fact1 represents "x is in A"
// 	fact2 represents "x is in B"
//	fact3 represents "x is not in C"
//	fact4 represents "x is not in A"
//	fact5 represents "x is in C"
//	fact6 represents "x is in D"
//	fact7 represents "x is in (B n C) n D"
// 	fact8 represents "y is in (B n C) n D"
//	fact9 represents "x is in B n C"
//	factA represents "x is in A U (B n C)"
//	factB represents "x is not in B n C"
//	factC represents "x is in A n B"
//	factD represents "x is in A / B"
//	factE represents "x is in A U B"
//	factF represents "x is not in A U B"
describe('inAtomic() Function verifies atomic assertions (e.g. x is in A)', function() {
	describe('valid arguments', function() {
		it('1 salient fact', function() {
			val = app.inAtomic('x', 'A', [fact1]);
			val.should.equal(true);
		});

		it('1 sailent, 2 irrelevant facts', function() {
			val = app.inAtomic('x', 'A', [fact1, fact2, fact3]);
			val.should.equal(true);
		});

		describe("Simple facts can be concluded from complex ones", function() {
			describe("Parsing Intersection facts:", function(){
				it("because x is in A n B justifies 'x is in A'", function() {
					val = app.inAtomic("x", "A", [factC]);
					val.should.equal(true);
				});
				it("because x is in A n B justifies 'x is in B'", function(){
					val = app.inAtomic("x", "B", [factC]); 
					val.should.equal(true);
				});
			});

			describe("Parsing Set Difference facts:", function(){
				it("because x is in A/B justifies 'x is in A'", function(){
					val = app.inAtomic("x", "A", [factD]);
					val.should.equal(true);
				});
			});

			describe("Parsing Union facts:", function(){
				it("because x is in (A U [B n C]) AND x is not in (B n C) justifies 'x is in A'", function() {
					val = app.inAtomic('x', 'A', [factB, factA]);
					val.should.equal(true);
				});
			});
		});
	});

	describe('invalid arguments', function() {
		it('1 irrelevant fact: wrong claim type', function() {
			val = app.inAtomic('x', 'A', [fact4]);
			val.should.equal(false);
		});

		it('1 irrelevant fact: element in wrong set', function() {
			val = app.inAtomic('x', 'A', [fact2]);
			val.should.equal(false);
		});
		describe("Invalid Set Difference: ", function(){
			it("because x is in A/B does not justify 'x is in B'", function(){
				val = app.inAtomic("x", "B", [factD]);
				val.should.equal(false);
			});
		});
		describe("Invalid Intersection:", function(){
			it("because x is in A n B does not justify 'x is in C'", function(){
				val = app.inAtomic("x", "C", [factC]);
				val.should.equal(false);
			});
		});
		describe("Invalid Union:", function(){
			it("because x is in A U B AND x is in A does not justify 'x is in B'", function(){
				val = app.inAtomic("x", "B", [fact1, factE]); 
				val.should.equal(false);
			});
			it("because x is in A U B AND x is in B does not justify 'x is in A'", function(){
				val = app.inAtomic("x", "A", [fact2, factE]);
				val.should.equal(false);
			});
			it("because x is not in A U B and x is in B does not justify 'x is in A'", function(){
				val = app.inAtomic("x", "A", [fact2, factF]);
				val.should.equal(false);
			});
		});
	});
});

describe('contained() Function verifies composite assertions (e.g. x is in (A n B) U (C n D) )', function(){
	//Test the contained function's verification of the following assertion:
	describe('Claim that x is in A U (B n C)', function(){

		describe('valid arguments', function(){
			it("because x is in A justifies 'x is in A U (B n C)'", function(){
				val = app.contains('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						fact1 // one fact: because x is in A
					]); 
				val.should.equal(true);
			});

			it("because x is in B and C justifies 'x is in A U (B n C)'", function(){
				val = app.contains('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						fact2, //because x is in B
						fact5 //and because x is in C
					]);
				val.should.equal(true);
					
			});	

			it("because x is in A, B, and C justifies 'x is in A U (B n C)'", function(){
				val = app.contains('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						//Three facts
						fact1, // because x is in A
						fact2, // because x is in B
						fact5  // because x is in C
					]); 
				val.should.equal(true);			
			});

			it("because x is in B n C justifies 'x is in A U (B n C)", function(){
				val = app.contains('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						fact9 // because x is in B n C
					]);
				val.should.equal(true);
			});
		});

		describe('invalid arguments', function(){
			it("because x is in B does not justify 'x is in A U (B n C)'", function() {
				val = app.contains('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						fact2 // one fact: because x is in B
					]); 
				val.should.equal(false);
			});

			it("because x is in C returns does not justify 'x is in A U (B n C)'", function() {
				val = app.contains('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						fact5 // one fact: because x is in C
					]); 
				val.should.equal(false);				
			});	

			it("because x is in D returns does not justify 'x is in A U (B n C)'", function(){
				val = app.contains('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						fact6 // x is in D	
					]); 
				val.should.equal(false);
			});
		});
	});

	describe("\n    Claim that x is in A U [(B n C) n D]", function() {
		describe("Valid arguments:", function(){
			it("because x is in A justifies 'x is in A U [(B n C) n D]'", function() {
				val = app.contains('x', ['A', 'U', [['B', 'n', 'C'], 'n', 'D']],
					[
						fact1 //one fact: because x is in A
					]);
				val.should.equal(true);
			});

			it("because x is in B & x is in C, & x is in D justifies 'x is in A U [(B n C) n D]'", function() {
				val = app.contains('x', ['A', 'U', [['B', 'n', 'C'], 'n', 'D']], 
					[
						//three facts
						fact2, //x is in B
						fact5, //x is in C
						fact6  //x is in D
					]);
				val.should.equal(true);
			});

			it("because x is in [B n C] n D justifies 'x is in A U [(B n C) n D]'", function(){
				val = app.contains('x', ['A', 'U', [['B', 'n', 'C'], 'n', 'D']],
					[
						fact7 //x is in (B n C) n D
					]);
				val.should.equal(true);
			});

			it("because x is in D and x is in [B n C] n D justifies 'x is in A U [(B n C) n D]", function(){
				val = app.contains('x', ['A', 'U', [['B', 'n', 'C'], 'n', 'D']],
					[
						fact7, //x is in (B n C) n D
						fact6 //x is in D
					]);
				val.should.equal(true);
			});

			///////////////////
			//Currently Fails//
			it("because x is in (B n C) and x is in D justifies 'x is in A U [(B n C) n D]'", function(){
				val = app.contains('x', ['A', 'U', [['B', 'n', 'C'], 'n', 'D']],
					[
						fact9, //x is in B n C
						fact6  //x is in D
					]);
				val.should.equal(true);
			});
		});

		describe("Invalid arguments:", function(){
			it("because y is in [B n C] n D does not justify 'x is in A U [(B n C) n D]'", function(){
				val = app.contains("x", ['A', 'U', [['B', 'n', 'C'], 'n', 'D']],
					[
						fact8 //y is in (B n C) n D --> wrong element name in fact
					]);
				val.should.equal(false);
			});


		});
	});

	describe("Claim x is in (B n C) n A", function (){
		describe("Valid arguments: ", function(){
			it("because x is in (B n C)  and x is in A justifies 'x is in (B n C) n A", function() {
				val = app.contains("x", [['B', 'n', 'C'], 'n', 'A'],
					[
						fact9,
						fact1	
					]);
				val.should.equal(true);

			});

			it("because x is in A, B, and C justifies 'x is in (B n C) n A", function() {
				val = app.contains("x", [['B', 'n', 'C'], 'n', 'A'], 
					[
						fact1,
						fact2,
						fact5

					]);
				val.should.equal(true);
			});
		});
	});
});