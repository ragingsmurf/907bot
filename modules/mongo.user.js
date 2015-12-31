'use strict';

let mongoose = require('mongoose');
let ssUser = require('./../models/server.schema.user');
let User = mongoose.model('User', ssUser);
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

exports.find = FindUser;
exports.create = CreateUser;
