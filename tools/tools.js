const cFC = require('./checkForChannel.js');
const extractPos = require('./extractPosition.js');

exports.module = {
    extractPos: extractPos.module.extract,
    checkForChannel: cFC.module.checkForChannel
}