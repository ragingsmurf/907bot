'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable maximumLineLength

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

var http = require('http');

// KOA Modules
let app = require('koa')();
let serve = require('koa-static-folder');
let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let router = require('koa-router')();
let server = http.createServer(app.callback());
let io = require('socket.io')(server);

// Internal Modules
let phrase = require('./../modules/phrase.command');
let engine = require('./../modules/cmd.engine')();
let cookie = require('./../modules/cmd.cookie')();

let user = require('./../modules/process.user');
let data = require('./../modules/data.sources')();
let l = require('./../modules/logger')();
let sms = require('./../modules/sms.utility');
let wx = require('./../modules/mongo.weather');

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

  // let time = yield data.knwl('7pm');
  l.c(`POST to /sms from source ${frm}`);

  // 1. Convert incoming message to Phrase Query.
  let query = phrase.basic(ckz, req, res, txt);
  // 2. Parse cookies (pre-existing conversation state)
  let handled = yield cookie.Parser(query, req, res, frm, txt, ckz);
  // 3. If not handled by the cookie parser.
  if (!handled) {
    // 4 Check the incoming phone number, are they an existing user?
    let registered = yield user.registered(req, res, frm, ckz);
    if (!registered) {
      l.c(`Request is from an unknown user ${frm}`);
      // 4.1 Setup registration process.
      user.register(req, res, frm, ckz, txt);
    } else {
      l.c(`Request is from a registered user ${frm}`);
      // 5 Parse for commands to execute. (Help, Subscribe)
      let parsed = yield engine.commandParser(query, req, res, frm, txt, ckz);
      if (!parsed) {
        l.c('Parse for more commands');
        let notify = phrase.notice(ckz, req, res, txt);
        // 6 Parse for notifications (Incoming Data)
        if (notify !== false) {
          let notice = yield engine.notificationParser(notify, req, res, frm, txt, ckz);
          if (notice) {
            // 7 Broadcast update to users.
            agg.write().next().value.exec().then(function() {
              agg.notifications().next().value.exec().then(function(data) {
                io.sockets.emit('notification', data);
              });
            });
          } else {
            // 6.2 Unable to parse user's request.
            l.c(`Unable to parse (${txt}) into a command.`);
            sms.respond(ckz, req, res, `Sorry, I couldn't parse your message into a command, please try again.`);
          }
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

exports.app = app;
