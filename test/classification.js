'use strict';
// jscs:disable requireCapitalizedComments

let assert = require('assert');
let l = require('../modules/logger.js')();

describe('Classification', function() {
  let natural = require('natural');
  describe('PorterStemmer', function() {
    let classifier = new natural.BayesClassifier(); // Porter Stemmer default
    classifier.addDocument('my unit-tests failed.', 'software');
    classifier.addDocument('tried the program, but it was buggy.', 'software');
    classifier.addDocument('the drive has a 2TB capacity.', 'hardware');
    classifier.addDocument('i need a new power supply.', 'hardware');
    classifier.train();
    it('should classify phrase as a software document', function() {
      if (classifier.classify('did the tests pass?') === 'software') {
        assert.equal(true,true);
      } else {
        assert.fail(0,1,'Phrase was not properly classified!');
      }
    });
  });
  describe('LancasterStemmer', function() {
    let stemmer = natural.LancasterStemmer; // Use Lancaster Stemmer
    let classifier = new natural.BayesClassifier(stemmer);
    classifier.addDocument('my unit-tests failed.', 'software');
    classifier.addDocument('tried the program, but it was buggy.', 'software');
    classifier.addDocument('the drive has a 2TB capacity.', 'hardware');
    classifier.addDocument('i need a new power supply.', 'hardware');
    classifier.train();
    it('should classify phrase as a software document', function() {
      if (classifier.classify('did the tests pass?') === 'software') {
        assert.equal(true,true);
      } else {
        assert.fail(0,1,'Phrase was not properly classified!');
      }
    });
  });
});
