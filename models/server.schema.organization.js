'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// An organization providing social services.
let orgSchema = new Schema({
  title: {
    name: String,
    phonetic: Array,
  },
  type: { type: String },
  phoneNumber: String,
  twitterAccount: String,
  hours: {
    open: { type: Number },
    closed: { type: Number },
  },
  address: {
    streetOne: String,
    streetTwo: String,
    city: String,
    zipCode: String,
  },
  created: { type: Date, default: Date.now },
  hidden: { type: Boolean, default: false },
});

module.exports = orgSchema;
