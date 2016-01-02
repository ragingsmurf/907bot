'use strict';
// jscs:disable requireCapitalizedComments

require('linq-es6');
let natural = require('natural');
natural.PorterStemmer.attach();

let monAssoc = require('./mongo.association');
let sms = require('./sms.utility');
let data = require('./data.sources')();
let l = require('./logger')();
let copy = require('./../data/copy.sms')
  .services
  .asEnumerable();

let GetAssociatedOrgID = function*(frm) {
  l.c('yielding process.association.GetAssociationOrgID');
  return yield monAssoc.orgid(frm);
};

let CreateAssociation = function*(orgid, phone, service) {
  l.c('yielding process.association.CreateAssociation');
  return yield monAssoc.add(orgid, phone, service);
};

let AddService = function(phone, resource) {
  l.c('calling process.association.AddService');
  monAssoc.subscribe(phone, resource);
}

let RemoveService = function(phone, resource) {
  l.c('calling process.association.RemoveService');
  monAssoc.unsubscribe(phone, resource);
}

exports.orgid = GetAssociatedOrgID;
exports.create = CreateAssociation;
exports.add = AddService;
exports.remove = RemoveService;
