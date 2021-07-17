const setGlobal = require('./setGlobal.js');
const delGlobal = require('./delGlobal.js');
const sendGif = require('./sendGif.js');
const imBored = require('./imBored.js');

const global = async (discord, msg, bot, gifList, data) => {
    if(msg.author.bot && msg.author.id !== '842053072666099733')
    {
        msg.delete();
        return;
    }
    const setGlobal = data[msg.guild.id + msg.channel.id].globalChannel
    if(msg.channel.id === setGlobal.id && !msg.author.bot)
    {
        const oldMsg = msg;
        msg.delete();
        const registeredGuilds = Object.keys(data);
        for (let i = 0; i < registeredGuilds.length; ++i) {
            const globalEmbed = new discord.MessageEmbed()
            .setThumbnail(bot.user.avatarURL())
            .setAuthor(oldMsg.author.username, oldMsg.author.avatarURL())
            .setColor(oldMsg.color)
            .setFooter(oldMsg.guild.name, oldMsg.guild.iconURL());
            if(oldMsg.reference)
            {
            const referenceMSG = await msg.channel.messages.fetch(msg.reference.messageID);
                if(referenceMSG.embeds.length === 0)
                {
                    globalEmbed.addFields({
                        name: `antwortet auf: ${referenceMSG.author.username}`, 
                        value: `${referenceMSG.content}`,
                        image: {
                            url: referenceMSG.author.icon_url
                        }
                    })
                }
                else if(referenceMSG.embeds.length === 1)
                {
                    globalEmbed.addFields({
                        name: `antwortet auf: ${referenceMSG.embeds[0].author.name}`, 
                        value: `> ${referenceMSG.embeds[0].fields[referenceMSG.embeds[0].fields.length - 1].value}`,
                        image: {
                            url: referenceMSG.embeds[0].author.icon_url
                        }
                        })
                }
            }
                if(oldMsg.embeds.length > 0)
                {
                    sendGif.sendGif(msg, gifList, bot)
                    return;
                }
                else if(oldMsg.attachments.toJSON().length > 0)
                {
                    oldMsg.attachments.forEach((e)=> {
                        
                        globalEmbed.setImage(e.url.toString())
                    })
                    globalEmbed.addField(`${oldMsg.author.username}`, `sent ${oldMsg.attachments.toJSON().length} image${oldMsg.attachments.toJSON().length === 1 ? "" : "s"}.`)
                }
                if(oldMsg.content === 'rg!imBored')
            {   
                const text = imBored.imBored();
                text.then(value => {
                    globalEmbed.setAuthor(bot.user.username, bot.user.avatarURL())
                    globalEmbed.addField('Bored? Not anymore!', `activity: ${value.activity} \n link: ${value.link} \n Your need of Friends: ${value.participants > 0 ? value.participants - 1 : 0} \n Type of activity: ${value.type}`);
                    bot.channels.cache.get(data[registeredGuilds[i]].globalChannel.id).send(globalEmbed);
                }).catch(err=>{console.log(err)});
                
            }
                if(oldMsg.content !== '' && oldMsg.content !== 'rg!imBored')
                {
                    globalEmbed.addFields({name: 'rg Global', value: `${oldMsg.content}`})
                }
                if(msg.content !== "rg!imBored")
                {
                    await bot.channels.cache.get(data[registeredGuilds[i]].globalChannel.id).send(globalEmbed);
                }
            }
        }
}
module.exports = {
    setGlobal: setGlobal.setGlobal,
    delGlobal: delGlobal.delGlobal,
    global: global
}