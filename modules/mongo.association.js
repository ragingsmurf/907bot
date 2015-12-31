'use strict';

let mongoose = require('mongoose');
let ssAssoc = require('./../models/server.schema.association');
let Assoc = mongoose.model('Association', ssAssoc);
let l = require('./logger')();

let GetAssociation = function*(phone) {
  l.c('yielding mongo.association.GetAssociation');
  return yield Assoc.find({ '_id.phone': { $eq: phone } })
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
  l.c('yielding mongo.association.AddService');
  Assoc.findOneAndUpdate({ '_id.phone': { $eq: phone } },
                          { $addToSet: { service: resource } }, function(err) {
                            l.c(err);
                          });
}

// let GetAssocation = function(name) {
//   let p = new Promise(function(resolve, reject) {
//     Org.find({name: name}, function(err, org, created) {
//       if (err) {
//         reject(err);
//       }
//       resolve(org);
//     });
//   });
//   return p;
// }

exports.orgid = GetAssociation;
exports.add = AddAssociation;
exports.service = AddService;
