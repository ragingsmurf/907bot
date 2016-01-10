'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable maximumLineLength

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

var http = require('http');

// KOA Modules
let app = require('koa')();
var serve = require('koa-static-folder');

let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')();
var server = http.createServer(app.callback());
var io = require('socket.io')(server);

// Internal Modules
let phrase = require('./../modules/phrase.command');
let engine = require('./../modules/cmd.engine')();
let user = require('./../modules/process.user');
let data = require('./../modules/data.sources')();
let l = require('./../modules/logger')();
let sms = require('./../modules/sms.utility');

// testing
let agg = require('./../modules/mongo.aggregate');

app.keys = ['907Bot'];
app.use(session(app));
app.use(bodyParser());

// Grab socket connection.
io.on('connection', function(socket) {
  l.c('A user connected over socket.io!');
  agg.notifications().next().value.exec().then(function(data) {
    io.sockets.emit('notification', data);
  });
});

// Incoming Twilio SMS messages
router.post('/sms', function*(next) {
  let req = this.req;
  let res = this.res;
  let txt = this.request.body.Body;
  let frm = this.request.body.From;
  let ckz = this.cookies;

  // Message data sets.
  // let forecast = yield data.weather('99501');
  // let time = yield data.knwl('7pm');

  // Notify connected users of incoming SMS.
  // io.sockets.emit('sms', {from: frm});

  l.c(`Received /sms POST from (${frm}).`);

  // 1. Check the incoming phone number, existing user?
  let registered = yield user.registered(req, res, frm, ckz);
  if (!registered) {
    l.c(`Unrecognized number (${frm}), start register.`);
    // 2.2 Register the current phone number.
    yield user.register(req, res, frm, ckz, txt);
  } else {
    l.c(`Request is from a returning user.`);
    let state = ckz.get('state');
    if (state != undefined) {
      l.c('Cookie state exists, process it.');
      // 3.1 Run cookie state.
      yield engine.cookieParser(req, res, frm, txt, ckz);
    } else {
      l.c('Start query break-down');
      // 3.2 Convert incoming message to Phrase Query.
      let query = phrase.basic(ckz, req, res, txt);
      // 4. Parse for commands to execute. (Show, Select, Remove)
      let parsed = yield engine.commandParser(query, req, res, frm, txt, ckz);
      if (parsed === false) {
        // 5 Parse for notifications (Incoming Data)
        let notify = phrase.notice(ckz, req, res, txt);
        if (notify !== false) {
          let notice = yield engine.notificationParser(notify, req, res, frm, txt, ckz);
          // Broadcast update to users.
          agg.notifications().next().value.exec().then(function(data) {
            io.sockets.emit('notification', data);
          });
        } else {
          l.c(`Notify user we couldn't parse (${txt}) into a command.`);
          sms.respond(ckz, req, res, `Sorry, I couldn't parse your last message into a valid command.`);
        }
      }
    }
  }
});

// Serve Public Directory
app.use(serve('./public'));
app.use(serve('./bower_components'));

app.on('error', function(err) {
  l.c(`app.js error: ${err}`);
});

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(process.env.PORT || 3000);
