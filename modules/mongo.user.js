'use strict';

let mongoose = require('mongoose');
let ssUser = require('./../models/server.schema.user');
let User = mongoose.model('User', ssUser);

let FindUser = function*(phone) {
  return yield User.find({ _id: phone }, 'name');
}

let CreateUser = function*(name, phone) {
  return yield new User({
    name: name,
    _id: phone,
  }).save();
}

exports.find = FindUser;
exports.create = CreateUser;
