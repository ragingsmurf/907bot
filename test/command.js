'use strict';
// jscs:disable requireCapitalizedComments

let assert = require('assert');
let l = require('../modules/logger.js')();

describe('Command', function() {
  it('should allow for queing up commands.', function() {
    let cmd = require('./../modules/cmd')();
    let services = require('./../modules/cmd.services');

    let stack = new cmd.stack();
    stack.execute(new services.add('Test'));
    stack.undo();
    // console.log(stack);
    // console.log(JSON.stringify(stack));

  });
});
