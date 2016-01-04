'use strict';

let mongoose = require('mongoose');

// Model Schemas
let ssUser = require('./../models/server.schema.user');
let ssNotify = require('./../models/server.schema.notification');

// Models
let User = mongoose.model('User', ssUser);
let Notify = mongoose.model('Notification', ssNotify);

// Internal Modules
let l = require('./logger')();

let FindUser = function*(phone) {
  l.c('yielding mongo.user.FindUser');
  return yield User.find({ _id: phone }, 'name');
}

let CreateUser = function*(name, phone) {
  l.c('yielding mongo.user.CreateUser');
  return yield new User({
    name: name,
    _id: phone,
  }).save();
}

let AddNotification = function*(orgid, frm, notify, temp) {
  l.c('yielding mongo.user.AddNotification');
  return yield new Notify({
    orgid: mongoose.Types.ObjectId(orgid),
    phone: frm,
    service: notify.resource, // 101 04
    command: notify.command, // ['bed', 'count']
    temperature: temp, // Temperature in Fahrenheit
    parameter: { value: notify.value }, // User's response
  }).save();
}

exports.find = FindUser;
exports.create = CreateUser;
exports.notify = AddNotification;
