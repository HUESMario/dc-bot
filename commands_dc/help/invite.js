const invite = (msg, discord) => {
    const embed = new discord.MessageEmbed()
    .setColor(msg.color)
    .setTitle(`roleing in the Game`)
    .setAuthor(msg.author.username)
    .addFields(
        {name: "> `Support`", value: `Support me by inviting this Bot to your Server.`,
    name: `Thank you`, value: `If you want to invite me do it with this Button:`}
    )  
    .setFooter(msg.guild.name, msg.guild.iconURL());

    
    const button = new discord.MessageButton()
    .setStyle('LINK')
    .setLabel('Invite me.')
    .setURL('https://discord.com/api/oauth2/authorize?client_id=842053072666099733&permissions=11264&redirect_uri=https%3A%2F%2Fdiscord.events.stdlib.com%2Fdiscord%2Fauth%2F&scope=bot');

    const row = new discord.MessageActionRow().addComponents(button);

    msg.channel.send({embeds: [embed], components: [row]});
    return;
}

module.exports = {
    run: invite
}