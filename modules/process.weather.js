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

let CreateOrFindWeather = function*(zipcode, forecast) {
  l.c('yielding process.weather.CreateOrFindWeather');
  return yield monWx.update(zipcode, forecast);
};

exports.get = GetCurrentWeather;
exports.update = CreateOrFindWeather;
