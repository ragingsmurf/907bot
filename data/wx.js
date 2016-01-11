// 3. Use the zipcode to fetch the current temperature.
let forecast = yield data.weather(zipcode);
let temp = forecast[0].current.feelslike;

// Message data sets.
//  let forecast = yield data.weather('99501');
//  yield wx.update('99501', forecast);

let weather = yield wx.get('99501');
l.c(weather[0].current[0].current);
