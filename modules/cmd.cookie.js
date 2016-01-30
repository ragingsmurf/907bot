'use strict';

// jscs:disable disallowNewlineBeforeBlockStatements
// jscs:disable maximumLineLength
// jscs:disable requireCapitalizedComments

// Third party
let natural = require('natural');
natural.PorterStemmer.attach();
require('linq-es6');

// Internal
let copy = require('./../data/copy.instructions');
let phraseN = require('./phrase.natural')();
let monUser = require('./mongo.user');
let sms = require('./sms.utility');
let l = require('./logger')();

module.exports = function() {
  return {
    Parser: function*(req, res, frm, txt, ckz) {
      let state = require('./cookie.state')(ckz);
      // Parse incoming text message.
      let phrase = phraseN.tag(txt);
      let tags = phrase.tags.asEnumerable();
      let responded = false;
      switch (state.get(ckz)) {
        case state.states.REGISTER_USER:
          {
            // 1. Was phrase tagged?
            if (tags.toArray().length !== 0) {
              // 1.1 Do we have a Yes/No answer?
              let yes = tags.where(x => x[0] === 'interjection')
                .toArray()[0]
                .asEnumerable()
                .where(x => x === 'yes')
                .toArray();
              if (yes.length === 1) {
                let tmp = state.getTemp();
                yield monUser.create(tmp, frm);
                state.reset();
                sms.respond(ckz, req, res, copy.register.success
                  .replace('{0}', tmp));
                responded = true;
              } else {
                sms.respond(ckz, req, res, copy.register.spelling);
                responded = true;
              }
            } else {
              // 1.2 Phrase has no tags.
              if (txt.tokenizeAndStem(true).length !== 2) {
                sms.respond(ckz, req, res, copy.register.firstlast);
                responded = true;
              } else {
                state.setTemp(txt);
                sms.respond(ckz, req, res, copy.register.confirm
                  .replace('{0}', txt));
                responded = true;
              }
            }
            break;
          }
      }
      return responded;
    },
  }
};
