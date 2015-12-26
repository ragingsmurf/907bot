'use strict';

let cmd = require('./cmd')();

// User management commands
function find(user) { return 'find ' + user; };
function add(user) { return 'add ' + user; };
function remove(user) { return 'remove ' + user; };

// Find a User
exports.find = function(value) {
  return new cmd.command(find, undefined, value);
};

// Add a User
exports.add = function(value) {
  return new cmd.command(add, remove, value);
};

// Remove a User
exports.remove = function(value) {
  return new cmd.command(remove, add, value);
};
