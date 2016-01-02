'use strict';

let mongoose = require('mongoose');
let ssAssoc = require('./../models/server.schema.association');
let Assoc = mongoose.model('Association', ssAssoc);
let l = require('./logger')();

let GetAssociation = function*(phone) {
  l.c('yielding mongo.association.GetAssociation');
  return yield Assoc.find({ '_id.phone': { $eq: phone } })
};

let GetSubscribedUsers = function*(resource) {
  l.c('yielding mongo.association.GetSubscribedUsers');
  return yield Assoc.find(
    { service: { $elemMatch: { $eq: resource } } }, { _id: 1});
};

let AddAssociation = function*(frm, orgid, service) {
  l.c('yielding mongo.association.AddAssociation');
  return yield new Assoc({
    _id: {
      orgid: mongoose.Types.ObjectId(orgid),
      phone: frm,
    },
    service: [service],
  }).save();
}

let AddService = function(phone, resource) {
  l.c('calling mongo.association.AddService');
  Assoc.findOneAndUpdate({ '_id.phone': { $eq: phone } },
                          { $addToSet: { service: resource } })
                          .exec();
}

let RemoveService = function(phone, resource) {
  l.c('calling mongo.association.RemoveService');
  Assoc.update(
      { '_id.phone': { $eq: phone } },
      { $pull: { service: { $in: [ resource ] } } })
      .exec();
}

exports.orgid = GetAssociation;
exports.add = AddAssociation;
exports.subscribers = GetSubscribedUsers;
exports.subscribe = AddService;
exports.unsubscribe = RemoveService;
