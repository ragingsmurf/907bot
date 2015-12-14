'use strict';
// jscs:disable requireCapitalizedComments

let assert = require('assert');
let l = require('../modules/logger.js')();

describe('Phonetic', function() {
  let question = 'What is the bed count in Anchorage?';
  describe('MetaPhone', function() {
    let phrase = 'Beens Kafay';
    require('natural').Metaphone.attach();
    it('should tokenize and return phonetic array from a phrase', function() {
      // Attach the Phoneticize to native String object.
      let arrWords = phrase.tokenizeAndPhoneticize(); /* Return all words */
      assert.equal(arrWords.length, 2);
    });
    it('should state that two words sound the same', function() {
      assert.equal('truck'.soundsLike('truk'), true);
    });
  });
});
