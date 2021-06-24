const setRPC = (msg, discord) => {
    if(msg.mentions.channels.first)
    {
        const mentionedChannel = msg.mentions.channels.first();
        msg.channelForRolePlay = mentionedChannel;
        const embed = new discord.MessageEmbed()
        .setColor(msg.color)
        .setTitle(`roleing in the Game`)
        .setAuthor(msg.author.username)
        .addFields({name: "> `Erfolg!`", value: `Toll, jetzt kannst du den ganzen Bot nutzen.^^ `})
        .setFooter(msg.guild.name, msg.guild.iconURL());

        msg.channel.send(embed);
    }
    return;
}
exports.module = {
    setRolePlayChannel: setRPC
}