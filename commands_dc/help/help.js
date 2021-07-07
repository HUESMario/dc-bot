const help = (msg, discord) => {
    const embed = new discord.MessageEmbed()
    .setColor(msg.color)
    .setTitle(`roleing in the Game`)
    .setAuthor(msg.author.username)
    .addFields(
        {name: "> `Admin`", value: `Du kannst den Channel für das Rollenspiel mit: **${msg.prefix}setRPlayChannel <#Channel>**
        ${msg.seperator}
        Kick User mit **${msg.prefix}kick <@User> (reason)**`},
        {name: "> `Game`", value: `mit **${msg.prefix}deposit (value)** kannst du Geld einzahlen.`}
    )  
    .setFooter(msg.guild.name, msg.guild.iconURL())

    msg.channel.send(embed);
    return;
}

exports.module = {
    run: help
}