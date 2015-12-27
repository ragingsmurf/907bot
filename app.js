'use strict';
// jscs:disable requireCapitalizedComments

// KOA Modules
let app = require('koa')();
let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')();

// Internal Modules
let sms = require('./modules/sms.utility');
let cmd = require('./modules/cmd')();
let stack = require('./modules/cmd.stack')();
let phrase = require('./modules/phrase.command');
let services = require('./modules/cmd.services');

app.keys = ['907Bot'];
app.use(session(app));
app.use(bodyParser());

// Incoming Twilio SMS messages
router.post('/sms', function *(next) {
  // 1. Convert incoming message to phrase query object.
  let req = this.req;
  let res = this.res;
  let txt = this.request.body.Body;
  let query = phrase.basic(req, res, txt);

  // 2. Figure out which command, based on parsed query.
  switch (query.command) {
    case 'find': {
      // Execute find.
      let result = stack.execute(new services.find(query));
      yield stack.getCurrentValue()
      .then(function(obj) {
        // Found Array of results.
        if (Array.isArray(obj)) {
          let txt = '';
          for (var i = 0; i < obj.length; i++) {
            txt += `${obj[i].id} (${obj[i].title})`;
            if (obj[i].count) {
              txt += `(${obj[i].count})`;
            }
            txt += '\n';
          }
          sms.respond(req, res, txt);
        }
      })
      .catch(function(error) {
        sms.respond(req, res, error);
      });
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
