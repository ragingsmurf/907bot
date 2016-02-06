'use strict';
// jscs:disable maximumLineLength

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let findOrCreate = require('mongoose-findorcreate');
let l = require('./logger')();
let ssWx = require('./../models/server.schema.weather')
  .plugin(findOrCreate);
let Wx = mongoose.model('Weather', ssWx);

let CreateOrFindWeather = function(zipcode, forecast) {
  l.c('yielding mongo.weather.CreateOrFindWeather');
  let p = new Promise(function(resolve, reject) {
    // Clear out old results.
    Wx.find({
      created: {
        $lt: new Date(new Date().getTime() - 1000 * 60 * 20),
      },
    }).remove().exec();
    // Save forecast.
    Wx.findOrCreate({
      _id: zipcode,
    }, function(err, wx, created) {
      if (err) {
        reject(err);
      };
      wx.current = forecast;
      wx.markModified('current');
      wx.save();
      resolve(wx);
    });
  });
  return p;
};

let GetCurrentWeather = function*(zipcode) {
  l.c('yielding mongo.weather.GetCurrentWeather');
  return yield Wx.find({
    _id: zipcode,
    created: {
      $gt: new Date(new Date().getTime() - 1000 * 60 * 20),
    },
  }, 'current');
};

exports.update = CreateOrFindWeather;
exports.get = GetCurrentWeather;
