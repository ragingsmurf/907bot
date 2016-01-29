'use strict';

// jscs:disable requireCapitalizedComments
// jscs:disable disallowNewlineBeforeBlockStatements

let Enum = require('enum');
let l = require('./logger')();

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
module.exports = function(ckz) {

  let StateEnum = new Enum({
    UNDEFINED: 0,
    REGISTER_USER: 1,
    ADD_ORGANIZATION: 2,
    SUBSCRIBE_RESOURCE: 3,
    UNSUBSCRIBE_RESOURCE: 4,
  });
  return {
    states: StateEnum,
    get: function() {
      let val = ckz.get('state');
      if (val !== undefined) {
        let num = parseInt(val);
        return StateEnum.get(num);
      }
      return StateEnum.UNDEFINED;
    },
    set: function(state) {
      let self = this;
      let se = self.states.get(state);
      l.c(`Set Cookie State: ${se.key}`);
      switch (se.key) {
        case 'UNDEFINED':
          {
            l.c('Cookie State to UNDEFINED');
            ckz.set('state', state.value);
            break;
          }
        case 'REGISTER_USER':
          {
            l.c('Cookie State to REGISTER_USER');
            ckz.set('state', state.value);
            break;
          }
        case 'ADD_ORGANIZATION':
          {
            l.c('Cookie State to ADD_ORGANIZATION');
            ckz.set('state', state.value);
            break;
          }
        case 'SUBSCRIBE_RESOURCE':
          {
            l.c('Setting state to SUBSCRIBE_RESOURCE');
            ckz.set('state', state.value);
            break;
          }
        case 'UNSUBSCRIBE_RESOURCE':
          {
            l.c('Setting state to UNSUBSCRIBE_RESOURCE');
            ckz.set('state', state.value);
            break;
          }
        default:
          {
            l.c('SetState passed through to default:');
            break;
          }
      }
    },
    getTemp: function() {
      let tmp = ckz.get('temp');
      l.c(`Get temp Cookie: ${tmp}`);
      if (tmp !== undefined) {
        return tmp;
      }
      return undefined;
    },
    setTemp: function(val) {
      l.c(`Set temp Cookie: ${val}`);
      ckz.set('temp', val);
    },
    reset: function() {
      l.c('Reset State Cookie');
      let self = this;
      self.setTemp(undefined);
      self.set(self.states.UNDEFINED);
    },
  }
}
