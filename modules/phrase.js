'use strict';

let logicBase = require('./../modules/logic.base')();
let twilio = require('./../modules/twilio');

exports.basic = function(req, res, message) {

  this.req = req;
  this.res = res;
  this.message = message;

  let phrase = logicBase.stem(this.message);
  let query = {
    command: undefined,
    message: this.message,
    phrase: phrase,
    value: undefined,
  };

  let copy = require('./../data/copy.instructions');
  switch (phrase[0]) {
    case 'help': {
      twilio.respond(this.req, this.res, copy.help.instructions);
      query.command = 'help';
      return query;
      break;
    }
    case 'find': {
      if (phrase.length == 1) {
        twilio.respond(this.req, this.res, copy.find.noparameter);
        query.command = 'find';
        return query;
      } else if (phrase.length >= 2) {
        delete phrase[0]; // Remove Command
        // Find parameter.
        query.command = 'find';
        query.value = phrase.join(' ');
        return query;
      }
      break;
    }
    case 'add': {
      twilio.respond(this.req, this.res, 'Add something!');
      break;
    }
    case 'remove': {
      break;
    }
    default: {
      twilio.respond(this.req, this.res, 'No command found. Try "help"');
      break;
    }
  }
}
