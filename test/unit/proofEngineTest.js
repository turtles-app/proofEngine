
var should = require('chai').should();
var app = require("../../proofEngine.js");
var setEngine = require("../../setEngine.js");
var val;

var fact1 =  new setEngine.Fact('x', true, 'A'), fact2 = new setEngine.Fact('x', true, 'B'), fact3 = new setEngine.Fact('x', false, 'C'), 
fact4 = new setEngine.Fact("x", false, "A"), fact5 = new setEngine.Fact("x", true, "C"), fact6 = new setEngine.Fact('x', true, 'D'),
fact7 = new setEngine.Fact("x", true, [["B", "n", "C"], "n", "D"]);

//	fact1 represents "x is in A"
// 	fact2 represents "x is in B"
//	fact3 represents "x is not in C"
//	fact4 represents "x is not in A"
//	fact5 represents "x is in C"
//	fact6 represents "x is in D"
//	fact7 represents "x is in (B n C) n D"
describe('inAtomic() Function verifies atomic assertions (e.g. x is in A)', function() {
	describe('valid arguments', function() {
		it('1 salient fact', function() {
			val = app.inAtomic('x', 'A', [fact1]);
			val.should.equal(true);
		});

		it('1 sailent, 2 irrelevant facts', function() {
			val = app.inAtomic('x', 'A', [fact1, fact2, fact3]);
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

	describe("\nClaim that x is in A U [(B n C) n D]", function() {
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

			////////////////////////////////////////
			// Case without sufficient structure: //
			////////////////////////////////////////
			it("because x is in [B n C] n D justifies 'x is in A U [(B n C) n D]'", function(){
				val = app.contains('x', ['A', 'U', [['B', 'n', 'C'], 'n', 'D']],
					[
					fact7 //x is in (B n C) n D
					]);
				val.should.equal(true);
			});
		});
	});

});