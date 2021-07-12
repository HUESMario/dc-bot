const help = (msg, discord) => {
    const embed = new discord.MessageEmbed()
    .setColor(msg.color)
    .setTitle(`roleing in the Game`)
    .setAuthor(msg.author.username)
    .addFields(
        {name: "> `Admin`", value: `You can select the Global Chat Channel with **rg!setGlobal <#channel>**.`},
        {name: "> `Game`", value: `You can Play Tic Tac Toe with someone else: **rg!TTT <@opponent>**.`},
        {name: '> `rg Global`', value: `You can get something to do by typing in the rg Chat Channel: **rg!imBored**`}
    )  
    .setFooter(msg.guild.name, msg.guild.iconURL())

    msg.channel.send(embed);
    return;
}

exports.module = {
    run: help
}