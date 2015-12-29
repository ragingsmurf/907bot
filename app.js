'use strict';
// jscs:disable requireCapitalizedComments

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

// KOA Modules
let app = require('koa')();
let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')();

// 3rd Party Modules
let Knwl = require('knwl.js');

// Internal Modules
let sms = require('./modules/sms.utility');
let phrase = require('./modules/phrase.command');
let engine = require('./modules/cmd.engine')();
let monUser = require('./modules/mongo.user');
let copy = require('./data/copy.instructions');

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

  // let kw = new Knwl('english');
  // kw.register('times', require('./node_modules/knwl.js/default_plugins/times'));
  // kw.init(txt);

  // 1. Check the incoming phone number, existing user?

  // Check to see if phone number is on file.
  let user = yield monUser.find(frm);
  if (user === null) {
    // Ask the user for their name.
    if (!ckz.get('state')) {
      ckz.set('state', 'new');
      sms.respond(this.req, this.res, copy.help.newuser);
      sms.process();
    }

    // New user confirmation on name provided.
    if (ckz.get('state') === 'new' && txt.toLowerCase() !== 'yes') {
      ckz.set('temp', txt);
      sms.respond(this.req, this.res, `Is [${txt}] correct? (yes|no)`);
      sms.process();
    } else if (ckz.get('temp')) { // Create user, say thanks!
      let name = ckz.get('temp');
      if (name !== undefined) {
        name = name.replace('"','').replace('"','');
      }
      user = yield monUser.create(name, frm);
      ckz.set('state', undefined);
      ckz.set('temp', undefined);
      sms.respond(this.req, this.res, `Thanks [${name}]!`);
      sms.process();
    }
  } else {
    // 2. Convert incoming message to phrase query object.
    let query = phrase.basic(req, res, txt);
    // 3. Run command parser on incoming queries.
    engine.commandParser(query, req, res, txt, ckz);
  }
});

// Default Page
router.get('/', function *() {
  this.body = '@907bot Service';
});

app.on('error', function(err) {
  console.log('server error: ' + err);
});

app.use(router.routes())
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
