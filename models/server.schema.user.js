'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Organization User.
let userSchema = new Schema({
  _id: {type: String},
  name: { type: String},
  created: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true },
});

module.exports = userSchema;
