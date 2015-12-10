var chai 		= require('chai').should();
var setEngine 		= require('../../setEngine.js');
var Operations 	= require('../../operations.js');



var a = new setEngine.Set('A'), b = new setEngine.Set('B');
var x = new setEngine.Element('x', a), y = new setEngine.Element('y', b);
var union = Operations.union('a U b', a, b); 


describe('Union Operation Test', function(){
	describe('Instantiation', function(){
		it('loads a set', function(){
			a.should.be.an.instanceOf(setEngine.Set);
			a.equivalents[0].should.a.be.equal('A');
			a.elements.length.should.a.be.equal(1);
			a.equivalents.length.should.a.be.equal(1);
			a.eqActiveIndex.should.a.be.equal(0);

			b.equivalents[0].should.a.be.equal('B');
			b.elements.length.should.a.be.equal(1);
			b.equivalents.length.should.a.be.equal(1);
			b.eqActiveIndex.should.a.be.equal(0);
		});

		it('loads an element', function(){
			x.name.should.a.be.equal('x');
			x.containingSets.should.a.include(a.elements[x.containingSets[0].elementIndex].containingSets[0]);

			y.name.should.a.be.equal('y');
			y.containingSets.should.a.include(b.elements[y.containingSets[0].elementIndex].containingSets[0]);
		});
	});
	describe('Union', function(){
		it('is a set', function(){
			union.should.be.an.instanceOf(setEngine.Set);
		});

		it('has the right name', function(){
			union.equivalents[0].should.a.be.equal('a U b', "Name failed to load");
		});

		it('has the right syntax', function(){
			union.syntax = ['A', 'U', 'B'];
		});

		it('has the right elements', function(){
			union.should.a.have.property('elements').equal([x,y]);
		});

		it('all eSets have correct active indices', function(){

		});
		it('has the contains() method', function(){
			
		});
	});
});