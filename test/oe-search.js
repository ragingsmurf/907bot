'use strict';
// jscs:disable requireCapitalizedComments

let assert = require('assert');
let l = require('../modules/logger.js')();
var jsonQuery = require('json-query');

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

  it('can find Emergency Shelter element in Open Eligibility JSON', function() {
    let oe = require('./../data/oe');
    let query = 'taxonomy.top_level[@title=Emergency]';
    query += '.second_level[@title=Emergency Shelter].[@id]';
    let result = jsonQuery(query, { data: oe });
    assert.equal(result.value, '101-04');
  });
});
