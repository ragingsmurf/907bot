'use strict';
// jscs:disable requireCapitalizedComments
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers

let jsonQuery = require('json-query');
let oe = require('./../data/oe');

module.exports = function() {
  let top = 'taxonomy.top_level';
  return {
    // Default - Root Level
    directory: function() {
      return oeParser(top);
    },
    find: find,
    select: select,
  };

  /*
  Find sub-elements of a service node.
  */
  function find(second, third) {
    let query = top + `[@id=${second}].second_level`;
    if (third !== undefined) {
      query += `[@id=${third}].third_level`;
    }
    return oeParser(query);
  };

  /*
  Select individual service node (id, name, child-count).
  */
  function select(second, third, fourth) {
    let query = top + `[@id=${second}].second_level`;
    if (third !== undefined) {
      query += `[@id=${third}]`;
    }
    if (fourth !== undefined) {
      query += `.third_level[@id=${fourth}]`;
    }
    let result = jsonQuery(query, { data: oe });
    let node = {
      id: result.value['@id'].replace(/-/, ' '),
      title: result.value['@title'],
      count: 0,
    };
    if (third && !fourth) {
      try {
        node.count = result.value.third_level.length;
      } catch (ex) { }
    }
    return node;
  };

  /*
  Loop and Parse address for child nodes.
  */
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
        let rslt = find(arr[0], undefined);
        item.count = rslt.length;
      }
      // Third level Child Nodes
      if (item.id.split(' ').length == 2) {
        let arr = item.id.split(' ');
        let rslt = find(arr[0], `${arr[0]}-${arr[1]}`);
        item.count = rslt.length;
      }
      arrResult.push(item);
    }
    return arrResult;
  }
}
