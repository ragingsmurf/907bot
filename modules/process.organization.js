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
  // 1. See if org is in PCG Charity list.
  let pcglist = yield data.csv('./data/charities.csv');
  let charity = [];
  charity = pcglist
    .asEnumerable()
    .where(x => x[0].toLowerCase() == txt.toLowerCase())
    .toArray();
  if (charity.length == 1) {
    // Save / Find
    l.c(`Saving charity (${charity[0][0]}) in zipcode (${charity[0][1]}).`);

    let org = yield monOrg.get(charity[0][0], charity[0][1]);

    l.c(`Found an organization (${charity[0][0]}), notify user.`);

    // We found an Organization, write the cookie, as the user.
    ckz.set('temp', org._id); // Save Org ID
    sms.respond(ckz, req, res, copy
      .single(x => x.name == 'associateorg')
      .copy
      .replace('{0}', org.name));

  } else {

    l.c(`No match for organization (${txt}).`);

    // Organization name wasn't found
    ckz.set('temp', undefined);
    sms.respond(ckz, req, res, copy
      .single(x => x.name == 'orgnotfound')
      .copy
      .replace('{0}', txt));
  }
};

let FindOrganization = function*(query, req, res, frm, txt, ckz) {
  // ckz.set('state', 'addOrganization');
  sms.respond(ckz, req, res, copy
    .single(x => x.name == 'addorg')
    .copy);
};

let SelectOrganization = function*(id) {
  l.c('yielding process.organization.SelectOrganization');
  return yield monOrg.select(id);
}

exports.get = GetOrganization;
exports.find = FindOrganization;
exports.select = SelectOrganization;
