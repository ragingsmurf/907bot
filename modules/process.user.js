'use strict';
// jscs:disable requireCapitalizedComments

let monUser = require('./mongo.user');
let copy = require('./../data/copy.instructions');
let sms = require('./sms.utility');

let natural = require('natural');
natural.PorterStemmer.attach();

var Registered = function*(frm) {
  let users = yield monUser.find(frm);
  return (users[0] === undefined ? false : true);
};

var Register = function*(req, res, frm, ckz, txt) {
  let user = undefined;

  // Ask the user for their name.
  if (!ckz.get('state')) {
    ckz.set('state', 'new');
    sms.respond(req, res, copy.help.newuser);
  }
  // New user confirmation on name provided.
  if (ckz.get('state') === 'new' && txt.toLowerCase() !== 'yes') {
    ckz.set('temp', txt);
    sms.respond(req, res, `Is [${txt}] correct? (yes|another spelling)`);
  } else if (ckz.get('temp')) { // Create user, say thanks!
    let name = ckz.get('temp');
    if (name !== undefined) {
      name = name.replace('"','').replace('"','');
    }
    if (name.tokenizeAndStem(true).length !== 2) {
      sms.respond(req, res, `Can I get a first and last name?`);
    } else {
      user = yield monUser.create(name, frm);
      ckz.set('state', undefined);
      ckz.set('temp', undefined);
      sms.respond(req, res, `Thanks [${name}], you are now a registered user!`);
    }
  }
};

exports.registered = Registered;
exports.register = Register;
