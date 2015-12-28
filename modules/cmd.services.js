'use strict';
// jscs:disable requireCapitalizedComments

let cmd = require('./cmd')();
let oe = require('./../modules/oe')();
let exp = /^[0-9]{3}(\s)?[0-9]{0,2}(\s)?[0-9]{0,2}$/;
/*
Show: Return nodes based on nested id query.
*/
function show(query) {
  let p = new Promise(function(resolve, reject) {
    if (exp.test(query.value)) {
      let arr = query.value.split(' ');
      let rslt = undefined;
      if (arr.length === 1) {
        rslt = oe.find(arr[0]); // One Parameter
        if (rslt.length) {
          resolve(rslt);
        } else {
          let msg = `There doesn't appear to be any Social Services listed`;
          msg += ` for 'Show ${arr[0]}'!\n\n`;
          msg += `'Show All' - Get a complete list of Social Services.\n`;
          reject(msg);
        }
      }
      if (arr.length === 2) {
        rslt = oe.find(arr[0], `${arr[0]}-${arr[1]}`);
        if (rslt.length === 0) {
          let msg = `There doesn't appear to be any Social Service`;
          msg += ` sub-categories for 'Show ${arr[0]} ${arr[1]}'\n\n`;
          msg += `'Select ${arr[0]} ${arr[1]}' - To start managing`
          msg += ` this resource type.\n\n`;
          msg += `'Show ${arr[0]}' - Get a complete list of Social Services`;
          msg += ` for this category.\n`;
          reject(msg);
        } else {
          resolve(rslt);
        }
      }
      if (arr.length === 3) {
        let msg = `There doesn't appear to be any Social Service`;
        msg += ` sub-categories for 'Show ${arr[0]} ${arr[1]} ${arr[2]}'\n\n`;
        msg += `'Select ${arr[0]} ${arr[1]}' - To start managing`;
        msg += ` this resource type.\n\n`;
        msg += `'Show ${arr[0]} ${arr[1]}' - To get a complete list of Social`;
        msg += ` Services for this category.\n`;
        reject(msg);
      }
    }
    if (query.value === 'all') {
      resolve(oe.directory());
    } else {
      let msg = `No Social Services IDs were found for`
      msg += ` 'Show ${query.value}'!\n\n`;
      msg += ` 'Show All' - Get a complete list of Social Services.\n`;
      msg += ` 'Show [number]' - Get a sub-categorized list of Services.`;
      reject(msg);
    }
  });
  return p;
};

function select(query) {
  let p = new Promise(function(resolve, reject) {
    if (exp.test(query.value)) {
      let arr = query.value.split(' ');
      let rslt = undefined;
      switch (arr.length) {
        case 1: {
          let one = arr[0];
          reject(`Sorry, top level Social Services are not Select-able.`);
          break;
        }
        case 2: {
          let one = arr[0];
          let two = `${arr[0]}-${arr[1]}`;
          let three = undefined;
          rslt = oe.select(one, two, three);
          resolve(rslt);
          break;
        }
        case 3: {
          let one = arr[0];
          let two = `${arr[0]}-${arr[1]}`;
          let three = `${arr[0]}-${arr[1]}-${arr[2]}`;
          rslt = oe.select(one, two, three);
          resolve(rslt);
          break;
        }
        default: {
          break;
        }
      }
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
