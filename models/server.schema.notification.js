'use strict';
// jscs:disable requireCapitalizedComments

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Resource notification question.
let notifySchema = new Schema({
  orgid: Schema.Types.ObjectId,
  phone: String,
  service: String, // 101 04
  command: Array, // ['bed', 'count']
  temperature: Number, // Temperature in Fahrenheit
  parameter: Schema.Types.Mixed, // User's response
  created: { type: Date, default: Date.now },
});

module.exports = notifySchema;
