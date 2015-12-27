'use strict';
// jscs:disable requireCapitalizedComments

let cmd = require('./cmd')();

function find(query) {
  let p = new Promise(function(resolve, reject) {
    resolve(`${query.value}`);
  });
  return p;
};

let FindCommand = function(query) {
  return new cmd.command(
    function() { return find(query); }, // Execute
    function() { return undefined; }, // Undo
    query); // Value
};

exports.find = FindCommand;
