'use strict';

let cmd = require('./cmd')();

// Social services open eligibility directory commands
function find(service) {return 'find ' + service;};

// Find a Service
exports.find = function(value) {
  return new cmd.command(find, undefined, value);
};
