// jscs:disable maximumLineLength

db.notifications.aggregate(
  [{
    $match: {
      created: {
        $gte: new ISODate(
          new Date().getFullYear() + '-' +
          new Date().getMonth() + 1 + '-' +
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
db.organizations.aggregate(
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
      'notifications._id.command': 1,
      'notifications.value': 1,
      'notifications.temperature': 1,
      'notifications.created': 1,
    },
  }, ]);
