'use strict';

let associations = require('./mongo.association');
let l = require('./logger')();

exports.run = function() {

  l.c('Running job.notification!');

  // Emergency Shelter - subscriber notification.
  associations.subscribers('101 04').next().value.exec().then(function(data) {
    data.forEach(function(element, index) {
      l.c(element._id.phone);
    });
  });

}
