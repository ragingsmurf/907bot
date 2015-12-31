'use strict';

let mongoose = require('mongoose');
let findOrCreate = require('mongoose-findorcreate');
let l = require('./logger')();
let ssOrg = require('./../models/server.schema.organization')
  .plugin(findOrCreate);

// Active model
let Org = mongoose.model('Organization', ssOrg);

let GetOrganization = function(name) {
  l.c('yielding mongo.organization.GetOrganization');
  let p = new Promise(function(resolve, reject) {
    Org.findOrCreate({name: name}, function(err, org, created) {
      if (err) {
        reject(err);
      }
      resolve(org);
    });
  });
  return p;
}

exports.get = GetOrganization;
