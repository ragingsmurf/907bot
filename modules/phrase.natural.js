'use strict';
// jscs:disable requireCapitalizedComments

// Third party
require('linq-es6');
let natural = require('natural');

// Internal
let l = require('./logger')();

// Add Natural
let TfIdf = natural.TfIdf;
// String primitive
natural.PorterStemmer.attach();
natural.Metaphone.attach();

module.exports = function() {
  return {
    tag: function(text) {
      let tfidf = new TfIdf();
      // 1. Stem words into array.
      let message = text.tokenizeAndStem(true);
      let arrStem = message.asEnumerable();
      let arrPhon = text.tokenizeAndPhoneticize().asEnumerable();
      let docs = require('./../data/copy.classifiers');

      // Help command
      if (arrPhon.first() === 'HLP' && arrStem.count() === 1) {
        return {
          tags: [
            ['help'],
          ],
          message: ['help'],
        };
      }

      // 2. Classieifer documents for taggging.
      for (let i = 0; i < docs.interjections.yes.length; i++) {
        tfidf.addDocument(docs.interjections.yes[i], ['interjection', 'yes']);
      }
      for (let i = 0; i < docs.interjections.no.length; i++) {
        tfidf.addDocument(docs.interjections.no[i], ['interjection', 'no']);
      }
      for (var i = 0; i < docs.commands.asEnumerable().toArray().length; i++) {
        let node = docs.commands.asEnumerable().toArray()[i]['name'];
        let rslt = docs.commands.asEnumerable().toArray()[i];
        for (let d = 0; d < rslt['docs'].length; d++) {
          tfidf.addDocument(docs.commands[i]['docs'][d], ['command', node]);
        }
      };
      for (let i = 0; i < docs.taxonomy.length; i++) {
        let node = docs.taxonomy[i].node;
        for (let d = 0; d < docs.taxonomy[i].docs.length; d++) {
          tfidf.addDocument(docs.taxonomy[i].docs[d], ['resource', node]);
        }
      }

      // Results
      let tags = [];

      // 3. Check documents for term match, add tag.
      tfidf.tfidfs(text, function(i, measure) {
        if (measure > 0) {
          // Content tag.
          let tag = tfidf.documents[i].__key;
          // Check for existing tag.
          let count = tags.asEnumerable().where(x => x[0] === tag[0]).toArray();
          if (count.length === 0) {
            tags.push(tag); // Add new tag
          }
        }
      });

      // 4. Parse numbers.
      let int = text.match(/\d+/g);
      if (int) {
        tags.push(['numbers', int]);
      }

      return {
        tags: tags,
        message: message,
      };

    },
    stem: function(message) {
      return message.tokenizeAndStem(true);
    },
  };
}
