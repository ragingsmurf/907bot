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
    find: search,
  };
  function search(second, third) {
    let query = top + `[@id=${second}].second_level`;
    if (third !== undefined) {
      query += `[@id=${third}].third_level`;
    }
    return oeParser(query);
  };
  function oeParser(q) {
    let result = jsonQuery(q, { data: oe });
    let arrResult = new Array();
    if (!result.value) {
      return arrResult; // No child nodes, exit out
    }
    for (var i = 0; i < result.value.length; i++) {
      let item = {
        id: result.value[i]['@id'].replace(/-/g, ' '),
        title: result.value[i]['@title'],
        count: 0,
      };
      // Second level Child Nodes
      if (item.id.split(' ').length == 1) {
        let arr = item.id.split(' ');
        let rslt = search(arr[0], undefined);
        item.count = rslt.length;
      }
      // Third level Child Nodes
      if (item.id.split(' ').length == 2) {
        let arr = item.id.split(' ');
        let rslt = search(arr[0], `${arr[0]}-${arr[1]}`);
        item.count = rslt.length;
      }
      arrResult.push(item);
    }
    return arrResult;
  }
}
