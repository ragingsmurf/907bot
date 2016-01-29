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

      let handled = false;
      if (state.get(ckz)) {
        // 1. Check cookie state
        let step = state.get(ckz);
        switch (step.key) {
          case 'REGISTER_USER':
            {
              // 2.1 Was phrase tagged?
              if (tags.toArray().length !== 0) {
                // 2.1.1 Do we have a Yes/No answer?
                if (tags.where(x => x[0] === 'interjection').toArray().length) {
                  let yn = tags.where(x => x[0] === 'interjection').toArray()[0][1];
                  if (yn == 'yes') {
                    let tmp = state.getTemp();
                    l.c(`Created user${tmp} from ${frm}`);
                    yield monUser.create(tmp, frm);
                    state.reset();
                    sms.respond(ckz, req, res, copy.register.success
                      .replace('{0}', tmp));
                  } else {
                    sms.respond(ckz, req, res, copy.register.spelling);
                  }
                }
              } else {
                // 2.2 User sent their name, confirm it.
                state.setTemp(txt);
                sms.respond(ckz, req, res, copy.register.confirm
                  .replace('{0}', txt));
              }

              //
              // // New user confirmation on name provided.
              // if (ckz.get('state') === 'registration' && txt.toLowerCase() !== 'yes') {
              //   ckz.set('temp', txt);
              //   sms.respond(ckz, req, res, `Is [${txt}] correct? (yes|another spelling)`);
              // } else if (ckz.get('temp')) { // Create user, say thanks!
              //   let name = ckz.get('temp');
              //   if (name !== undefined) {
              //     name = name.replace('"', '').replace('"', '');
              //   }
              //   if (name.tokenizeAndStem(true).length !== 2) {
              //     sms.respond(ckz, req, res, `Can I get a first and last name?`);
              //   } else {
              //     user = yield monUser.create(name, frm);
              //     ckz.set('state', undefined);
              //     ckz.set('temp', undefined);
              //     sms.respond(ckz, req, res, `Thanks [${name}], you are now a registered user! Use 'help' for a list of bot commands.`);
              //   }
              // }
              // }

              break;
            }
          case 'ADD_ORGANIZATION':
            {
              l.c('ADD_ORGANIZATION');
              break;
            }
          case 'SUBSCRIBE_RESOURCE':
            {
              l.c('SUBSCRIBE_RESOURCE');
              break;
            }
          case 'UNSUBSCRIBE_RESOURCE':
            {
              l.c('UNSUBSCRIBE_RESOURCE');
              break;
            }
        }
      };
      return sms.responded();
    },
  }
};
