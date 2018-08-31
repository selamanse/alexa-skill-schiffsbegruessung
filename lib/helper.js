const axios = require('axios');
// const cheerio = require('cheerio');
// const moment = require('moment');
const SHIP_URL = 'https://www.hafen-hamburg.de'

function getJsonFromUrl (baseURL, callback) {
  console.log('requesting: ' + baseURL)
  
  let instance = axios.create({
      "baseURL": baseURL
  });
  
  instance.get()
    .then(({data}) => {
      callback(null, data);
    })
    .catch(callback);
}

function extractFirstVesselName (jsonString) {
  let json = JSON.parse(jsonString.replace('jsonCallbackVP(','').replace(');', ''))
  return json.features[0].properties.name
}

function getFirstPassengerShipName (queryTxt) {
  return new Promise(((resolve, reject) => {
    const reqUrl = `${SHIP_URL}/assets/files/vessels_passengers.js?callback=jsonCallbackVP&_=1493374422055`
    getJsonFromUrl(reqUrl, (e,d) => {
      if(e){
        reject(e)
      }
      resolve(extractFirstVesselName(d))
    })
  }))
}

module.exports = {
  getFirstPassengerShipName
};
