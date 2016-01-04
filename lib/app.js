'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable maximumLineLength

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

// KOA Modules
let app = require('koa')();
let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')();

// Internal Modules
let phrase = require('./../modules/phrase.command');
let engine = require('./../modules/cmd.engine')();
let user = require('./../modules/process.user');
let data = require('./../modules/data.sources')();
let l = require('./../modules/logger')();

app.keys = ['907Bot'];
app.use(session(app));
app.use(bodyParser());

// Incoming Twilio SMS messages
router.post('/sms', function *(next) {
  let req = this.req;
  let res = this.res;
  let txt = this.request.body.Body;
  let frm = this.request.body.From;
  let ckz = this.cookies;

  // Message data sets.
  // let forecast = yield data.weather('99501');
  // let time = yield data.knwl('7pm');

  l.c(`Received /sms POST from (${frm}).`);

  // 1. Check the incoming phone number, existing user?
  let registered = yield user.registered(frm);
  if (!registered) {
    l.c(`Unknown number (${frm}), start registration.`);
    // 2. Regiser the current phone number.
    yield user.register(req, res, frm, ckz, txt);
  } else {
    l.c(`Request is from a returning user.`);
    let state = ckz.get('state');
    if (state != undefined) {
      l.c('Cookie state exists, process it.');
      // 3. Run cookie state.
      yield engine.cookieParser(req, res, frm, txt, ckz);
    } else {
      l.c('Start query break-down')
      // 3. Convert incoming message to Phrase Query.
      let query = phrase.basic(ckz, req, res, txt);
      // 4. Parse for commands to execute. (Show, Select, Remove)
      let parsed = yield engine.commandParser(query, req, res, frm, txt, ckz);
      if (parsed === false) {
        // 5 Parse for notifications (Incoming Data)
        let notify = phrase.notice(ckz, req, res, txt);
        if (notify !== false) {
          let notice = yield engine.notificationParser(notify, req, res, frm, txt, ckz);
        }
      }
    }
  }
});

// Default Page
router.get('/', function *() {
  l.c('Received / GET');
  this.body = '@907bot Social Service Bot';
});

app.on('error', function(err) {
  c.l(`app.js error: ${err}`);
});

app.use(router.routes())
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
