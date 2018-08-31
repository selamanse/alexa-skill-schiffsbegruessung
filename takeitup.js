'use strict'
const helper = require('./lib/helper.js')
const util = require('util')

// try {
//   helper.getFirstPassengerShipName().then((res) => { console.log(util.inspect(res, false, null)) })
// } catch (error) {
//   console.log(error)
// }

try {
  helper.getPassengerShipByName('LADY VON buesum').then((res) => { console.log(util.inspect(res, false, null)) })
} catch (error) {
  console.log(error)
}
