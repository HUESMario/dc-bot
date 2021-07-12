`strict mode`

const discord = require('discord.js');
const bot = new discord.Client();
const disbut = require('discord-buttons');
disbut(bot);
const psList = require('ps-list');
const commands = require('./commands_dc/commands.js');
const tools = require('./tools/tools.js');
const fs = require('fs');
const token = require('./token.js');
const queryString = require('querystring');
const gifQueue = require('./gifQueue.js');
let queueList = new gifQueue.module.queueList();
let prefix = 'rg!';
let channelForRolePlay;
let setGlobal;

bot.on('clickButton', (button) => {
    button.button = disbut;
    commands.module.Game.TTT.handleClick(button);
})

bot.on('ready', () => {
    console.log(`I'm driving and I'm speeding.`);
})

bot.on('message',async msg => {
    psList().then(async processes => {
        
        msg.color = '#13ab13';
        msg.seperator = `//\\\\\\ \n \\\\\\\\//`;
        msg.prefix = prefix;
        msg.Player1 = msg.member;
        msg.Player2;
        

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
                        .setThumbnail(bot.user.avatarURL())
                        .setAuthor(oldMsg.author.username, oldMsg.author.avatarURL())
                        .setColor(msg.color)
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
                                const queueItem = new gifQueue.module.queueItem();
                                oldMsg.bot = bot;
                                queueItem.addGif(oldMsg.embeds[0], oldMsg.author, oldMsg, bot.channels);
                                queueList.addGif(queueItem);

                                if(Object.values(processes).indexOf('phantomjs.exe') <= -1){
                                    if(queueList.returnLength() > 0 && !msg.author.bot)
                                    {
                                        queueList.workOnNext(bot.channels);
                                    }
                                }

                                return;
                            }
                            else if(oldMsg.attachments.toJSON().length > 0)
                            {
                                oldMsg.attachments.forEach((e)=> {
                                    globalEmbed.setImage(e.url.toString())
                                })
                            }
                            if(oldMsg.content.startsWith('rg!imBored'))
                        {   
                            const text = commands.module.Different.getHappy();
                            console.log(text);
                            text.then(value => {
                                globalEmbed.setAuthor(bot.user.username, bot.user.avatarURL())
                                globalEmbed.addField('Gelangweilt? Jetzt nicht mehr!', `Aktivität: ${value.activity} \n link: ${value.link} \n teilnehmende: ${value.participants} \n Art der Aktivität: ${value.type}`);
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
                        return;
                }
        }
        if(msg.mentions.users.first())
        {
            msg.Player2 = msg.mentions.members.first()
        }
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
        else if(msg.content.startsWith(`${prefix}TTT`))
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
        else if(msg.content.startsWith(`${prefix}testEmbed`))
        {
            const embed = new discord.MessageEmbed()
            .addField('greetings');

            const upper_left = new disbut.MessageButton()
            .setID('0:0')
            .setStyle(4)
            .setLabel('Test Button')
            .setDisabled(true);

            msg.channel.send({embed: embed, component: upper_left})
        }
    });
});

bot.login(token.module.token);