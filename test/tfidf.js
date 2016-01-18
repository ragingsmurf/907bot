'use strict';
// jscs:disable requireCapitalizedComments

let assert = require('assert');
let l = require('../modules/logger.js')();

describe('tf*idf', function() {
  describe('weight', function() {
    let natural = require('natural');
    let TfIdf = natural.TfIdf;
    let tfidf = new TfIdf();

    it('should compare "bed" to a list of documents', function() {
      tfidf.documents = [];
      // Fill in set of documents to match against.
      tfidf.addDocument('Where can I find a bedding in anchorage?');
      tfidf.addDocument('Have you seen my puppy dog?');
      tfidf.addDocument('I really enjoy coding from my bed.');
      tfidf.addDocument('Many have tried, few have succeeded.');
      tfidf.addDocument('i code in fortran.');
      tfidf.tfidfs('bed', function(i, measure) {
        if (i === 2 && measure > 0) {
          assert.equal(true, true);
        } else if (i === 2) {
          assert.fail(0, 1, 'Third document in the Array did not a match!');
        }
      });
    });

    it('should compare "bed" against a single document', function() {
      tfidf.documents = [];
      // Fill in set of documents to match against.
      tfidf.addDocument('Where can I find a bedding in anchorage?');
      tfidf.addDocument('Have you seen my puppy dog?');
      tfidf.addDocument('I really enjoy coding from my bed.');
      tfidf.addDocument('Many have tried, few have succeeded.');
      tfidf.addDocument('i code in fortran.');
      if (tfidf.tfidf('bed', 2 /* document index */)) {
        assert.equal(true, true);
      } else {
        assert.fail(0, 1, 'Selected document did not a match!');
      }
    });

    it('should correctly parse the interjection being used', function() {
      // Fill in set of documents to match against.
      tfidf.documents = [];
      tfidf.addDocument('Yes, yeah, yah');
      tfidf.addDocument('No, nah, nada');
      tfidf.addDocument('I really enjoy coding from my bed.');
      tfidf.tfidfs('yes', function(i, measure) {
        if (i === 0 && measure > 0) {
          assert.equal(true, true);
        } else if (i === 0) {
          assert.fail(0, 1, 'First document did not a match!');
        }
      });
    });
  });
});
