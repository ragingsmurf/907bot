'use strict';
// jscs:disable requireCapitalizedComments

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

// Node Modules
let fs = require('fs');

// KOA Modules
let app = require('koa')();
let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')();

// 3rd Party Modules
let Knwl = require('knwl.js');
// let kw = new Knwl('english');
// kw.register('times', require('./node_modules/
// knwl.js/default_plugins/times'));
// kw.init(txt);

// Internal Modules
let phrase = require('./modules/phrase.command');
let engine = require('./modules/cmd.engine')();
let user = require('./modules/process.user');
let csv = require('./modules/parse.csv')();

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

  // test CSV out
  // csv.parse(data, function(err, data){


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
  let result = yield csv.parse('./data/charities.csv');
  console.log(result);
  this.body = '@907bot Social Service Bot';
});

app.on('error', function(err) {
  console.log(err);
});

app.use(router.routes())
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
