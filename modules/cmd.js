'use strict';
// jscs:disable requireCapitalizedComments

module.exports = function() {
  return {
    command: function(execute, undo, value) {
      this.execute = execute;
      this.undo = undo;
      this.value = value;
    },
  };
}
