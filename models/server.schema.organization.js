'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Social Services Provider.
let orgSchema = new Schema({
  name: {type: String },
  zipcode: {type: String},
  created: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true },
});

module.exports = orgSchema;
