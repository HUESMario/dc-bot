const discord = require('discord.js');

/**
 * @param {discord.Message} message 
 * @returns {string} ID of Player 1 and Player 2. 
 */
const extractID = (message) => {
    return message.value;
}
exports.module = {
    extractID: extractID
}