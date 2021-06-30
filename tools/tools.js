const cFC = require('./checkForChannel.js');
const extractPos = require('./extractPosition.js');
const connectIDs = require('./connectIDs.js');

exports.module = {
    extractPos: extractPos.module.extract,
    connectIDs: connectIDs.module.connect,
    checkForChannel: cFC.module.checkForChannel
}