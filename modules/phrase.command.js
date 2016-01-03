'use strict';

let natural = require('./../modules/phrase.natural')();
let sms = require('./../modules/sms.utility');
let l = require('./logger')();

exports.basic = function(ckz, req, res, message) {
  this.req = req;
  this.res = res;
  this.message = message;
  this.ckz = ckz;

  l.c(`Parsing phrase (${message}) into command query.`);

  let phrase = natural.stem(this.message); // Tokenize and Stem message.
  let query = {
    command: undefined, // Unknown
    message: this.message, // Original message
    phrase: phrase, // Stemmed message
    value: undefined, // Unknown
  };

  let copy = require('./../data/copy.instructions');
  switch (phrase[0]) {
    case 'help': {
      l.c(`help command found.`);
      sms.respond(this.ckz, this.req, this.res, copy.help.instructions);
      query.command = 'help';
      return query;
      break;
    }
    case 'show': {
      if (phrase.length == 1) {
        l.c(`show command found with no parameter.`);
        sms.respond(this.ckz, this.req, this.res, copy.show.noparameter);
        query.command = 'show';
      } else if (phrase.length >= 2) {
        delete phrase[0]; // Remove Command from Array
        query.command = 'show';
        query.value = phrase.join(' ').trim();
        l.c(`show command found with parameter (${query.value}).`);
      }
      return query;
      break;
    }
    case 'select': {
      if (phrase.length == 1) {
        l.c(`select command found with no parameter.`);
        sms.respond(this.ckz, this.req, this.res, copy.select.noparameter);
        query.command = 'select';
      } else if (phrase.length >= 2) {
        delete phrase[0]; // Remove Command
        query.command = 'select';
        query.value = phrase.join(' ').trim();
        l.c(`select command found with parameter (${query.value}).`);
      }
      return query;
      break;
    }
    case 'remov': { // Misspelled as a result of Stemming.
      if (phrase.length == 1) {
        l.c(`remove command found with no parameter.`);
        sms.respond(this.ckz, this.req, this.res, copy.remove.noparameter);
        query.command = 'remove';
      } else if (phrase.length >= 2) {
        delete phrase[0]; // Remove Command
        query.command = 'remove';
        query.value = phrase.join(' ').trim();
        l.c(`remove command found with parameter (${query.value}).`);
      }
      return query;
      break;
    }
    default: {
      console.log('phrase.command failed to parse: ' + query.message);
      return false;
      break;
    }
  }
}
