'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable maximumLineLength

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

let AddNotification = function*(orgid, frm, notify) {
  l.c('yielding process.user.AddNotification');
  return yield monUser.notify(orgid, frm, notify);
};

let Register = function(req, res, frm, ckz, txt) {
  l.c('running process.user.Register');
  let state = require('./cookie.state')(ckz);
  if (!state.get().value) {
    state.set(state.states.REGISTER_USER);
    sms.respond(ckz, req, res, copy.help.newuser);
  };
};

let Profile = function*(frm) {
  l.c('yielding process.user.Profile');
  return yield monUser.profile(frm);
};

let ParseFailed = function(req, res, frm, ckz) {
  sms.respond(ckz, req, res, copy.help.notparsed);
}

exports.registered = Registered;
exports.register = Register;
exports.notify = AddNotification;
exports.profile = Profile;
exports.parsefail = ParseFailed;
