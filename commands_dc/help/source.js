
const source = (msg, discord) => {
    msg.embed = new discord.MessageEmbed()
    .setColor(msg.color)
    .setTitle(`roleing in the Game`)
    .setAuthor(msg.author.username)
    .addFields({name: "> `Source`", value: `DM the Bot Owner :)`})  
    .setFooter(msg.guild.name, msg.guild.iconURL());

    msg.channel.send({embeds: msg.embed});
}
module.exports = {
    run: source
}