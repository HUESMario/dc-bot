`strict mode`

const discord = require('discord.js');
const bot = new discord.Client();
const disbut = require('discord-buttons');
disbut(bot);
const commands = require('./commands_dc/commands.js');
const cfg = require('./config.json');
const tw = require('node-tweet-stream')(cfg);
const getReference = require('dc_ref_msg');
getReference.extend(getReference.reference)
const tools = require('./tools/tools.js');
const fs = require('fs');
const token = require('./token.js');
const queryString = require('querystring');
const gifQueue = require('./commands_dc/globalChat/gifQueue.js');
const gifList = new gifQueue.queueList();
let prefix = 'rg!';

bot.on('clickButton', (button) => {
    console.log(button.message.components);
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

    if(msg.mentions.users.first())
    {
        msg.Player2 = msg.mentions.users.first();
    }

    //rg global
    const data = JSON.parse(fs.readFileSync('./serversForGlobalChat.json', {encoding: 'utf-8'}));
    if(data[msg.guild.id + msg.channel.id])
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
    else if(msg.content.startsWith(`${prefix}delTTT`))
    {
        if(msg.mentions.users.first())
        {
            const Opponnent = msg.mentions.users.first();
            const connectedIDs = tools.module.connectIDs(msg.author.id, Opponnent.id);
            const data = JSON.parse(fs.readFileSync('commands_dc/_Game/_data/games.json', {encoding: 'utf-8'}));
            if(!data[connectedIDs])
            {
                const embed = new discord.MessageEmbed()
                .addFields({name:`Error!`, value: `> You didn't fought against him.`});
            
            msg.channel.send(embed);
            return;
            }
            else {
                const newGames = data;
                delete newGames[connectedIDs];
                fs.writeFileSync('commands_dc/_Game/_data/games.json', JSON.stringify(newGames), (err) => {
                    const embed = new discord.MessageEmbed()
                    .addFields({name:`Uhmm Upps :-)`, value: `> Seems like I made a mistake this Time, would you like to try again?`});
            
                    msg.channel.send(embed);
                    return;
                })
                const embed = new discord.MessageEmbed()
                .addFields({name:`Success :)`, value: `> Your Game has been deleted.`});
            
                msg.channel.send(embed);
                return;
            }
        }   
        if(msg.mentions.users.first() === undefined)
        {
            const embed = new discord.MessageEmbed()
            .addFields({name:`Error!`, value: `> You need to Mention your Opponnent. So I can delete your Game^^`});
            
            msg.channel.send(embed);
            return;
        }
    }

    else if(msg.content.startsWith('rg!3won'))
    {
        commands.Game.threeWon.run(msg);
    }

    /*
    //infos
    else if(msg.content.startsWith(`${prefix}getTweets`))
    {
        tw.language('en');
        tw.track(msg.content.split(' ')[1] || 'Game');
        tw.on('tweet', (tweet) => {
            const embed = new discord.MessageEmbed()
            .setAuthor(tweet.user.name, tweet.user.profile_background_image_url)
            .addField('Tweet', tweet.text);

            msg.channel.send(embed);
        });
    }
    */
})

setInterval(()=>{
    bot.user.setActivity(`TTT on ${bot.guilds.cache.size} Servers`)
}, 10000);
bot.login(token.token);