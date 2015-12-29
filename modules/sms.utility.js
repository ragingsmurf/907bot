'use strict';

let accountSid = process.env.TWILIO_SID;
let authToken = process.env.TWILIO_SECRET;
let twilio = require('twilio');
let client = new twilio.RestClient(accountSid, authToken);

let response = undefined;
let twiwml = undefined;

exports.send = function(to, from, body) {
  client.sendMms({
    to: to,
    from: from,
    body: body,
  }, function(err, message) {
    console.log(err);
  });
}

exports.respond = function(req, res, body) {
  response = res;
  twiwml = new twilio.TwimlResponse();
  twiwml.message(body);
}

exports.process = function() {
  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(twiwml.toString());
}
