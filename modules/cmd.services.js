'use strict';
// jscs:disable requireCapitalizedComments


let cmd = require('./cmd')();
let oe = require('./../modules/oe')();
/*
Find Social Services
*/
function find(query) {
  let p = new Promise(function(resolve, reject) {

    // OE Directory ID
    let exp = /^[0-9]{3}(\s)?[0-9]{0,2}(\s)?[0-9]{0,2}$/;

    if (exp.test(query.value)) {
      let arr = query.value.split(' ');
      let rslt = undefined;
      if (arr.length === 1) {
        rslt = oe.find(arr[0]);
        if (rslt.length) {
          resolve(rslt);
        } else {
          let msg = `Sorry, I can't find directory ${arr[0]}!\n`;
          msg += `Try texting 'Find All', to get a complete list.`
          reject(msg);
        }
      }
      if (arr.length === 2) {
        rslt = oe.find(arr[0], `${arr[0]}-${arr[1]}`);
        if (rslt.length === 0) {
          let msg = `Sorry, I can't find directory for ${arr[0]} ${arr[1]}!\n`;
          msg += `Try texting 'Find ${arr[0]}', to get a parent directory list.`
          reject(msg);
        } else {
          resolve(rslt);
        }
      }
    }

    if (query.value === 'all') {
      resolve(oe.directory());
    } else {
      reject('No matching Social Services found!');
    }
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
