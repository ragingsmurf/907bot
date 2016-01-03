'use strict';

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

let notify = require('./../modules/job.notification');
let schd = require('./../modules/schedule');
let l = require('./../modules/logger')();
let calendar = require('datejs');

l.c(Date.today().setTimeToNow().add({ hours: 0 }));

schd.basic(notify);
