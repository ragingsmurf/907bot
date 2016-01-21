'use strict';

// jscs:disable requireCapitalizedComments
// jscs:disable requireCurlyBraces

require('dotenv').config();

let assert = require('assert');
// let request = require('supertest');
let request = require('supertest-koa-agent');
let l = require('./../modules/logger.js')();
let app = require('./../lib/app').app;

describe('Webserver', function() {
  it('should load be able GET the dashboard', function(done) {
    request(app)
      .get('/public/index.html')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });
});

describe('SMS Response', function() {
  it('should ask unknown numbers to register', function(done) {
    request(app)
      .post('/sms')
      .send({
        Body: 'lorem ipsum',
        From: process.env.TEST_PHONENUMBER,
      })
      // .expect('set-cookie', 'temp=lorem ipsum; path=/; httponly')
      .end(function(err, res) {
        if (err) throw err;
        done()
      });
  });
});
