const deposit = (msg, discord) => {
    const amount = Number.parseInt(msg.content.split(' ')[1]);
    if(msg.channelForRolePlay !== undefined)
    {
        if(msg.tool.checkForChannel(msg, msg.channelForRolePlay))
        {
            if(isNaN(Number.parseInt(amount)))
            {
                const embed = new discord.MessageEmbed()
                .setColor(msg.color)
                .setTitle(`roleing in the Game`)
                .setAuthor(msg.author.username)
                .addFields({name: "> `Error!`", value: `Ähh, vielleicht mal eine Zahl eingeben? \n Hast du überhaupt was eingegeben? `})
                .setFooter(msg.guild.name, msg.guild.iconURL());
        
                msg.channel.send(embed);
                return;
            }
            else if(!isNaN(Number.parseInt(amount)))
            {
                msg.bankbalance += amount;
                const embed = new discord.MessageEmbed()
                .setColor(msg.color)
                .setTitle(`roleing in the Game`)
                .setAuthor(msg.author.username)
                .addFields({name: "> `Deposit`", value: `Du hast ${amount} zu deinem Konto hinzugefügt. Jetzt hast du: ${Number.parseInt(msg.amountForNow + amount)}`})
                .setFooter(msg.guild.name, msg.guild.iconURL());
                msg.channel.send(embed);
                return;
            }
        }
        else if(!msg.tool.checkForChannel(msg, msg.channelForRolePlay))
        {
            const embed = new discord.MessageEmbed()
            .setColor(msg.color)
            .setTitle(`roleing in the Game`)
            .setAuthor(msg.author.username)
            .addFields({name: "Channel", value: `Befehl im falschen Channel. ^^
            Versuche es im Channel: ${msg.channelForRolePlay.name}`})  
            .setFooter(msg.guild.name)

            msg.channel.send(embed);
            return;
        }
    }
    else if(msg.channelForRolePlay === undefined)
    {
        const embed = new discord.MessageEmbed()
        .setColor(msg.color)
        .setTitle(`roleing in the Game`)
        .setAuthor(msg.author.username)
        .addFields({name: "RoleplayChannel", value: "Spezifischer Channel für Rollenspiel erforderlich. ^^"})  
        .setFooter(msg.guild.name)

        console.log(msg.channelForRolePlay);

        msg.channel.send(embed);
        return;
    }
}
exports.module = {
    deposit: deposit
}