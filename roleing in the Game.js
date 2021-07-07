`strict mode`

const discord = require('discord.js');
const bot = new discord.Client();
const disbut = require('discord-buttons');
disbut(bot);
const commands = require('./commands_dc/commands.js');
const tools = require('./tools/tools.js');
const fs = require('fs');
const token = require('./token.js');
const UrlofImages = require('get-image-urls');
const queryString = require('querystring');
let prefix = 'rg!';
let channelForRolePlay;
let setGlobal;

/*bot.on('clickButton', async (button) => {
    button.button = disbut;
    commands.module.Game.TTT.handleClick(button);
    await button.defer();
})
*/

bot.on('ready', () => {
    console.log(`I'm driving and I'm speeding.`);
})

bot.on('message',async msg => {
    msg.color = '#13ab13';
    msg.seperator = `//\\\\\\ \n \\\\\\\\//`;
    msg.prefix = prefix;
    /*msg.Player1 = msg.member;
    msg.Player2;
    */

    const data = JSON.parse(fs.readFileSync('./serversForGlobalChat.json', {encoding: 'utf-8'}));
    if(data[msg.channel.guild.id])
    {
        if(msg.author.bot && msg.author.id !== '842053072666099733')
        {
            msg.delete();
            return;
        }
    setGlobal = data[msg.channel.guild.id].globalChannel
        if(msg.channel.id === setGlobal.id && !msg.author.bot)
        {
                const oldMsg = msg;
                msg.delete();
                const registeredGuilds = Object.keys(data);
                for (let i = 0; i < registeredGuilds.length; ++i) {
                    const globalEmbed = new discord.MessageEmbed()
                    .setThumbnail(bot.user.avatarURL)
                    .setAuthor(oldMsg.author.username, oldMsg.author.avatarURL())
                    .setColor([180, 160, 50])
                    .setFooter(oldMsg.guild.name, oldMsg.guild.iconURL());
                    if(!oldMsg.referenceIsNull(oldMsg.referenced_message)){
                        if(oldMsg.referenced_message.embeds.length === 0)
                        {
                            globalEmbed.addFields({
                                name: `antwortet auf: ${oldMsg.referenced_message.author.username}`, 
                                value: `${oldMsg.referenced_message.content}`,
                                image: {
                                    url: oldMsg.referenced_message.author.icon_url
                                }
                                })
                                
                            }
                        else if(msg.referenced_message.embeds.length === 1)
                        {
                            globalEmbed.addFields({
                                name: `antwortet auf: ${oldMsg.referenced_message.embeds[0].author.name}`, 
                                value: `> ${oldMsg.referenced_message.embeds[0].fields[oldMsg.referenced_message.embeds[0].fields.length - 1].value}`,
                                image: {
                                    url: oldMsg.referenced_message.embeds[0].author.icon_url
                                }
                                })
                        }
                    }
                        if(oldMsg.embeds.length > 0)
                        {
                            const getURLs = async url => {
                                return await UrlofImages(url);
                            }
                            const URLs = await getURLs(oldMsg.embeds[0].url);
                            const getIndex = () => {
                                for(let j = 0; j < URLs.length; ++j)
                                {
                                    if(queryString.parse(URLs[j].url)[URLs[j].url] === undefined) {
                                        return j;
                                    } 
                                }
                            }
                            globalEmbed.addField(`> ${oldMsg.author.username}`, `sent gif:`)
                            globalEmbed.setImage(await URLs[getIndex()].url)
                        }
                        else if(oldMsg.attachments.toJSON().length > 0)
                        {
                            oldMsg.attachments.forEach((e)=> {
                                globalEmbed.setImage(e.url.toString())
                            })
                        }
                        if(oldMsg.content !== '')
                        {
                            globalEmbed.addFields({name: 'rg Global', value: `${oldMsg.content}`})
                        }
                        bot.channels.cache.get(data[registeredGuilds[i]].globalChannel.id).send(globalEmbed);
                    }
                    return;
            }
    }
    /*if(msg.mentions.users.first())
    {
        msg.Player2 = msg.mentions.members.first()
    }
    */
    //Help
    if(msg.content == `${prefix}help`)
    {
        commands.module.help.help(msg, discord);
    }
    else if(msg.content === `${prefix}source`)
    {
        msg.button;
        msg.button = new disbut.MessageButton();
        commands.module.help.source(msg, discord);
    }

    //test
    //Admin
    
    else if(msg.content.startsWith(`${prefix}setRPlayChannel`))
    {
        const Channel = msg.mentions.channels.first()
        if(Channel !== undefined)
        {
            commands.module.Admin.setRolePlayChannel(msg, discord)
            channelForRolePlay = msg.channelForRolePlay
        }
        else if(Channel === undefined)
        {
            const embed = new discord.MessageEmbed()
            .setColor(msg.color)
            .setTitle(`roleing in the Game`)
            .setAuthor(msg.author.username)
            .addFields({name: "> `Error!`", value: `Du hast keinen Channel Erwähnt.`})
            .setFooter(msg.guild.name, msg.guild.iconURL());
            msg.channel.send(embed);
        }
        return;
    }
    else if(msg.content.startsWith(`${prefix}setGlobal`))
    {
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
    else if(msg.content === `${prefix}delGlobal`)
    {   
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
    //Games

    else if(msg.content.startsWith(`${prefix}deposit`))
    {
        msg.channelForRolePlay = channelForRolePlay;
        msg.tool = {checkForChannel: tools.module.checkForChannel};
        commands.module.Game.deposit(msg, discord);
    }
    /*else if(msg.content.startsWith(`${prefix}TTT`))
    {
        if(msg.mentions.users.first() === undefined)
        {
            const embed = new discord.MessageEmbed()
            .addFields({name:`Error!`, value: `> Du musst noch einen Gegner pingen ^^`});
            
            msg.channel.send(embed);
            return;
        }
        msg.button = disbut;
        commands.module.Game.TTT.run(msg, discord);
    }
    */
});

bot.login(token.module.token);