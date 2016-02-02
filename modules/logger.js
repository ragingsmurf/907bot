'use strict';

module.exports = function() {
  return {
    c: function(msg) {
      console.log(`\t${msg}`);
    },
    js: function(msg) {
      console.log(`\t${JSON.stringify(msg)}`);
    },
    lf: function() {
      console.log(`\t¯\\_(ツ)_/¯`);
    },
  };
}
