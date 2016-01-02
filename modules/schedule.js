'use strict';

let later = require('later');
let l = require('./logger')();

// Schedule a job with an active bus schedule
exports.basic = function(job) {

  later.date.localTime(); // Set local clock time

  let schedule = { schedules: [
  { dw: [0,1,2,3,4,5,6], // Sun-Sat
  h: [8,9,10,11,12,13,14,15,16,17,18,19,20],
  m: [0,10,20,30,40,50],},],
  exceptions: [],};

  l.c('Job Schedule:' + JSON.stringify(schedule));

  return later.setInterval(job, schedule);

};
