'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable maximumLineLength

let monUser = require('./mongo.user');
let copy = require('./../data/copy.instructions');
let sms = require('./sms.utility');
let l = require('./logger')();

let natural = require('natural');
natural.PorterStemmer.attach();

let Registered = function*(frm) {
  l.c('yielding process.user.Registered');
  let users = yield monUser.find(frm);
  return (users[0] === undefined ? false : true);
};

let Register = function*(req, res, frm, ckz, txt) {
  l.c('yielding process.user.Register');
  let user = undefined;
  // Ask the user for their name.
  if (!ckz.get('state')) {
    ckz.set('state', 'registration');
    sms.respond(ckz, req, res, copy.help.newuser);
  }
  // New user confirmation on name provided.
  if (ckz.get('state') === 'registration' && txt.toLowerCase() !== 'yes') {
    ckz.set('temp', txt);
    sms.respond(ckz, req, res, `Is [${txt}] correct? (yes|another spelling)`);
  } else if (ckz.get('temp')) { // Create user, say thanks!
    let name = ckz.get('temp');
    if (name !== undefined) {
      name = name.replace('"','').replace('"','');
    }
    if (name.tokenizeAndStem(true).length !== 2) {
      sms.respond(ckz, req, res, `Can I get a first and last name?`);
    } else {
      user = yield monUser.create(name, frm);
      ckz.set('state', undefined);
      ckz.set('temp', undefined);
      sms.respond(ckz, req, res, `Thanks [${name}], you are now a registered user!`);
    }
  }
};

let AddNotification = function*(orgid, frm, notify, temp) {
  l.c('yielding process.user.AddNotification');
  return yield monUser.notify(orgid, frm, notify, temp);
};

exports.registered = Registered;
exports.register = Register;
exports.notify = AddNotification;
