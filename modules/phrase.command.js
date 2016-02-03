'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable maximumLineLength
// jscs:disable disallowNewlineBeforeBlockStatements

require('linq-es6');
let natural = require('./../modules/phrase.natural')();
let sms = require('./../modules/sms.utility');
let l = require('./logger')();

exports.basic = function(ckz, req, res, message) {
  this.req = req;
  this.res = res;
  this.message = message;
  this.ckz = ckz;

  l.c(`Phrase (${message}) into command query.`);

  let phrase = natural.tag(this.message); // Tag and Tokenize message.
  let query = {
    command: undefined, // Unknown
    message: this.message, // Original message
    phrase: phrase, // Tagged message
    value: undefined, // Unknown
  };


  let tagged = natural.tag(message);
  let tags = tagged.tags.asEnumerable();
  let tag = undefined;
  if (tags.toArray()[0]) {
    if (tags.toArray()[0].length === 1) {
      tag = tags.toArray()[0][0];
      switch (tag) {
        case 'help':
          {
            query.command = 'help';
            break;
          }
      }
    } else {
      let cmd = tags.where(x => x[0] == 'command').toArray();
      if (cmd.length !== 0) {
        query.command = cmd[0][1].replace('"', '').replace('"', '');
      }
    }
  }

  query.command = query.command ?
    query.command.replace('"', '').replace('"', '') : undefined;

  return query;

  // TODO - Migrate in core commands below.

  //   case 'show': {
  //     if (phrase.length == 1) {
  //       l.c(`show command found with no parameter.`);
  //       sms.respond(this.ckz, this.req, this.res, copy.show.noparameter);
  //       query.command = 'show';
  //     } else if (phrase.length >= 2) {
  //       delete phrase[0]; // Remove Command from Array
  //       query.command = 'show';
  //       query.value = phrase.join(' ').trim();
  //       l.c(`show command found with parameter (${query.value}).`);
  //     }
  //     return query;
  //     break;
  //   }
  //   case 'select': {
  //     if (phrase.length == 1) {
  //       l.c(`select command found with no parameter.`);
  //       sms.respond(this.ckz, this.req, this.res, copy.select.noparameter);
  //       query.command = 'select';
  //     } else if (phrase.length >= 2) {
  //       delete phrase[0]; // Remove Command
  //       query.command = 'select';
  //       query.value = phrase.join(' ').trim();
  //       l.c(`select command found with parameter (${query.value}).`);
  //     }
  //     return query;
  //     break;
  //   }
  //   case 'remov': { // Misspelled as a result of Stemming.
  //     if (phrase.length == 1) {
  //       l.c(`remove command found with no parameter.`);
  //       sms.respond(this.ckz, this.req, this.res, copy.remove.noparameter);
  //       query.command = 'remove';
  //     } else if (phrase.length >= 2) {
  //       delete phrase[0]; // Remove Command
  //       query.command = 'remove';
  //       query.value = phrase.join(' ').trim();
  //       l.c(`remove command found with parameter (${query.value}).`);
  //     }
  //     return query;
  //     break;
  //   }
  //   default: {
  //     l.c('phrase.command failed to parse: ' + query.message);
  //     return false;
  //     break;
  //   }
  // }
}

exports.notice = function(ckz, req, res, message) {
  this.req = req;
  this.res = res;
  this.message = message;
  this.ckz = ckz;

  l.c(`Parsing (${message}) into notify query.`);

  let phrase = natural.tag(this.message); // Tag and Stem message.
  let notify = {
    command: [], // Empty
    message: this.message, // Original message
    resource: undefined, // Unknown ID "101 04"
    phrase: phrase, // Tagged message
    value: undefined, // Unknown
  };

  // Process tagged items.
  if (phrase.tags.length) {

    // Fetch resource Identifier
    let rid = phrase.tags
      .asEnumerable()
      .where(x => x[0] === 'resource')
      .toArray()[0][1];
    notify.resource = rid;

    // Fetch first value passed in.
    let num = phrase.tags
      .asEnumerable()
      .where(x => x[0] === 'numbers')
      .toArray()[0][1][0];
    notify.value = parseInt(num);

    // Tagged resource; likely a command.
    if (rid) {
      if (phrase.message.length >= 3) {
        notify.command = [phrase.message[0], phrase.message[1]];
      }
    }
  } else {
    return false;
  }
  return notify;
}
