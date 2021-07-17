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
const gifQueue = require('./commands_dc/globalChat/gifQueue.js');
const gifList = new gifQueue.queueList();


let prefix = 'rg!';
let channelForRolePlay;

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

    //rg global
    const data = JSON.parse(fs.readFileSync('./serversForGlobalChat.json', {encoding: 'utf-8'}));
    if(data[msg.channel.guild.id])
    {
        await commands.global.globalChat(discord, msg, bot, gifList, data);
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
        commands.global.setGlobal(bot, discord, msg);
    }
    else if(msg.content === `${prefix}delGlobal`)
    {   
        commands.global.delGlobal(msg, discord, bot);
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
        if(msg.mentions.users.first())
        {
            msg.Player2 = msg.mentions.members.first()
        }
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
})
bot.login(token.token);