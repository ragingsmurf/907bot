'use strict';
// jscs:disable disallowMixedSpacesAndTabs
// jscs:disable maximumLineLength
// jscs:disable requireCapitalizedComments

// Third Party.
require('linq-es6');
let doT = require('./../node_modules/dot/doT.js');
doT.templateSettings = {
  evaluate: /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode: /\{\{!([\s\S]+?)\}\}/g,
  use: /\{\{#([\s\S]+?)\}\}/g,
  define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: 'it',
  strip: false,
  append: true,
  selfcontained: false,
};
// Internal
let cmd = require('./cmd')();
let sms = require('./sms.utility');
let stack = require('./cmd.stack')();
let services = require('./cmd.services');
let organization = require('./process.organization');
let association = require('./process.association');
let user = require('./process.user');
let temp = require('./../data/templates');
let l = require('./logger')();
let data = require('./data.sources')();
let cmdres = require('./../data/cmd.resource');
let copyins = require('./../data/copy.instructions');
let copysms = require('./../data/copy.sms')
  .services
  .asEnumerable();

module.exports = function() {
  let current = 0;
  let commands = [];
  return {
    commandParser: function*(query, req, res, frm, txt, ckz) {
      // Exit if query wasn't parsed.
      if (!query) {
        // No core commands found.
        l.c(`No core-commands parsed.`);
        return false;
      }
      let cmd = query.command;
      // 2. Figure out which command.
      switch (cmd) {
        case 'help': {
          sms.respond(ckz, req, res, copyins.help.instructions);
          return true;
          break;
        }
        case 'subscribe': {
          return true;
          break;
        }
        // case 'show': {
        //   // Execute show on category.
        //   l.c(`Running Show Command.`);
        //   let result = stack.execute(new services.show(query));
        //   yield stack.getCurrentValue()
        //   .then(function(obj) {
        //     l.c(`Found node for Show Command.`);
        //     sms.respond(ckz, req, res, doT.template(temp.show.results)(obj));
        //   })
        //   .catch(function(error) {
        //     l.c(`Match not found for (${query.message}) sub-category.`);
        //     sms.respond(ckz, req, res, error);
        //   });
        //   break;
        // }
        // case 'select': {
        //   // Execute Select.
        //   l.c(`Running Select Command.`);
        //   let result = stack.execute(new services.select(query));
        //   try {
        //     let oeNode = yield stack.getCurrentValue();
        //     let rid = oeNode.id
        //       .replace('"', '')
        //       .replace('"', '');
        //     // Check if user is associated with an organization.
        //     let assoc = yield association.orgid(frm);
        //     if (assoc.length) {
        //       l.c(`Adding service resource to the user.`);
        //       let resId = (ckz.get('resourceId') == undefined) ? rid : resourceId
        //         .replace('"', '')
        //         .replace('"', '');
        //       // Associate user to resource
        //       association.add(frm, resId);
        //       let cmds = cmdres.commands
        //         .asEnumerable()
        //         .where(x => x.resource === resId)
        //         .toArray();
        //       let txt = doT.template(temp.select.results)({ rid: rid, cmds: cmds });
        //       // Remove cookie.
        //       ckz.set('resourceId', undefined);
        //       // Notify the user
        //       sms.respond(ckz, req, res, txt);
        //     } else {
        //       // Found Second or Third level service node.
        //       ckz.set('resourceId', rid);
        //       // Ask user to find organization.id.
        //       yield organization.find(query, req, res, frm, txt, ckz);
        //     }
        //   } catch (err) {
        //     sms.respond(ckz, req, res, err);
        //   } finally {
        //
        //   }
        //   break;
        // }
        // case 'remove': {
        //   // Execute Select.
        //   l.c(`Running Remove Command.`);
        //   let result = stack.execute(new services.select(query));
        //   try {
        //     let oeNode = yield stack.getCurrentValue();
        //     let rid = oeNode.id
        //       .replace('"', '')
        //       .replace('"', '');
        //     // Check if the user is associated with an organization.
        //     let assoc = yield association.orgid(frm);
        //     if (assoc.length) {
        //       l.c(`Removing service association from user profile.`);
        //       association.remove(frm, rid);
        //       // Notify the user
        //       sms.respond(ckz, req, res, `I removed (${rid}) from your profile.`);
        //     } else {
        //       let txt = `It doesn't appear you're associated with an organzation.`;
        //       // Notify the user
        //       sms.respond(ckz, req, res, txt);
        //     }
        //   } catch (err) {
        //     sms.respond(ckz, req, res, 'I wasn\'t able to find that resource code.');
        //   } finally {
        //
        //   }
        //   break;
        // }
        default: {
          l.c('cmd engine was not run!');
          return false;
          break;
        }
      }
    },
    notificationParser: function*(notify, req, res, frm, txt, ckz) {
      if (notify.command.length == 0) {
        // No notification commands found
        l.c(`No notification commands parsed.`);
        return false;
      }
      // 1. Find out which org the user belongs too.
      let assoc = yield association.orgid(frm);
      // 2. Is user subscribed to the service being notified?
      if (assoc[0]
        .service
        .asEnumerable()
        .where(x => x = notify.resource)
        .toArray()
        .length === 1) {
        // 3. Get the organization associated to the user.
        let org = yield organization.select(assoc[0]._id.orgid);
        let orgname = org[0].name;
        let orgid = org[0]._id;
        let zipcode = org[0].zipcode;
        let cmdphrase = notify.command.join(' ').trim();
        // 4. Save the notification details, and temperature to the db.
        let not = yield user.notify(orgid, frm, notify);
        // 5. Let the user know the updated took.
        let txt = `Thanks! I updated ${orgname} with a ${cmdphrase} of ${notify.value}.`;
        sms.respond(ckz, req, res, txt);
      } else {
        // 2.1 - User isn't associated to the resource.
        let txt = `You're not associated to that resource. Please use 'Select ${notify.resource}'`;
        sms.respond(ckz, req, res, txt);
      }
    },
    cookieParser: function*(req, res, frm, txt, ckz) {
      /*
      cookie index
      state: nature of the messages
            /-- Cookie 'State' List --/
            registration: new user registration.
            addResource: associate user with resource type.
            addOrganization: associate user with organization.
            firstContact: is this the first time number has SMS'd us?
            resourceId: user selects specific resource.
            undefined: un-used, reset status.
            temp: temporary value storage between messages.
      */
      // Check for the organization.
      if (ckz.get('state') == 'addOrganization' && ckz.get('temp') == undefined) {
        yield organization.get(req, res, frm, ckz, txt);
      } else {
        if (txt.toLowerCase() == 'yes') {
          let resourceId = ckz.get('resourceId')
            .replace('"', '')
            .replace('"', '');
          yield association.create(frm, ckz.get('temp'), resourceId);
          ckz.set('resourceId', undefined);
          ckz.set('state', undefined);
          ckz.set('temp', undefined);
          sms.respond(ckz, req, res, 'I added the organization to your profile.');
        } else {
          // Clear the cookie
          ckz.set('temp', undefined);
          ckz.set('state', undefined);
          sms.respond(ckz, req, res, 'Ok, I skipped adding the organization to your profile.');
        }
      }
    },
  }
};
