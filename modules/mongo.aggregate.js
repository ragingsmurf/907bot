'use strict';

let mongoose = require('mongoose');

let ssNotify = require('./../models/server.schema.notification');
let Notify = mongoose.model('Notification', ssNotify);
let ssOrg = require('./../models/server.schema.organization');
let Org = mongoose.model('Organization', ssOrg);
let ssUser = require('./../models/server.schema.user');
let User = mongoose.model('User', ssUser);
let l = require('./logger')();

let GetUserProfile = function*(frm) {
  l.c('yielding mongo.aggregate.GetUserProfile');
  return yield Users.aggregate([{
    $lookup: {
      from: 'associations',
      localField: '_id',
      foreignField: '_id.phone',
      as: 'associations',
    },
  },
  {
    $match: {
      _id: {
        $eq: frm,
      },
    },
  },
   {
    $sort: {
      name: 1,
    },
  }, {
    $project: {
      _id: 1,
      name: 1,
      enabled: 1,
      'associations.service': 1,
    },
  }, ]);
}

let GetActiveNotifications = function*() {
  l.c('yielding mongo.aggregate.GetActiveNotifications');
  return yield Org.aggregate(
    [{
      $lookup: {
        from: 'activenotifications',
        localField: '_id',
        foreignField: '_id.orgid',
        as: 'notifications',
      },
    }, {
      $sort: {
        name: 1,
      },
    }, {
      $project: {
        _id: 1,
        name: 1,
        zipcode: 1,
        'notifications._id.command': 1,
        'notifications.value': 1,
        'notifications.temperature': 1,
        'notifications.created': 1,
      },
    }, ]);
};

let WriteActiveNotifications = function*() {
  l.c('yielding mongo.aggregate.WriteActiveNotifications');
  return yield Notify.aggregate(
    [{
      $match: {
        created: {
          $gte: new Date(
            new Date().getFullYear() + '-' +
            new Date().getMonth() + '-' +
            (new Date().getDate())),
        },
      },
    }, {
      $sort: {
        created: -1,
      },
    }, {
      $group: {
        _id: {
          orgid: '$orgid',
          command: '$command',
        },
        temperature: {
          $first: '$temperature',
        },
        created: {
          $first: '$created',
        },
        value: {
          $first: '$parameter.value',
        },
      },
    }, {
      $sort: {
        name: 1,
        '_id.command': 1,
      },
    }, {
      $out: 'activenotifications',
    }, ]);
}

exports.profile = GetUserProfile;
exports.notifications = GetActiveNotifications;
exports.write = WriteActiveNotifications;
