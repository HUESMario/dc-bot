const cFC = require('./checkForChannel.js');
const extractPos = require('./extractPosition.js');

exports.module = {
    extractPos: extractPos.extract,
    checkForChannel: cFC.module.checkForChannel
}