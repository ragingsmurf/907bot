
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

let ssOrg = require('./models/server.schema.organization');
/*
let Org = mongoose.model('Organization', ssOrg);
// Setup document
let soupKitchen = new Org({
  title: {
    name: 'Downtown Soup Kitchen',
    phonetic: [],
  },
  type: 'Non-Profit Organziation',
  phoneNumber: '(907) 277-4302',
  hours: {
    open: 11,
    closed: 19,
  },
  address: {
    streetOne: '240 E 3rd Ave',
    city: 'Anchorage',
    zipCode: '99501',
  },
});
// Save Document
soupKitchen.save(function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Org Saved!');
  }
});
*/
