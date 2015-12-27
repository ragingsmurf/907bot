'use strict';
// jscs:disable requireCapitalizedComments

module.exports = function() {
  let current = 0;
  let commands = [];
  return {
    execute: function(command) {
      current = command.execute(current, command.value);
      commands.push(command);
    },
    undo: function() {
      let command = commands.pop();
      current = command.undo(current, command.value);
    },
    getCurrentValue: function() {
      return current;
    },
  }
}
