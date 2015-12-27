'use strict';
// jscs:disable requireCapitalizedComments

let cmd = require('./cmd')();
let oe = require('./../modules/oe')();
let exp = /^[0-9]{3}(\s)?[0-9]{0,2}(\s)?[0-9]{0,2}$/;
/*
Find Social Services
*/
function show(query) {
  let p = new Promise(function(resolve, reject) {
    // Is this a Service ID query
    if (exp.test(query.value)) {
      let arr = query.value.split(' ');
      let rslt = undefined; // Service Search Results
      if (arr.length === 1) {
        rslt = oe.find(arr[0]);
        if (rslt.length) {
          resolve(rslt);
        } else {
          let msg = `Sorry, I can't find services listing for ${arr[0]}!\n\n`;
          msg += `Try texting 'Show All', to get a complete list.`
          reject(msg);
        }
      }
      if (arr.length === 2) {
        rslt = oe.find(arr[0], `${arr[0]}-${arr[1]}`);
        if (rslt.length === 0) {
          let msg = `Sorry, the service for '${arr[0]} ${arr[1]}' doesn't `;
          msg += `appear to have anything nested underneath it.\n\n`;
          msg += `'Show ${arr[0]}' - get a service list from its parent.\n`;
          msg += `'Select ${arr[0]} ${arr[1]}' - To start working with it.\n`;
          reject(msg);
        } else {
          resolve(rslt);
        }
      }
      if (arr.length === 3) {
        let msg = `Sorry, the service for '${arr[0]} ${arr[1]} ${arr[2]}`;
        msg += `doesn't appear to have anything nested underneath it.\n\n`;
        msg += `'Show ${arr[0]} ${arr[1]}' - get a service list from its parent`
        msg += `\n`;
        msg += `'Select ${arr[0]} ${arr[1]} ${arr[2]}' - To start `
        msg += `working with it.\n`;
        reject(msg);
      }
    }

    if (query.value === 'all') {
      resolve(oe.directory());
    } else {
      let msg = `No matching services found for '${query.value}'!\n`
      msg += `Please search by resource ID: 'Show 102'.\n`;
      reject(msg);
    }
  });
  return p;
};

let ShowCommand = function(query) {
  return new cmd.command(
    function() { return show(query); }, // Execute
    function() { return undefined; }, // Undo
    query); // Value
};

function select(query) {
  let p = new Promise(function(resolve, reject) {
    // Is this a directory ID query
    if (exp.test(query.value)) {
      let arr = query.value.split(' ');
      let rslt = undefined;
      switch (arr.length) {
        case 1: {
          let one = arr[0];
          reject(`Sorry, top level service listings are not selectable.`);
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

let SelectCommand = function(query) {
  return new cmd.command(
    function() { return select(query); }, // Execute
    function() { return undefined; }, // Undo
    query); // Value
};


exports.show = ShowCommand;
exports.select = SelectCommand
