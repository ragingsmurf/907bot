'use strict';
// jscs:disable requireCapitalizedComments

require('linq-es6');
require('natural').PorterStemmer.attach();

// Organizations
// Taxonomy
// Users



module.exports = function() {
  function pronouns(word) {
    return ['i','me','my','mine','myself'].asEnumerable().any(x => x == word);
  };

  return {
    message: function(msg) {

      // 1. Stem words into an Array
      // let arrAll = msg.tokenizeAndStem(true);
      // console.log(arrAll);
      // let arrMain = msg.tokenizeAndStem(false);
      // console.log(arrMain);
      // 2. Check for trigger keywords
      // var items = arrAll.asEnumerable();

      // var filtered = items.any(pronouns);
      // console.log(filtered);
      // 3. TODO

      return msg;

    },
  };
}
