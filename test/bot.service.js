'use strict';

// jscs:disable requireCapitalizedComments
// jscs:disable requireCurlyBraces
// jscs:disable maximumLineLength

require('dotenv').config();

let assert = require('assert');
let request = require('supertest-koa-agent');
let mongoose = require('mongoose');

let l = require('./../modules/logger.js')();
let app = require('./../lib/app').app;

// Model Schemas
let ssAssoc = require('./../models/server.schema.association');
let ssOrg = require('./../models/server.schema.organization');
let ssUser = require('./../models/server.schema.user');
let ssNotify = require('./../models/server.schema.notification');

// Models
let Assoc = mongoose.model('Association', ssAssoc);
let User = mongoose.model('User', ssUser);
let Notify = mongoose.model('Notification', ssNotify);
let Org = mongoose.model('Organization', ssOrg);

let user = {
  name: 'Jon Stewart',
  phone: process.env.TEST_PHONENUMBER,
  organization: 'Beans Cafe',
};

describe('Web server', function() {
  it('should allow GET on the dashboard', function(done) {
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
    Assoc.find({
      '_id.phone': {
        $eq: process.env.TEST_PHONENUMBER,
      },
    }).remove().exec();
    Notify.find({
      phone: {
        $eq: process.env.TEST_PHONENUMBER,
      },
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
        assert.equal(res.text.toString().includes(`spelling`), true);
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
        let q = `${user.name}, you are registered!`;
        assert.equal(res.text.toString().includes(q), true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

  it('should ask for an organization during initial subscribe', function(done) {

    request(app)
      .post('/sms')
      .send({
        Body: 'Subscribe to bed count',
        From: user.phone,
      })
      .expect(200)
      .expect('set-cookie', 'state=2; path=/; httponly,temp=101-04; path=/; httponly')
      .expect(function(res) {
        assert.equal(res.text.toString().includes('organization'), true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });

  });

  it('should not associate user when organization not present', function(done) {
    request(app)
      .post('/sms')
      .set('Cookie', [`state=2;temp=101-04`])
      .send({
        Body: 'Lorem Ipsum',
        From: user.phone,
      })
      .expect(200)
      .expect(function(res) {
        assert.equal(res.text.toString().includes('no organization listed'), true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

  it('should associate user and organization when present', function(done) {
    request(app)
      .post('/sms')
      .set('Cookie', [`state=2;temp=101-04`])
      .send({
        Body: 'Beans Cafe',
        From: user.phone,
      })
      .expect(200)
      .expect(function(res) {
        assert.equal(res.text.toString().includes('bed count'), true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });


  it('should update bed count for the user\'s organization', function(done) {
    request(app)
      .post('/sms')
      .send({
        Body: 'Bed Count 36',
        From: user.phone,
      })
      .expect(200)
      .expect(function(res) {
        assert.equal(
          res.text.toString()
          .includes('updated ' + user.organization + ' with a bed count'),
          true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

  it('should update overflow count for the user\'s organization', function(done) {
    request(app)
      .post('/sms')
      .send({
        Body: 'Overflow Count 10',
        From: user.phone,
      })
      .expect(200)
      .expect(function(res) {
        assert.equal(
          res.text.toString()
          .includes('updated ' + user.organization + ' with a overflow'),
          true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

  it('should return user\'s profile', function(done) {
    request(app)
      .post('/sms')
      .send({
        Body: 'profile',
        From: user.phone,
      })
      .expect(200)
      .expect(function(res) {
        assert.equal(
          res.text.toString()
          .includes('Bed Count Resource'),
          true);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });

});

describe('Help Menu', function() {

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
