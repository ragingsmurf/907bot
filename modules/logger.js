'use strict';

module.exports = function() {
  return {
    c: function(msg) {
      console.log(`\t${msg}`);
    },
    lf: function() {
      console.log(`\t¯\\_(ツ)_/¯`);
    },
  };
}
