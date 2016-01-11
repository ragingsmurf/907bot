'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Weather Details
let wxSchema = new Schema({
  _id: {type: Number}, // ZipCode
  current: Schema.Types.Mixed, // Current Weather Details
  created: { type: Date, default: Date.now },
});

module.exports = wxSchema;
