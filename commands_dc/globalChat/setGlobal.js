    setGlobal = (bot, discord, msg) => {
    let data = fs.readFileSync('./serversForGlobalChat.json',{encoding: 'utf-8'});
    const oldChannels = JSON.parse(data);
    data = JSON.parse(data);
    const channel = msg.mentions.channels.first();
    setGlobal = channel;
    oldChannels[msg.guild.id] = {}
    oldChannels[msg.guild.id].globalChannel = setGlobal;
    fs.writeFileSync('./serversForGlobalChat.json', `${JSON.stringify(oldChannels)}`, (err) => {
        if(err) console.log(err);
    })
    data = JSON.parse(fs.readFileSync('./serversForGlobalChat.json',{encoding: 'utf-8'}));
    const globalEmbed = new discord.MessageEmbed()
            .setThumbnail(bot.user.avatarURL)
            .setAuthor(msg.author.username, msg.author.avatarURL())
            .setColor([195, 96, 187])
            .setFooter(msg.guild.name, msg.guild.iconURL())
            .addField(`> newComer ${msg.guild.name}`, `${msg.guild.name} just joined RG Global`);
            const registeredGuilds = Object.keys(data);

            for(let i = 0; i < registeredGuilds.length; ++i)
            {
                bot.channels.cache.get(data[registeredGuilds[i]].globalChannel.id).send(globalEmbed);
            }
}

module.exports = ()=>{
    setGlobal: setGlobal
}