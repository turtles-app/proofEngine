
var should = require('chai').should();
var app = require("../../proofEngine.js");

var val;

describe('inAtomic() Function verifies atomic assertions (e.g. x is in A)', function() {
	describe('valid arguments', function() {
		it('1 salient fact', function() {
			val = app.inAtomic('x', 'A', [['x', 'isAnElementOf', 'A']]);
			val.should.equal(true);
		});

		it('1 sailent, 2 irrelevant facts', function() {
			val = app.inAtomic('x', 'A', [['x', 'isAnElementOf', 'A'], ['x', 'isNotAnElementOf', 'A'], ['x', 'isAnElementOf', 'B']]);
		});
	});

	describe('invalid arguments', function() {
		it('1 irrelevant fact: wrong claim type', function() {
			val = app.inAtomic('x', 'A', [['x', 'isNotAnElementOf', 'A']]);
			val.should.equal(false);
		});

		it('1 irrelevant fact: element in wrong set', function() {
			val = app.inAtomic('x', 'A', [['x', 'isAnElementOf', 'B']]);
			val.should.equal(false);
		});
	});
});

describe('contained() Function verifies composite assertions (e.g. x is in (A n B) U (C n D) )', function(){
	//Test the contained function's verification of the following assertion:
	describe('Claim that x is an element of A U (B n C)', function(){

		describe('valid arguments', function(){
			it('because x is an element of A', function(){
				val = app.contained('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						['x', 'isAnElementOf', 'A'] // one fact: because x is in A
					]); 
				val.should.equal(true);
			});

			it('because x is an element of B and C', function(){
				val = app.contained('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						['x', 'isAnElementOf', 'B'],
						['x', 'isAnElementOf', 'C']
					]);
				val.should.equal(true);
					
			});	

			it('because x is an element of A, B, and C', function(){
				val = app.contained('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						//Three facts
						['x', 'isAnElementOf', 'A'], // because x is in A
						['x', 'isAnElementOf', 'B'], // because x is in B
						['x', 'isAnElementOf', 'C']  // because x is in C
					]); 
				val.should.equal(true);			});
		});

		describe('invalid arguments', function(){
			it('because x is an element of B', function() {
				val = app.contained('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						['x', 'isAnElementOf', 'B'] // one fact: because x is in A
					]); 
				val.should.equal(false);
			});

			it('because x is an element of C', function() {
				val = app.contained('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						['x', 'isAnElementOf', 'C'] // one fact: because x is in A
					]); 
				val.should.equal(false);				
			});	

			it('because x is an element of D', function(){
				val = app.contained('x', ['A', 'U', ['B', 'n', 'C']], 
					[
						['x', 'isAnElementOf', 'D'] // x is in D	
					]); 
				val.should.equal(false);
			});
		});
	});

});