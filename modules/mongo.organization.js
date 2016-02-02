'use strict';
// jscs:disable maximumLineLength

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let findOrCreate = require('mongoose-findorcreate');
let l = require('./logger')();
let ssOrg = require('./../models/server.schema.organization')
  .plugin(findOrCreate);

// Active model
let Org = mongoose.model('Organization', ssOrg);

let CreateOrFindOrganization = function(name, zipcode) {
  l.c('yielding mongo.organization.CreateOrFindOrganization');
  let p = new Promise(function(resolve, reject) {
    Org.findOrCreate({name: name, zipcode: zipcode}, function(err, org, created) {
      if (err) {
        reject(err);
      }
      resolve(org);
    });
  });
  return p;
}

let SelectOrganization = function(id) {
  l.c('yielding mongo.organization.SelectOrganization');
  let p = new Promise(function(resolve, reject) {
    Org.find({_id: id}, function(err, org, created) {
      if (err) {
        reject(err);
      }
      resolve(org);
    });
  });
  return p;
}

exports.get = CreateOrFindOrganization;
exports.select = SelectOrganization;
