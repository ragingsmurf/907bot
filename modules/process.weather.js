'use strict';
// jscs:disable requireCapitalizedComments

require('linq-es6');
let monWx = require('./mongo.weather');
let data = require('./data.sources')();
let l = require('./logger')();

let GetCurrentWeather = function*(zipcode) {
  l.c('yielding process.weather.GetCurrentWeather');
  return yield monWx.get(zipcode);
};

let CreateOrFindWeather = function*(data) {
  l.c(data.length);
  for (var i = 0; i < data.length; i++) {
    l.c(data[i].zipcode);
    let forecast = yield data.weather('99501');
    l.c(forecast);
  }
  return data;
};

exports.get = GetCurrentWeather;
exports.update = CreateOrFindWeather;
