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
const token = require('./Token.js');
const queryString = require('querystring');
const gifQueue = require('./commands_dc/globalChat/gifQueue.js');
const gifList = new gifQueue.queueList();
let prefix = 'rg!';

bot.on('clickButton', (button) => {
    if(button.message.author.id === '842053072666099733' || button.message.author.id === '799388234877632558')
    { 
        button.button = disbut;
        if(button.message.components.length === 5)
        {
            commands.Game.threeWon.handleClick(button);
        }
        if(button.message.components.length === 3)
        {
            commands.Game.TTT.handleClick(button);
        }
    }
    else {
        console.log('Not my Button.');
    }
})

bot.on('ready', () => {
    bot.user.setStatus('online') 
    bot.user.setActivity(`TTT and 3 won`)
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
        msg.Player2 = msg.mentions.members.first();
    }
    

    //rg global
    const data = JSON.parse(fs.readFileSync('./globalChatServers.json', {encoding: 'utf-8'}));
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
        if(msg.content.split(' ')[1] === 'delete')
        {
            if(msg.mentions.users.first())
        {
            const Opponnent = msg.mentions.users.first();
            const connectedIDs = tools.module.connectIDs(msg.author.id, Opponnent.id);
            const data = JSON.parse(fs.readFileSync('commands_dc/_Game/_data/TTT.json', {encoding: 'utf-8'}));
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
                fs.writeFileSync('commands_dc/_Game/_data/TTT.json', JSON.stringify(newGames), (err) => {
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
        
    }

    else if(msg.content.startsWith(`${prefix}3won`))
    {
        console.log(msg.content.split(' '));
        if(msg.content.split(' ')[1] === 'delete' && msg.mentions.users.first())
        {
            const connectedIDs = tools.module.connectIDs(msg.author.id,msg.mentions.users.first().id);
            const data = JSON.parse(fs.readFileSync('./commands_dc/_Game/_data/3Won.json', ( err )=>{ console.log(err) }));
            delete data[connectedIDs];
            fs.writeFileSync('./commands_dc/_Game/_data/3Won.json', JSON.stringify(data), ( err )=>{ console.log(err) })
            return;
        }
        if(msg.mentions.users.first())
        {
            msg.Player2 = msg.mentions.members.first()
            msg.button = disbut;
            commands.Game.threeWon.run(msg);
        }
        
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
   //owner Commands
   
   else if(msg.content === 'rg!list Status' && msg.author.id === '774752109064486932')
   {
       let message = "";
       for(let i = 0; i < statusArr.length; ++i)
       {
           message += `${i + 1} |  ${statusArr[i]}\n`; 
       }
       msg.channel.send(message);
       return;
   }
   else if(msg.content.startsWith(`${prefix}deleteStatus`))
   {
    if(typeof(Number(msg.content.split(' ')[1])))
    {
       const index = parseInt(msg.content.split(' ')[1]) - 1;
       let newArr = [];
       for(let i = 0; i < statusArr.length; ++i)
       {
            if(index !== i)
            {
                newArr.push(statusArr[i]);
            }
       }
       statusArr = newArr;
       return;
    }
   }
   if((msg.channel.id === '874679283291947029' || msg.channel.id === '874690582621077584') && msg.author.id === '774752109064486932')
    {
        statusArr.push(msg.content);
    }
})
let statusArr = [`TTT and 3 won`];
let currentStatus = 0;
setInterval(()=>{
    let length = statusArr.length;
    bot.user.setActivity(statusArr[currentStatus]);
    if(length === 1)
    {
        return;
    }
    else 
    {
        if(currentStatus === length - 1)
        {
            currentStatus = 0;
        }
        else 
        {
            ++currentStatus;
        }
    }
}, 10000);
bot.login(token.token);