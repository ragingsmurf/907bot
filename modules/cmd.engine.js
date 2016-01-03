'use strict';
// jscs:disable disallowMixedSpacesAndTabs
// jscs:disable maximumLineLength
// jscs:disable requireCapitalizedComments

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
let organization = require('./process.organization');
let association = require('./process.association');
let temp = require('./../data/templates');
let l = require('./logger')();
let copy = require('./../data/copy.sms')
  .services
  .asEnumerable();

module.exports = function() {
  let current = 0;
  let commands = [];
  return {
    commandParser: function*(query, req, res, frm, txt, ckz) {
      // Exit if query wasn't parsed.
      if (!query) {
        // Exited because is was no valid query object.
        l.c(`No command parsed, exiting command parser.`);
        yield false;
      }
      // 2. Figure out which command.
      switch (query.command) {
        case 'show': {
          // Execute show on category.
          l.c(`Running Show Command.`);
          let result = stack.execute(new services.show(query));
          yield stack.getCurrentValue()
          .then(function(obj) {
            l.c(`Found node for Show Command.`);
            sms.respond(ckz, req, res, doT.template(temp.show.results)(obj));
          })
          .catch(function(error) {
            l.c(`Match not found for (${query.message}) sub-category.`);
            sms.respond(ckz, req, res, error);
          });
          break;
        }
        case 'select': {
          // Execute Select.
          l.c(`Running Select Command.`);
          let result = stack.execute(new services.select(query));
          try {
            let oeNode = yield stack.getCurrentValue();
            let rid = oeNode.id
              .replace('"', '')
              .replace('"', '');
            // Check if user is associated with an organization.
            let assoc = yield association.orgid(frm);
            if (assoc.length) {
              let txt = 'empty';
              l.c(`Adding service association to the user.`);
              let resourceId = ckz.get('resourceId');
              if (resourceId === undefined) {
                association.add(frm, rid);
                txt = `I added (${rid}) to your profile.`;
              } else {
                resourceId = resourceId
                  .replace('"', '')
                  .replace('"', '');
                association.add(frm, resourceId);
                txt = `I added (${resourceId}) to your profile.`;
              }
              // Remove cookie.
              ckz.set('resourceId', undefined);

              // Notify the user
              sms.respond(ckz, req, res, txt);
            } else {
              // Found Second or Third level service node.
              ckz.set('resourceId', rid);
              // Ask user to find organization.id.
              yield organization.find(query, req, res, frm, txt, ckz);
            }
          } catch (err) {
            sms.respond(ckz, req, res, 'I wasn\'t able to find that resource code.');
          } finally {

          }
          break;
        }
        case 'remove': {
          // Execute Select.
          l.c(`Running Remove Command.`);
          let result = stack.execute(new services.select(query));
          try {
            let oeNode = yield stack.getCurrentValue();
            let rid = oeNode.id
              .replace('"', '')
              .replace('"', '');
            // Check if the user is associated with an organization.
            let assoc = yield association.orgid(frm);
            if (assoc.length) {
              l.c(`Removing service association from user profile.`);
              association.remove(frm, rid);
              // Notify the user
              sms.respond(ckz, req, res, `I removed (${rid}) from your profile.`);
            } else {
              let txt = `It doesn't appear you're associated with an organzation.`;
              // Notify the user
              sms.respond(ckz, req, res, txt);
            }
          } catch (err) {
            sms.respond(ckz, req, res, 'I wasn\'t able to find that resource code.');
          } finally {

          }
          break;
        }
        default: {
          l.c('No command was run!');
          yield false;
          break;
        }
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
            resourceId: user selects specific resource.
            undefined: un-used, reset status.
            temp: temporary value storage between messages.
      */
      // Check for the organization.
      if (ckz.get('state') == 'addOrganization'
        && ckz.get('temp') == undefined) {
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
