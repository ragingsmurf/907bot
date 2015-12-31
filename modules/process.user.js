'use strict';
// jscs:disable requireCapitalizedComments

let monUser = require('./mongo.user');
let copy = require('./../data/copy.instructions');
let sms = require('./sms.utility');

let natural = require('natural');
natural.PorterStemmer.attach();

let Registered = function*(frm) {
  let users = yield monUser.find(frm);
  return (users[0] === undefined ? false : true);
};

let Register = function*(req, res, frm, ckz, txt) {
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

exports.registered = Registered;
exports.register = Register;
