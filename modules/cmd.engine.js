'use strict';
// jscs:disable disallowMixedSpacesAndTabs
// jscs:disable maximumLineLength

// Third party libraries.
require('linq-es6');
let doT = require('./../node_modules/dot/doT.js');
doT.templateSettings = {
  evaluate:    /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode:      /\{\{!([\s\S]+?)\}\}/g,
  use:         /\{\{#([\s\S]+?)\}\}/g,
  define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: 'it',
  strip: false,
  append: true,
  selfcontained: false,
};
// Internal Modules
let cmd = require('./cmd')();
let sms = require('./sms.utility');
let stack = require('./cmd.stack')();
let services = require('./cmd.services');
let temp = require('./../data/templates');
let copy = require('./../data/copy.sms')
  .services
  .asEnumerable();

module.exports = function() {
  let current = 0;
  let commands = [];
  return {
    commandParser: function*(query, req, res, txt, ckz) {
      // Exit if query wasn't parsed.
      if (!query) {
        // Exited because is was no valid query object.
        return false;
      }
      // 2. Figure out which command.
      switch (query.command) {
        case 'show': {
          // Execute find.
          let result = stack.execute(new services.show(query));
          yield stack.getCurrentValue()
          .then(function(obj) {
            sms.respond(req, res, doT.template(temp.show.results)(obj));
          })
          .catch(function(error) {
            sms.respond(req, res, error);
          });
          break;
        }
        case 'select': {
          // Execute Select.
          let result = stack.execute(new services.select(query));
          yield stack.getCurrentValue()
          .then(function(obj) {
            // Found Second or Third level node.
            ckz.set('resourceid', obj.id, { signed: true });
            sms.respond(req, res, copy
              .single(x => x.name == 'selected')
              .copy
              .replace('{0}', `${obj.title}`)
              .replace('{1}', `${(obj.id)}`));
          })
          .catch(function(error) {
            sms.respond(req, res, error);
          });
          break;
        }
      }
    },
  }
};
