'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable maximumLineLength

// Third party libraries.
require('linq-es6');

// Internal
let copy = require('./../data/copy.instructions');
let phraseN = require('./phrase.natural')();
let monUser = require('./mongo.user');
let sms = require('./sms.utility');
let l = require('./logger')();

let Registered = function*(req, res, frm, ckz) {
  l.c('yielding process.user.Registered');
  let users = yield monUser.find(frm);
  return (users[0] === undefined ? false : true);
};

let Register = function*(req, res, frm, ckz, txt) {
  let state = require('./cookie.state')(ckz);
  l.c('yielding process.user.Register');
  let user = undefined;
  let spelling = `Is ${txt} the correct spelling of your name?`;
  let misspelled = `Can I get the correct spelling of your name?`;


  if (!state.get()) {
    // 1. Ask the user to register with their name.
    state.set(state.states.REGISTER_USER);
    sms.respond(ckz, req, res, copy.help.newuser);
  } else {
    // 1. Check to see what the user sent over.
    let phrase = phraseN.tag(txt);
    let tags = phrase.tags.asEnumerable();
    // Do we have a tagged phrase?
    if (tags.toArray().length !== 0) {
      // 1.1 Do we have a Yes/No answer?
      if (tags.where(x => x[0] === 'interjection').toArray().length) {
        let yn = tags.where(x => x[0] === 'interjection').toArray()[0][1];
        if (yn == 'yes') {
          l.c(`Creating an account: ${frm}.`);
          user = yield monUser.create(state.getTemp(), frm);
          state.reset();
        } else {
          sms.respond(ckz, req, res, misspelled);
        }
      // 1.2 Save last text, ask if correct name.
      } else {
        state.setTemp(txt);
        sms.respond(ckz, req, res, spelling);
      }
    // 1.2 Not tagged, ask if correct name.
    } else {
      state.setTemp(txt);
      sms.respond(ckz, req, res, spelling);
    }
  }

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
  //     sms.respond(ckz, req, res, );
  //   }
  // }
  // }
};

let AddNotification = function*(orgid, frm, notify) {
  l.c('yielding process.user.AddNotification');
  return yield monUser.notify(orgid, frm, notify);
};

exports.registered = Registered;
exports.register = Register;
exports.notify = AddNotification;
