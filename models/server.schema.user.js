'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Stakeholder User.
let userSchema = new Schema({
  _id: {type: String},
  name: { type: String},
  notifications: {
    startTime: { type: String },
    endTime: { type: String },
  },
  created: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true },
});

module.exports = userSchema;
