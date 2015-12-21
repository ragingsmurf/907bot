'use strict';
// jscs:disable requireCapitalizedComments

require('linq-es6');
let natural = require('natural');
natural.PorterStemmer.attach();
natural.Metaphone.attach();

class Message {
  constructor(text) {
    this.text = text;
  }
}

class User extends Message {
  speak() {
    console.log(this.name + ' barks.');
  }
}

module.exports = function() {
  return {
    message: function(text) {

      // 1. Stem out all words into an array.
      let message = text.tokenizeAndStem(true);
      let arrStem = message.asEnumerable();
      let arrPhon = text.tokenizeAndPhoneticize().asEnumerable();
      let copy = require('./../data/copy.instructions');
      let docs = require('./../data/copy.classifiers');
      let bc = new natural.BayesClassifier();

      // Help command
      if (arrPhon.first() === 'HLP' && arrStem.count() === 1) {
        return new Message(copy.help.instructions);
      }

      // 2. Load Classification Documents
      for (var i = 0; i < docs.topic.user.length; i++) {
        bc.addDocument(docs.topic.user[i],'user');
      }
      for (var i = 0; i < docs.topic.organization.length; i++) {
        bc.addDocument(docs.topic.organization[i],'organization');
      }
      for (var i = 0; i < docs.topic.taxonomy.length; i++) {
        bc.addDocument(docs.topic.taxonomy[i],'taxonomy');
      }
      bc.train();

      // 3. Parse out topic
      let topic = bc.classify(text);

      return new Message('Topic:' + topic);

    },
  };
}
