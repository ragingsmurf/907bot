'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

(function() {

  let root = this;
  let previous_main = root.main;

  let has_require = typeof require !== 'undefined';
  let l = root.l;

  // Check for the logger library.
  if (typeof l === 'undefined') {
    if (has_require) {
      l = require('logger');
    };
  };

  // Isolation Function
  let main = function() {
    // module code.
    var socket = io();
    // Whenever the server emits 'new message'
    socket.on('sms', function(data) {
      console.log(JSON.stringify(data));
    });
  };

  // Check for module.exports, browser or node load?
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = main;
    };
    exports.main = main;
  } else {
    root.main = main;
  };

  // Return no conflict version.
  main.noConflict = function() {
    root.main = previous_main;
    return main;
  };

}).call(this);;
