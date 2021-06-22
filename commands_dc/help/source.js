
const source = (msg, discord) => {
    msg.embed = new discord.MessageEmbed()
    .setColor(msg.color)
    .setTitle(`roleing in the Game`)
    .setAuthor(msg.author.username)
    .addFields({name: "> `Source`", value: `Drück auf den Knopf um auf mein Github zu kommen.^^`})  
    .setFooter(msg.guild.name, msg.guild.iconURL());

    msg.button
    .setStyle('url')
    .setURL('https://github.com/HUESMario/dc-bot')
    .setLabel('Link to my Source Code!')
    .setDisabled(false);
    console.log(msg.button);
    console.log(msg.embed);

    msg.channel.send({embed: msg.embed, component: msg.button});
}
exports.module = {
    run: source
}