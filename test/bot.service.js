'use strict';

// jscs:disable requireCapitalizedComments
// jscs:disable requireCurlyBraces

require('dotenv').config();

let assert = require('assert');
let request = require('supertest-koa-agent');
let mongoose = require('mongoose');

let l = require('./../modules/logger.js')();
let app = require('./../lib/app').app;

// Model Schemas
let ssUser = require('./../models/server.schema.user');
let ssNotify = require('./../models/server.schema.notification');

// Models
let User = mongoose.model('User', ssUser);
let Notify = mongoose.model('Notification', ssNotify);

let user = {
  name: 'Jon Stewart',
  phone: process.env.TEST_PHONENUMBER,
};

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

describe('Register User', function() {

  before('Reset Data', function() {
    User.find({
      _id: process.env.TEST_PHONENUMBER,
    }).remove().exec();
  });

  it('should ask an unknown user for their name', function(done) {
    request(app)
      .post('/sms')
      .send({
        Body: 'lorem ipsum',
        From: user.phone,
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

  it('should ask the user if the spelling is correct', function(done) {
    request(app)
      .post('/sms')
      .set('Cookie', 'state=1') // REGISTER_USER
      .send({
        Body: user.name,
        From: user.phone,
      })
      .expect(function(res) {
        let q = `Is ${user.name} the correct spelling of your name?`;
        assert.equal(res.text.toString().includes(q), true);
      })
      .expect('set-cookie', `temp=${user.name}; path=/; httponly`)
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

  it('should ask the user for first and last name', function(done) {
    request(app)
      .post('/sms')
      .set('Cookie', 'state=1') // REGISTER_USER
      .send({
        Body: 'lorem',
        From: user.phone,
      })
      .expect(function(res) {
        let q = `your first and last name`;
        assert.equal(res.text.toString().includes(q), true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

  it('should decline if the spelling is not confirmed', function(done) {
    request(app)
      .post('/sms')
      .set('Cookie', [`state=1;temp=${user.name}`]) // REGISTER_USER & temp bag
      .send({
        Body: 'No',
        From: user.phone,
      })
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        let q = `Can I get the correct spelling`;
        assert.equal(res.text.toString().includes(q), true);
        done();
      });
  });

  it('should add a user if spelling of name is confirmed', function(done) {
    request(app)
      .post('/sms')
      .set('Cookie', [`state=1;temp=${user.name}`]) // REGISTER_USER & temp bag
      .send({
        Body: 'Yes',
        From: user.phone,
      })
      .expect(200)
      .expect(function(res) {
        let q = `${user.name}, you are now a registered user!`;
        assert.equal(res.text.toString().includes(q), true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

});

describe('Help System', function() {

  it('should return a list of bot instructions', function(done) {
    request(app)
      .post('/sms')
      .send({
        Body: 'Help',
        From: user.phone,
      })
      .expect(200)
      .expect(function(res) {
        let q = `Commands`;
        assert.equal(res.text.toString().includes(q), true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

});
