'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// User to Organization association.
let assocSchema = new Schema({
  _id: {
    orgid: { type: Schema.Types.ObjectId },
    phone: { type: String },
  },
  service: { type: Array },
  created: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true },
});

module.exports = assocSchema;
