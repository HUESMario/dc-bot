/**
 * Checks if the two Parameters have the Same Channel.id Numbers
 * @param {discord.Message} msg 
 * @param {discord.Channel} channel 
 * @returns boolean
 */
const checkForChannel = (msg, channel) => msg.channel.id === channel.id

exports.module = {
    checkForChannel: checkForChannel
}