'use strict';
// jscs:disable requireCapitalizedComments

require('linq-es6');
let natural = require('natural');
natural.PorterStemmer.attach();

let monOrg = require('./mongo.organization');
let sms = require('./sms.utility');
let data = require('./data.sources')();
let l = require('./logger')();
let copy = require('./../data/copy.sms')
  .services
  .asEnumerable();

let GetOrganization = function*(req, res, frm, ckz, txt) {
  l.c('yielding process.organization.GetOrganization');
  // 1. See if org is in PCG Charity list.
  let pcglist = yield data.csv('./data/charities.csv');
  let charity = [];
  charity = pcglist
    .asEnumerable()
    .where(x => x[0].toLowerCase() == txt.toLowerCase())
    .toArray();
  let org = undefined;
  if (charity.length == 1) {
    // Save / Find
    l.c(`Persisting organization ${charity[0][0]} in zip ${charity[0][1]}.`);
    org = yield monOrg.get(charity[0][0], charity[0][1]);
  } else {
    l.c(`No match for organization ${txt}.`);
  }
  return org;
};

// let FindOrganization = function*(req, res, frm, txt, ckz) {
//   l.c('yielding process.organization.FindOrganization');
//   sms.respond(ckz, req, res, copy
//     .single(x => x.name == 'addorg')
//     .copy);
// };

let SelectOrganization = function*(id) {
  l.c('yielding process.organization.SelectOrganization');
  return yield monOrg.select(id);
}

exports.get = GetOrganization;
// exports.find = FindOrganization;
exports.select = SelectOrganization;
