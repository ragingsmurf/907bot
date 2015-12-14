'use strict';
// jscs:disable requireCapitalizedComments

let assert = require('assert');
let l = require('../modules/logger.js')();

describe('Natural', function() {
  let question = 'What is the bed count in Anchorage?';
  describe('Porter Stemmer', function() {
    it('should stem the following: ' + question, function() {
      // Attach the Stemmmer to native String object.
      require('natural').PorterStemmer.attach();
      let arrWords = question.tokenizeAndStem(true); /* Return all words */
      assert.equal(arrWords.length, 7);
    });
  });
  describe('Lancaster Stemmer', function() {
    it('should stem the following: ' + question, function() {
      // Attach the Stemmmer to native String object.
      require('natural').LancasterStemmer.attach();
      let arrWords = question.tokenizeAndStem(true); /* Return all words */
      assert.equal(arrWords.length, 7);
    });
  });
});
