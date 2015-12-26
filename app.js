'use strict';

let app = require('koa')();
let serve = require('koa-static');
let json = require('koa-json');
let jsonBody = require('koa-json-body');
let logicBase = require('./modules/logic.base')();
let session = require('koa-session');
let copy = require('./data/copy.instructions');
let twilio = require('./modules/twilio');
var bodyParser = require('koa-bodyparser');

app.keys = ['907bot'];
// app.use(json());
// app.use(jsonBody({ limit: '1kb' }));
app.use(serve('.'));
app.use(session(app));
app.use(bodyParser());

app.use(function *(next) {

  // twilio.send();

  if (this.url == '/sms' && this.method == 'POST') {
    // console.log(this.request.body);
    twilio.respond(this.req, this.res, this.request.body);
  } else {
    yield next;
  }

  

  //if (this.url == '/message' && this.method == 'POST') {

  // Check to see if part of session workflow.

  // let job = logicBase.findTopic(this.request.body.message);
  // let respondWith = 'I couldn\'t formulate a good response.';

  // // Does the user have a topic selected?
  // if (this.session.topic == null && job.topic !== 'help') {
  //   this.session.topic = job.topic;
  //   this.session.words = job.message;
  //   respondWith = `Ok, let's chat about ${job.topic}!`;
  // } else if (job.topic === 'help') {
  //   respondWith = copy.help.instructions;
  // };

  //this.body = {
  //  message: respondWith,
  // };

  //} else {
  //  yield next;
  //}
});
app.use(function *() {
  this.body = '@907bot Service';
});

app.listen(process.env.PROCESS || 3000);
