`strict mode`

const discord = require('discord.js');
const bot = new discord.Client();
const disbut = require('discord-buttons');
disbut(bot);
const commands = require('./commands_dc/commands.js');
const getReference = require('dc_ref_msg');
getReference.extend(getReference.reference)
const tools = require('./tools/tools.js');
const fs = require('fs');
const token = require('./token.js');
const queryString = require('querystring');
const gifQueue = require('./gifQueue.js');
let queueList = new gifQueue.queueList();
let prefix = 'rg!';
let channelForRolePlay;
let setGlobal;

bot.on('clickButton', (button) => {
    button.button = disbut;
    commands.Game.TTT.handleClick(button);
})

bot.on('ready', () => {
    bot.user.setStatus('online') 
    bot.user.setActivity(`TTT on ${bot.guilds.cache.size} Servers`)
    console.log(`I'm driving and I'm speeding.`);
})

bot.on('message',async msg => {
    msg.color = '#13ab13';
    msg.seperator = `//\\\\\\ \n \\\\\\\\//`;
    msg.prefix = prefix;
    msg.Player1 = msg.member;
    msg.Player2;

    
    const data = JSON.parse(fs.readFileSync('./serversForGlobalChat.json', {encoding: 'utf-8'}));
    if(data[msg.channel.guild.id])
    {
        commands.global.globalChat(discord, msg);
    }
    if(msg.mentions.users.first())
    {
        msg.Player2 = msg.mentions.members.first()
    }
    //Help
    if(msg.content == `${prefix}help`)
    {
        commands.help.help(msg, discord);
    }
    else if(msg.content === `${prefix}source`)
    {
        msg.button;
        msg.button = new disbut.MessageButton();
        commands.help.source(msg, discord);
    }
    //Admin
    
    else if(msg.content.startsWith(`${prefix}setGlobal`))
    {
        
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
        msg.tool = {checkForChannel: tools.checkForChannel};
        commands.Game.deposit(msg, discord);
    }
    else if(msg.content.startsWith(`${prefix}TTT`))
    {
        if(msg.mentions.users.first() === undefined)
        {
            const embed = new discord.MessageEmbed()
            .addFields({name:`Error!`, value: `> You need to Mention an Opponnent. ^^`});
            
            msg.channel.send(embed);
            return;
        }
        msg.button = disbut;
        commands.Game.TTT.run(msg, discord);
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

bot.login(token.token);