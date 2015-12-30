'use strict';
// jscs:disable requireCapitalizedComments

// Third party libraries.
require('linq-es6');

let cmd = require('./cmd')();
let oe = require('./openeligibility')();
let copy = require('./../data/copy.sms')
  .services
  .asEnumerable();

// Match for '000 00 00' number format.
const exp = /^[0-9]{3}(\s)?[0-9]{0,2}(\s)?[0-9]{0,2}$/;

/*
Show: Return nodes based on nested id query.
*/
function show(query) {
  let p = new Promise(function(resolve, reject) {
    if (exp.test(query.value)) {
      let arr = query.value.split(' ');
      if (arr.length === 1) {
        let rslt = oe.find(arr[0]); // One Parameter
        if (rslt.length) {
          resolve(rslt);
        } else {
          reject(copy
            .single(x => x.name == 'show100')
            .copy
            .replace('{0}', arr[0]));
        }
      }
      if (arr.length === 2) {
        let rslt = oe.find(arr[0], `${arr[0]}-${arr[1]}`);
        if (rslt.length === 0) {
          reject(copy
            .single(x => x.name == 'emptysub')
            .copy
            .replace('{0}', arr[0])
            .replace('{1}', arr[1])
            .replace('{2}', ''));
        } else {
          resolve(rslt);
        }
      }
      if (arr.length === 3) {
        reject(copy
          .single(x => x.name == 'emptysub')
          .copy
          .replace('{0}', arr[0])
          .replace('{1}', arr[1])
          .replace('{2}', arr[2]));
      }
    }
    // Return root Open Eligibility directory
    if (query.value === 'all') {
      resolve(oe.directory());
    } else {
      // Parameter didn't match RegExp format.
      reject(copy
        .single(x => x.name == 'nothingmatched')
        .copy
        .replace('{0}', query.value));
    }
  });
  return p;
};

function select(query) {
  let p = new Promise(function(resolve, reject) {
    if (exp.test(query.value)) {
      let arr = query.value.split(' ');
      // individual parameters.
      switch (arr.length) {
        case 1: {
          let one = arr[0];
          reject(copy
            .single(x => x.name == 'rootunselectable')
            .copy);
          break;
        }
        case 2: {
          let one = arr[0];
          let two = `${arr[0]}-${arr[1]}`;
          let three = undefined;
          resolve(oe.select(one, two, three));
          break;
        }
        case 3: {
          let one = arr[0];
          let two = `${arr[0]}-${arr[1]}`;
          let three = `${arr[0]}-${arr[1]}-${arr[2]}`;
          resolve(oe.select(one, two, three));
          break;
        }
        default: {
          break;
        }
      }
    } else {
      // Failed RegExp
      reject(copy
        .single(x => x.name == 'notanumber')
        .copy);
    }
  });
  return p;
}

let ShowCommand = function(query) {
  return new cmd.command(
    function() { return show(query); }, // Execute
    function() { return undefined; }, // Undo
    query); // Value
};
let SelectCommand = function(query) {
  return new cmd.command(
    function() { return select(query); }, // Execute
    function() { return undefined; }, // Undo
    query); // Value
};

exports.show = ShowCommand;
exports.select = SelectCommand
