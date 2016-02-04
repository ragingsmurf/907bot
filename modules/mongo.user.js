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
  return yield User.find({
    _id: phone,
  }, 'name');
}

let CreateUser = function*(name, phone) {
  l.c('yielding mongo.user.CreateUser');
  return yield new User({
    name: name,
    _id: phone,
  }).save();
}

let AddNotification = function*(orgid, frm, notify) {
  l.c('yielding mongo.user.AddNotification');
  return yield new Notify({
    orgid: mongoose.Types.ObjectId(orgid),
    phone: frm,
    service: notify.resource, // 101 04
    command: notify.command, // ['bed', 'count']
    parameter: {
      value: notify.value,
    }, // User's response
  }).save();
}
let GetUserProfile = function*(frm) {
  l.c('yielding mongo.user.GetUserProfile');

  // return yield User.find({_id: 'dasf'});

  return yield User.aggregate(
    [{
      $lookup: {
        from: 'associations',
        localField: '_id',
        foreignField: '_id.phone',
        as: 'associations',
      },
    }, {
      $match: {
        _id: {
          $eq: '+19073439329',
        },
      },
    }, {
      $project: {
        _id: 1,
        name: 1,
        enabled: 1,
        'associations.service': 1,
      },
    }, ],
    function(err, data) {});

}

exports.find = FindUser;
exports.create = CreateUser;
exports.notify = AddNotification;
exports.profile = GetUserProfile;
