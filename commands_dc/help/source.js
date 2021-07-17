
const source = (msg, discord) => {
    msg.embed = new discord.MessageEmbed()
    .setColor(msg.color)
    .setTitle(`roleing in the Game`)
    .setAuthor(msg.author.username)
    .addFields({name: "> `Source`", value: `Press the Button to go to my Github.^^`})  
    .setFooter(msg.guild.name, msg.guild.iconURL());

    msg.button
    .setStyle('url')
    .setURL('https://github.com/HUESMario/dc-bot')
    .setLabel('Link to my Source Code!')
    .setDisabled(false);

    msg.channel.send({embed: msg.embed, component: msg.button});
}
module.exports = {
    run: source
}