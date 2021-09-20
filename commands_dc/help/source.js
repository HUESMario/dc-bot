const discord = require('discord.js');

/**
 * Sends Embed to Redirect to me, for Source Code.
 * @param {discord.Message} msg get Channel to Send to. 
 */
const source = (msg) => {
    msg.embed = new discord.MessageEmbed()
    .setColor(msg.color)
    .setTitle(`roleing in the Game`)
    .setAuthor(msg.author.username)
    .addFields({name: "> `Source`", value: `DM the Bot Owner :) (happlemnm@gmail.com)`})  
    .setFooter(msg.guild.name, msg.guild.iconURL());

    msg.channel.send({embeds: msg.embed});
}
module.exports = {
    run: source
}