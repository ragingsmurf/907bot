'use strict';
// jscs:disable requireCapitalizedComments

let app = require('koa')();
let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')();
let twilio = require('./modules/twilio');
let logicBase = require('./modules/logic.base')();
let copy = require('./data/copy.instructions');

app.keys = ['907Bot'];
app.use(session(app));
app.use(bodyParser());

// Incoming Twilio SMS messages
router.post('/sms', function *(next) {
  // 1. Stem into array, check for CLI keywords
  let smsMsg = this.request.body.Body;
  let phrase = logicBase.stem(smsMsg);

  switch (phrase[0]) {
    case 'help': {
      twilio.respond(this.req, this.res, 'Help instructions!');
      break;
    }
    case 'find': {
      if (phrase.length == 1) {
        let msg = 'Please provide Find with a service name.';
        twilio.respond(this.req, this.res,msg);
      } else if (phrase.length >= 2) {
        delete phrase[0]; // Remove Find Command
        // Find remaining params
        let msg = `Finding Services: ${phrase.join(' ')}`;
        twilio.respond(this.req, this.res, msg); // Notify user.
      }
      break;
    }
    case 'add': {
      twilio.respond(this.req, this.res, 'Add something!');
      break;
    }
    case 'remove': {
      break;
    }
    default: {
      twilio.respond(this.req, this.res, 'No command found. Try "help"');
      break;
    }
  }
});


// Default Page
router.get('/', function *() {
  this.body = '@907bot Service';
});

app.use(router.routes())
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
