const cFC = require('./checkForChannel.js');
const extractPos = require('./extractPosition.js');
const extractID = require('./extractID.js');
const splitIDs = require('./splitIDs.js');
const connectIDs = require('./connectIDs.js');

exports.module = {
    connectIDs: connectIDs.module.connectIDs,
    splitIDs: splitIDs.module.splitIDs,
    extractID: extractID.module.extractID,
    extractPos: extractPos.module.extract,
    checkForChannel: cFC.module.checkForChannel
}