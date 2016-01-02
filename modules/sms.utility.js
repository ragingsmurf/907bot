'use strict';

let accountSid = process.env.TWILIO_SID;
let authToken = process.env.TWILIO_SECRET;
let twilio = require('twilio');
let client = new twilio.RestClient(accountSid, authToken);
let l = require('./logger')();
let response = undefined;
let twiwml = undefined;

exports.send = function(to, from, body) {
  l.c(`Pushing SMS message.`);
  client.sendMms({
    to: to,
    from: from,
    body: body,
  }, function(err, confirmation) {
    l.c(`send error:${JSON.stringify(err)}`);
  });
}

exports.respond = function(ckz, req, res, body) {
  l.c(`Pushing SMS response.`);
  response = res;
  twiwml = new twilio.TwimlResponse();
  let state = ckz.get('state');
  if (!state == undefined) {
    body += `\r[state:${state}]`;
  }
  twiwml.message(body);
  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(twiwml.toString());
}
