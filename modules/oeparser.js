'use strict';

let jsonQuery = require('json-query');
let oe = require('./../data/oe');

module.exports = function() {
  let top = 'taxonomy.top_level';
  return {
    // Top level directory.
    directory: function() {
      return oeParser(top);
    },
    // Second and Third directory.
    find: function(second, third) {
      let query = top + `[@id=${second}].second_level`;
      if (third !== undefined) {
        query += `[@id=${third}].third_level`;
      }
      return oeParser(query);
    },
  };
  function oeParser(q) {
    let result = jsonQuery(q, { data: oe });
    let arrResult = new Array();
    if (!result.value) {
      return arrResult; // No child nodes, exit out
    }
    for (var i = 0; i < result.value.length; i++) {
      arrResult.push({
        id: result.value[i]['@id'],
        title: result.value[i]['@title'],
      });
    }
    return arrResult;
  }
}
