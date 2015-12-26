'use strict';

let accountSid = process.env.TWILIO_SID;
let authToken = process.env.TWILIO_SECRET;
let twilio = require('twilio');
let client = new twilio.RestClient(accountSid, authToken);

exports.send = function() {
  // Require the Twilio module and create a REST client
  client.sendMms({
    to: process.env.TEST_PHONENUMBER,
    from: process.env.TWILIO_PHONENUMBER,
    body: 'Hey Buddy! Good luck!',
  }, function(err, message) {
    console.log(err);
  });
}

exports.respond = function(req, res, body) {
  let text = body.Body;
  let resp = new twilio.TwimlResponse();
  resp.message('You just sent in: ' + text);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(resp.toString());
}
