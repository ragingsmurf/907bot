'use strict';

// Internal Modules
let sms = require('./sms.utility');
let cmd = require('./cmd')();
let stack = require('./cmd.stack')();
let services = require('./cmd.services');

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
            // Found Array of results.
            if (Array.isArray(obj)) {
              let txt = '';
              let top = false;
              for (var i = 0; i < obj.length; i++) {
                if (obj[i].id.length == 3) {
                  top = true;
                }
                txt += `[${obj[i].id}] ${obj[i].title}`;
                if (obj[i].count) {
                  txt += ` (${obj[i].count})`;
                }
                txt += '\n';
              }
              if (top) {
                txt = `[Social Services]\n` + txt;
                txt += '\n';
                txt += `'Show [number]'`;
              }
              sms.respond(req, res, txt);
            }
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
            ckz.set('serviceid', obj.id, { signed: true });
            let msg = `You have selected the '${obj.title}' [${(obj.id)}]`;
            msg += ` Social Service resource!`;
            sms.respond(req, res, msg);
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
