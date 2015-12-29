'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Stakeholder User.
let userSchema = new Schema({
  name: { type: String},
  phoneNumber: String,
  hours: {
    start: { type: Number },
    end: { type: Number },
  },
  created: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
});

module.exports = userSchema;
