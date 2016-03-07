'use strict';

let accountSid = process.env.TWILIO_SID || 'nonworking_sid';
let authToken = process.env.TWILIO_SECRET || 'nonworking_key';
let twilio = require('twilio');
let client = new twilio.RestClient(accountSid, authToken);
let l = require('./logger')();
let response = undefined;
let twiwml = undefined;
let responded = false;

exports.send = function(to, from, body) {
  l.c(`Sending Twilio request`);
  client.sendMms({
    to: to,
    from: from,
    body: body,
  }, function(err, confirmation) {
    l.c(`Twilio Send Error: ${JSON.stringify(err)}`);
  });
}

exports.respond = function(ckz, req, res, body) {
  l.c(`Pushing Twilio response XML.`);
  response = res;
  twiwml = new twilio.TwimlResponse();
  let state = ckz.get('state');
  if (!state == undefined) {
    body += `\r[state:${state}]`;
  }
  twiwml.message(body);
  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(twiwml.toString());
  responded = true;
}

exports.responded = function() { return responded; };
