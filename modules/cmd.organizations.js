'use strict';

let cmd = require('./cmd')();

// Organization management commands
function find(org) { return 'find ' + org; };
function add(org) { return 'add ' + org; };
function remove(org) { return 'remove ' + org; };
function associate(org, user) { return 'associate ' + user + ' with ' + org;};
function dissociate(org, user) { return 'dissociate' + user + ' from ' + org;};

// Find a Organization
exports.find = function(value) {
  return new cmd.command(find, undefined, value);
};

// Add a Organization
exports.add = function(value) {
  return new cmd.command(add, remove, value);
};

// Remove a Organization
exports.remove = function(value) {
  return new cmd.command(remove, add, value);
};

// Associate User and Organization
exports.associate = function(value) {
  return new cmd.command(associate, dissociate, value);
};

// Dissociate User from Organization
exports.dissociate = function(value) {
  return new cmd.command(dissociate, associate, value);
};
