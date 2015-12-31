'use strict';
// jscs:disable maximumLineLength

let csv = require('csv');
let weather = require('weather-js');
let Knwl = require('knwl.js');
let l = require('./logger')();

module.exports = function() {
  let current = 0;
  let commands = [];
  return {
    csv: function(path) {
      l.c(`Parsing CSV (${path})`);
      let p = new Promise(function(resolve, reject) {
        require('fs').readFile(path, function(err, data) {
          if (err) {
            reject(err);
          };
          csv.parse(data, {}, function(err, output) {
            if (err) {
              reject(err);
            };
            resolve(output);
          });
        });
      });
      return p;
    },
    weather: function(location) {
      l.c(`Fetching weather (${location})`);
      let p = new Promise(function(resolve, reject) {
        weather.find({search: location, degreeType: 'F'},
          function(err, result) {
            if (err) {
              reject(err);
            };
            resolve(result);
          });
      });
      return p;
    },
    knwl: function(txt) {
      l.c(`Parsing with Knwl (${txt})`);
      let p = new Promise(function(resolve, reject) {
        let kw = new Knwl('english');
        kw.register('times', require('./../node_modules/knwl.js/default_plugins/times'));
        kw.init(txt);
        resolve(kw.get('times')[0]);
      });
      return p;
    },
  }
}
