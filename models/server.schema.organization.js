'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Organizations providing social services.
let orgSchema = new Schema({
  name: {type: String },
  created: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true },
});

module.exports = orgSchema;
