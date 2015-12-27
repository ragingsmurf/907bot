'use strict';
// jscs:disable requireCapitalizedComments

let app = require('koa')();
let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')();
let twilio = require('./modules/twilio');
let phrase = require('./modules/phrase');
let cmd = require('./modules/cmd')();
let stack = require('./modules/cmd.stack')();
let services = require('./modules/cmd.services');

app.keys = ['907Bot'];
app.use(session(app));
app.use(bodyParser());

// Incoming Twilio SMS messages
router.post('/sms', function *(next) {
  // 1. Convert to command object.
  let smsQuery = phrase.basic(this.req, this.res, this.request.body.Body);

  // 2. Figure out which command, based on the query.
  switch (smsQuery.command) {
    case 'find': {
      let txt = `Going to find: ${smsQuery.value}`;
      twilio.respond(this.req, this.res, txt);
      // TODO - Execute command Promises.
      stack.execute(new services.find(smsQuery));
      break;
    }
  }

  // cmd.stack.execute(new cmdServ.find('Find something'));

  // let msg = `One sec, finding: ${smsQuery.phrase.join(' ')}`;
  // twilio.respond(this.req, this.res, msg); // Notify user.

});

// Default Page
router.get('/', function *() {
  this.body = '@907bot Service';
});

app.use(router.routes())
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
