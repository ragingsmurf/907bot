'use strict';

let natural = require('./../modules/phrase.natural')();
let sms = require('./../modules/sms.utility');

exports.basic = function(ckz, req, res, message) {

  this.req = req;
  this.res = res;
  this.message = message;
  this.ckz = ckz;

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
      sms.respond(this.ckz, this.req, this.res, copy.help.instructions);
      query.command = 'help';
      return query;
      break;
    }
    case 'show': {
      if (phrase.length == 1) {
        sms.respond(this.ckz, this.req, this.res, copy.show.noparameter);
        query.command = 'show';
        return query;
      } else if (phrase.length >= 2) {
        delete phrase[0]; // Remove Command
        query.command = 'show';
        query.value = phrase.join(' ').trim();
        return query;
      }
      break;
    }
    case 'select': {
      if (phrase.length == 1) {
        sms.respond(this.ckz, this.req, this.res, copy.select.noparameter);
        query.command = 'select';
        return query;
      } else if (phrase.length >= 2) {
        delete phrase[0]; // Remove Command
        query.command = 'select';
        query.value = phrase.join(' ').trim();
        return query;
      }
      break;
    }
    case 'remove': {
      break;
    }
    default: {
      console.log('phrase.command failed to parse: ' + query.message);
      // sms.respond(this.ckz, this.req, this.res, `Try "help"`);
      break;
    }
  }
}
