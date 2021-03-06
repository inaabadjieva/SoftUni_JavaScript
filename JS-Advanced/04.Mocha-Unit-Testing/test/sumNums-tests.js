let expect = require('chai').expect
let sum = module.require('../sumNums').sum

describe("sum(arr)", function() {
  	it("should return 3 for [1, 2]", function() {
    	expect(sum([1, 2])).to.be.equal(3);
  	});
  	it("should return 1 for [1]", function() {
    	expect(sum([1])).to.be.equal(1);
  	});
  	it("should return 0 for []", function() {
    	expect(sum([])).to.be.equal(0);
  	});
  	it("should return 4 for [1.5, 3.5, -1]", function() {
    	expect(sum([1.5, 3.5, -1])).to.be.equal(4);
  	});
  	it("should return NaN for invalid data", function() {
    	expect(sum(['pesho'])).to.be.NaN;
  	});
});