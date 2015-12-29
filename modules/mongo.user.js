'use strict';

let mongoose = require('mongoose');
let ssUser = require('./../models/server.schema.user');
let User = mongoose.model('User', ssUser);

let FindUser = function*(phone) {
  return yield User.findOne({ phoneNumber: phone }, 'name').exec();


  // let soupKitchen = new Org({
  //   title: {
  //     name: 'Downtown Soup Kitchen',
  //     phonetic: [],
  //   },
  //   type: 'Non-Profit Organziation',
  //   phoneNumber: '(907) 277-4302',
  //   hours: {
  //     open: 11,
  //     closed: 19,
  //   },
  //   address: {
  //     streetOne: '240 E 3rd Ave',
  //     city: 'Anchorage',
  //     zipCode: '99501',
  //   },
  // });
  // // Save Document
  // soupKitchen.save(function(err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log('Org Saved!');
  //   }
  // });

}

let CreateUser = function*(name, phone) {
  return yield new User({
    name: name,
    phoneNumber: phone,
  }).save();
}

exports.find = FindUser;
exports.create = CreateUser;
