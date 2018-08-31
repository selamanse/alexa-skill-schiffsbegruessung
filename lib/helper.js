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

function extractNames (jsonString) {
  let json = JSON.parse(jsonString.replace('jsonCallbackVP(','').replace(');', ''))
  let namesList = []
  json.features.forEach(element => {
    
    namesList.push({"name": {"value": element.properties.name}})
  });
  return {"values": namesList}
}

function findVesselByName (jsonString, vesselName) {
  let json = JSON.parse(jsonString.replace('jsonCallbackVP(','').replace(');', ''))
  for(var i=0; i<json.features.length; i++){
    if(json.features[i].properties.name.toLowerCase() === vesselName.toLowerCase()){
      return json.features[i]
    }
  }
}

function getFirstPassengerShipName () {
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

function getPassengerShipNames () {
  return new Promise(((resolve, reject) => {
    const reqUrl = `${SHIP_URL}/assets/files/vessels_passengers.js?callback=jsonCallbackVP&_=1493374422055`
    getJsonFromUrl(reqUrl, (e,d) => {
      if(e){
        reject(e)
      }
      resolve(extractNames(d))
    })
  }))
}

function getPassengerShipNames () {
  return new Promise(((resolve, reject) => {
    const reqUrl = `${SHIP_URL}/assets/files/vessels_passengers.js?callback=jsonCallbackVP&_=1493374422055`
    getJsonFromUrl(reqUrl, (e,d) => {
      if(e){
        reject(e)
      }
      resolve(extractNames(d))
    })
  }))
}

function getPassengerShipByName (vesselName) {
  return new Promise(((resolve, reject) => {
    const reqUrl = `${SHIP_URL}/assets/files/vessels_passengers.js?callback=jsonCallbackVP&_=1493374422055`
    getJsonFromUrl(reqUrl, (e,d) => {
      if(e){
        reject(e)
      }
      resolve(findVesselByName(d, vesselName))
    })
  }))
}

module.exports = {
  getFirstPassengerShipName,
  getPassengerShipNames,
  getPassengerShipByName
};
