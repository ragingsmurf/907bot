'use strict';
// jscs:disable requireCapitalizedComments

module.exports = function() {
  return {
    command: function Command(execute, undo, value) {
      this.execute = execute;
      this.undo = undo;
      this.value = value;
    },
    stack: function() {
      let current = 0;
      let commands = [];
      return {
        execute: function(command) {
          current = command.execute(current, command.value);
          commands.push(command);
          // log.add(action(command) + ": " + command.value);
        },
        undo: function() {
          let command = commands.pop();
          current = command.undo(current, command.value);
          // log.add("Undo " + action(command) + ": " + command.value);
        },
        getCurrentValue: function() {
          return current;
        },
      }
    },
  };
}
