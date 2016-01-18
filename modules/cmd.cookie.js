'use strict';

// jscs:disable disallowNewlineBeforeBlockStatements
// jscs:disable maximumLineLength
// jscs:disable requireCapitalizedComments

// Third party
let natural = require('natural');
natural.PorterStemmer.attach();

// Internal
let phraseN = require('./phrase.natural')();
let sms = require('./sms.utility');
let l = require('./logger')();

module.exports = function() {
  return {
    Parser: function*(req, res, frm, txt, ckz) {
      let state = require('./cookie.state')(ckz);
      if (state.get(ckz)) {
        // 1. Check cookie state
        let step = state.get(ckz);
        switch (step.key) {
          case 'REGISTER_USER':
            {
              // sms.respond(ckz, req, res, 'I saved your data (lie)!');

              let response = phraseN.tag(txt);
              l.c(response.tags);

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
    },
  }
};
