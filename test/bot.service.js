'use strict';

// jscs:disable requireCapitalizedComments
// jscs:disable requireCurlyBraces

require('dotenv').config();

let assert = require('assert');
// let request = require('supertest');
let request = require('supertest-koa-agent');
let l = require('./../modules/logger.js')();
let app = require('./../lib/app').app;

describe('Web server', function() {

  it('should allow for GET on the dashboard', function(done) {
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

  it('should ask an unknown caller for their name', function(done) {
    request(app)
      .post('/sms')
      .send({
        Body: 'lorem ipsum',
        From: process.env.TEST_PHONENUMBER,
      })
      // Expect register user cookie
      .expect('set-cookie', 'state=1; path=/; httponly')
      .expect(function(res) {
        let q = `Can I get your name?`;
        assert.equal(res.text.toString().includes(q), true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

  it('should ask the caller if the spelling is correct', function(done) {
    let name = 'Jon Stewart';
    request(app)
      .post('/sms')
      // REGISTER_USER cookie value
      .set('Cookie', 'state=1')
      .send({
        Body: name,
        From: process.env.TEST_PHONENUMBER,
      })
      .expect(function(res) {
        let q = `Is ${name} the correct spelling of your name?`;
        assert.equal(res.text.toString().includes(q), true);
      })
      // Expect session bag
      .expect('set-cookie', 'temp=Jon Stewart; path=/; httponly')
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

});
