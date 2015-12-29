'use strict';

let csv = require('csv');

module.exports = function() {
  let current = 0;
  let commands = [];
  return {
    parse: function(path) {
      let p = new Promise(function(resolve, reject) {
        require('fs').readFile(path, function(err, data) {
          csv.parse(data, {}, function(err, output) {
            resolve(output);
          });
        });
      });
      return p;
    },
  }
}
