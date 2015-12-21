'use strict';

let app = require('koa')();
let serve = require('koa-static');
let json = require('koa-json');
let jsonBody = require('koa-json-body');
let Bender = require('./modules/logic.base')();

app.use(json());
app.use(jsonBody({ limit: '1kb' }));
app.use(serve('.'));

app.use(function *(next) {
  if (this.url == '/message' && this.method == 'POST') {
    console.log(Bender.message(this.request.body.message));
    this.body = {
      message: Bender.message(this.request.body.message).text,
    };
  } else {
    yield next;
  }
});
app.use(function *() {
  this.body = '@907bot Service';
});

app.listen(3000);
