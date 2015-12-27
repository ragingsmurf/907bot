'use strict';

let natural = require('./../modules/phrase.natural')();
let sms = require('./../modules/sms.utility');

exports.basic = function(req, res, message) {

  this.req = req;
  this.res = res;
  this.message = message;

  let phrase = natural.stem(this.message);
  let query = {
    command: undefined, // Unknown
    message: this.message, // Original message
    phrase: phrase, // Stemmed message
    value: undefined, // Unknown
  };

  let copy = require('./../data/copy.instructions');
  switch (phrase[0]) {
    case 'help': {
      sms.respond(this.req, this.res, copy.help.instructions);
      query.command = 'help';
      return query;
      break;
    }
    case 'find': {
      if (phrase.length == 1) {
        sms.respond(this.req, this.res, copy.find.noparameter);
        query.command = 'find';
        return query;
      } else if (phrase.length >= 2) {
        delete phrase[0]; // Remove Command
        query.command = 'find';
        query.value = phrase.join(' ').trim();
        return query;
      }
      break;
    }
    case 'add': {
      sms.respond(this.req, this.res, 'Add something!');
      break;
    }
    case 'remove': {
      break;
    }
    default: {
      sms.respond(this.req, this.res, 'No command found. Try "help"');
      break;
    }
  }
}
