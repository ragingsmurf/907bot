'use strict';

let cmd = require('./cmd')();

let FindCommand = function(query) {
  return new cmd.command(
    function() { return query; },
    function() { return query; },
    query);
};

exports.find = FindCommand;
