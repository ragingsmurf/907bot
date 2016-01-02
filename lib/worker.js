'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable maximumLineLength

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

let l = require('./../modules/logger')();
let schd = require('./../modules/schedule');
let associations = require('./../modules/mongo.association');

// Emergency Shelter Assocations
associations.subscribers('101 04').next().value.exec().then(function(data) {
  l.c(data);
});

let fn = function() { l.c('Running Scheduled Instance!') };
schd.basic(fn);

l.c('Started Worker!');
