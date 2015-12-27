'use strict';
// jscs:disable requireCapitalizedComments

require('linq-es6');

let natural = require('natural');
natural.PorterStemmer.attach();
natural.Metaphone.attach();

module.exports = function() {
  return {
    findTopic: function(text) {

      // 1. Stem out all words into an array.
      let message = text.tokenizeAndStem(true);
      let arrStem = message.asEnumerable();
      let arrPhon = text.tokenizeAndPhoneticize().asEnumerable();
      let docs = require('./../data/copy.classifiers');
      let bc = new natural.BayesClassifier();

      // Help command
      if (arrPhon.first() === 'HLP' && arrStem.count() === 1) {
        return { topic: 'help', message: ['help'] };
      }

      // 2. Load Classification Documents
      for (var i = 0; i < docs.topic.user.length; i++) {
        bc.addDocument(docs.topic.user[i],['user']);
      }
      for (var i = 0; i < docs.topic.organization.length; i++) {
        bc.addDocument(docs.topic.organization[i],'organization');
      }
      for (var i = 0; i < docs.topic.directory.length; i++) {
        bc.addDocument(docs.topic.directory[i],'directory');
      }
      bc.train();

      // 3. Parse out topic
      let topic = bc.classify(text);

      return { topic: topic, message: message };

    },
    stem: function(message) {
      return message.tokenizeAndStem(true);
    },
  };
}
