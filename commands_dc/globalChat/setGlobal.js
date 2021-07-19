const fs = require('fs');
const setGlobal = (bot, discord, msg) => {
    if(msg.member.hasPermission('MANAGE_CHANNELS') || msg.member.hasPermission('ADMINISTRATION'))
    {
        let data = fs.readFileSync('./serversForGlobalChat.json',{encoding: 'utf-8'});
        const oldChannels = JSON.parse(data);
        data = JSON.parse(data);
        const channel = msg.mentions.channels.first();
        oldChannels[msg.guild.id + msg.channel.id] = {}
        oldChannels[msg.guild.id + msg.channel.id].globalChannel = channel;
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
    else
    {
        const errorEmbed = discord.MessageEmbed()
        .setThumbnail(bot.user.avatarURL())
        .setAuthor(msg.author.username, msg.author.avatarURL())
        .setColor(msg.color)
        .setFooter(msg.guild.name, msg.guild.iconURL())
        .addField('> `Error`', 'You dont have manage Channel or Admin Permissions');


        msg.channel.send(errorEmbed);
        return;
    }
}

module.exports = {
    setGlobal: setGlobal
}