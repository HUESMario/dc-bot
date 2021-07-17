const delGlobal = (msg, discord, bot) => {
    let data = fs.readFileSync('./serversForGlobalChat.json',{encoding: 'utf-8'});
    const oldChannels = JSON.parse(data);
    data = JSON.parse(data);
    const channel = msg.mentions.channels.first();
    setGlobal = channel;
    delete oldChannels[msg.guild.id];
    fs.writeFileSync('./serversForGlobalChat.json', `${JSON.stringify(oldChannels)}`, (err) => {
        if(err) console.log(err);
    })
    const globalEmbed = new discord.MessageEmbed()
            .setThumbnail(bot.user.avatarURL)
            .setAuthor(msg.author.username, msg.author.avatarURL())
            .setColor([195, 96, 56])
            .setFooter(msg.guild.name, msg.guild.iconURL())
            .addField(`> ${msg.guild.name} left Chat`, `${msg.guild.name} just left RG Global`);
            const registeredGuilds = Object.keys(data);

            for(let i = 0; i < registeredGuilds.length; ++i)
            {
                bot.channels.cache.get(data[registeredGuilds[i]].globalChannel.id).send(globalEmbed);
            }
}

module.exports = {
    delGlobal: delGlobal
}