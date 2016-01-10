'use strict';

let mongoose = require('mongoose');
let ssNotify = require('./../models/server.schema.notification');
let Notify = mongoose.model('Notification', ssNotify);
let l = require('./logger')();

let GetActiveNotifications = function*() {
  l.c('yielding mongo.aggregate.GetActiveNotifications');
  return yield Notify.aggregate(
    [{
      $lookup: {
        from: 'organizations',
        localField: 'orgid',
        foreignField: '_id',
        as: 'organization',
      },
    }, {
      $project: {
        _id: 1,
        created: 1,
        service: 1,
        orgid: 1,
        'organization.name': 1,
        command: 1,
        parameter: 1,
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
        createDate: {
          $first: '$created',
        },
        name: {
          $first: '$organization.name',
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
    }, ]);
};

exports.notifications = GetActiveNotifications;
