'use strict';

let koa = require('koa');
let serve = require('koa-static');
let json = require('koa-json');
var jsonBody = require('koa-json-body');
let app = koa();

let mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_URL);

let ssOrg = require('./models/server.schema.organization');
let logBase = require('./modules/logic.base');

app.use(json());
app.use(jsonBody({ limit: '10kb' }));
app.use(serve('.'));
app.use(function *(next) {
  if (this.url == '/message' && this.method == 'POST') {
    console.log(this.request.body);
    this.body = { message: logBase.message(this.request.body.message) };
  } else {
    if (this.url == '/') {
      /*
      let Org = mongoose.model('Organization', ssOrg);
      // Setup document
      let soupKitchen = new Org({
        title: {
          name: 'Downtown Soup Kitchen',
          phonetic: [],
        },
        type: 'Non-Profit Organziation',
        phoneNumber: '(907) 277-4302',
        hours: {
          open: 11,
          closed: 19,
        },
        address: {
          streetOne: '240 E 3rd Ave',
          city: 'Anchorage',
          zipCode: '99501',
        },
      });
      // Save Document
      soupKitchen.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Org Saved!');
        }
      });
      */
    }
    yield next;
  }
});
app.use(function *() {
  this.body = 'Hello World';
});
app.listen(3000);
