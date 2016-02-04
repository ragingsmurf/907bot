'use strict';
// jscs:disable disallowMixedSpacesAndTabs
// jscs:disable maximumLineLength
// jscs:disable requireCapitalizedComments
// jscs:disable disallowNewlineBeforeBlockStatements

// Third Party.
require('linq-es6');
let doT = require('./../node_modules/dot/doT.js');
doT.templateSettings = require('./dotSettings')();
// Internal
let cmd = require('./cmd')();
let stack = require('./cmd.stack')();
let services = require('./cmd.services');

let organization = require('./process.organization');
let association = require('./process.association');
let user = require('./process.user');

let sms = require('./sms.utility');
let l = require('./logger')();

let temp = require('./../data/templates');
let data = require('./data.sources')();
let cmdres = require('./../data/cmd.resource');
let docres = require('./../data/copy.classifiers');
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
      if (!query.command) {
        // No core commands found.
        l.c(`No core-commands parsed.`);
        return false;
      }
      let cmd = query.command;
      // 2. Figure out which command.
      l.c(`running ${query.command} against engine.`);
      switch (cmd) {
        case 'help':
          {
            sms.respond(ckz, req, res, copyins.help.instructions);
            return true;
            break;
          }
        case 'unsubscribe':
          {
            sms.respond(ckz, req, res, 'remove');
            return true;
            break;
          }
        case 'profile':
          {
            let p = yield user.profile(frm);
            let u = p[0];
            let t = {
              name: u.name,
              status: u.enabled ? 'enabled' : 'disabled',
              list: [],
            };
            // Rollup subscriptions and commands.
            for (let a of u.associations) {
              for (let s of a.service) {
                let docs = docres.taxonomy
                  .asEnumerable()
                  .where(x => x.node == s)
                  .toArray();
                let n = docs[0][`name`];
                let cmds = cmdres.commands
                  .asEnumerable()
                  .where(x => x.resource === s)
                  .toArray();
                t.list.push({
                  name: n,
                  lineitems: cmds,
                });
              }
            }
            let list = doT.template(temp.profile.results)({
              profile: t,
            });
            sms.respond(ckz, req, res, list);
            return true;
            break;
          }
        case 'subscribe':
          {
            let parsed = false
            try {
              let rid = query.phrase.tags
                .asEnumerable()
                .where(x => x[0] === 'resource')
                .toArray()[0][1];
              let state = require('./cookie.state')(ckz);
              // Check if user is associated with an organization.
              let assoc = yield association.orgid(frm);
              if (assoc.length) {
                l.c(`Add user org assocation resource to the user.`);
                // Associate user to resource
                association.add(frm, rid);
                let cmds = cmdres.commands
                  .asEnumerable()
                  .where(x => x.resource === rid)
                  .toArray();
                let list = doT.template(temp.select.results)({
                  rid: rid,
                  cmds: cmds,
                });
                // Remove cookie.
                state.reset();
                // Notify the user
                sms.respond(ckz, req, res, list);
                parsed = true;
              } else {
                // Save requested resource subscription
                state.set(state.states.ADD_ORGANIZATION);
                state.setTemp(rid);
                // Ask user to find organization.id.
                sms.respond(ckz, req, res, copyins.register.orgnotfound);
                parsed = true;
              }
            } catch (err) {
              l.c(err);
              // sms.respond(ckz, req, res, err);
              parsed = true;
            } finally {

            }
            return parsed;
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
        default:
          {
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
      let handled = false;
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
        // 4. Save the notification.
        yield user.notify(orgid, frm, notify);
        // 5. Let the user know.
        sms.respond(ckz, req, res, copysms
          .single(x => x.name == 'notification')
          .copy
          .replace('{0}', orgname)
          .replace('{1}', cmdphrase)
          .replace('{2}', notify.value));
        handled = true;
      } else {
        // 2.1 - User not associated
        sms.respond(ckz, req, res, copysms
          .single(x => x.name == 'notsubscribed')
          .copy
          .replace('{0}', notify.command.join(' ')));
        handled = true;
      }
      return handled;
    },
  }
};
