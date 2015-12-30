'use strict';
// jscs:disable requireCapitalizedComments

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

// KOA Modules
let app = require('koa')();
let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')();

// Internal Modules
let phrase = require('./modules/phrase.command');
let engine = require('./modules/cmd.engine')();
let user = require('./modules/process.user');
let data = require('./modules/data.sources')();

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
  let carities = yield data.csv('./data/charities.csv');
  let forecast = yield data.weather('99501');
  let time = yield data.knwl('7pm');

  let registered = yield user.registered(frm);
  // 1. Check the incoming phone number, existing user?
  if (!registered) {
    yield user.register(req, res, frm, ckz, txt);
  } else {
    // 2. Convert incoming message to Phrase Query.
    let query = phrase.basic(req, res, txt);
    // 3. Run command parser on incoming queries.
    yield engine.commandParser(query, req, res, txt, ckz);
  }
});

// Default Page
router.get('/', function *() {
  this.body = '@907bot Social Service Bot';
});

app.on('error', function(err) {
  console.log(err);
});

app.use(router.routes())
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
