'use strict';
// jscs:disable requireCapitalizedComments

let assert = require('assert');
require('linq-es6');
describe('linq-es6', function() {
  it('can average out the values of an Array', function() {
    let items = [1, 2, 3, 4, 5, 6].asEnumerable();
    let average = items.average();
    assert.equal(average, 3.5);
  });
});
