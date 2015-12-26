'use strict';
// jscs:disable requireCapitalizedComments

let assert = require('assert');
let jsonQuery = require('json-query');
let oe = require('./../modules/oe')();

describe('json-query', function() {
  it('can search a basic JSON structure', function() {
    let data = {
      people: [
        {name: 'Matt', country: 'NZ'},
        {name: 'Pete', country: 'AU'},
      ],
    };
    let result = jsonQuery('people[country=NZ].name', { data: data });
    assert.equal(result.value, 'Matt');
  });
  it('can list top level of Open Eligibility', function() {
    assert.equal(oe.directory().length, 11);
  });
  it('can search for empty child list and not error', function() {
    assert.equal(oe.find('101', '101-04').length, 0);
  });
  it('can search third level Open Eligibility and return list', function() {
    assert.equal(oe.find('101', '101-02').length, 6);
  });
});
