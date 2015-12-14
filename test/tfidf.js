'use strict';
// jscs:disable requireCapitalizedComments

let assert = require('assert');
let l = require('../modules/logger.js')();

describe('tf*idf', function() {
  describe('weight', function() {
    let natural = require('natural');
    let TfIdf = natural.TfIdf;
    let tfidf = new TfIdf();

    // Fill in set of documents to match against.
    tfidf.addDocument('Where can I find a bedding in anchorage?');
    tfidf.addDocument('Have you seen my puppy dog?');
    tfidf.addDocument('I really enjoy coding from my bed.');
    tfidf.addDocument('Many have tried, few have succeeded.');
    tfidf.addDocument('i code in fortran.');

    it('should compare "bed" to a list of documents', function() {
      tfidf.tfidfs('bed', function(i, measure) {
        if (i === 2 && measure > 0) {
          return assert.equal(true, true);
        } else if (i === 2) {
          assert.fail(0,1,'Third document in the Array did not a match!');
        }
      });
    });
    it('should compare "bed" against a single document', function() {
      if (tfidf.tfidf('bed', 2 /* document index */)) {
        return assert.equal(true, true);
      } else {
        assert.fail(0,1,'Selected document did not a match!');
      }
    });
  });
});
