'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable maximumLineLength

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

let l = require('./../modules/logger')();
let schd = require('./../modules/schedule');
let fn = function() { l.c('Running Scheduled Instance!') };
schd.basic(fn);

l.c('Started Worker!');
