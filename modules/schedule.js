'use strict';
// jscs:disable requireCapitalizedComments

let later = require('later');
let l = require('./logger')();

// Schedule a job.
exports.basic = function(job) {

  // l.c('Sun-Sat (every 10 minutes) from (8am thru 7:50pm)');

  later.date.localTime(); // Set local clock time

  let schedule = { schedules: [
  { dw: [0,1,2,3,4,5,6], // Sun-Sat
  h: [8,9,10,11,12,13,14,15,16,17,18,19],
  m: [0,10,20,30,40,50],},],
  exceptions: [],};

  return later.setInterval(job.run, schedule);

};
