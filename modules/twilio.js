'use strict';

let accountSid = process.env.TWILIO_SID;
let authToken = process.env.TWILIO_SECRET;
let twilio = require('twilio');
let client = new twilio.RestClient(accountSid, authToken);

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
  let resp = new twilio.TwimlResponse();
  resp.message(body);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(resp.toString());
}
