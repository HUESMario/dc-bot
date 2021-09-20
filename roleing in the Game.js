`strict mode`

const discord = require('discord.js');
const bot = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_MEMBERS]});
const commands = require('./commands_dc/commands.js');
const tools = require('./tools/tools.js');
const fs = require('fs');
const token = require('./Token.js');

/*const queryString = require('querystring');
const gifQueue = require('./commands_dc/globalChat/gifQueue.js');
const gifList = new gifQueue.queueList();
*/
let prefix = 'rg!';
let statusArr = [`TTT and 3 won`, 'updating to discord.js v13', 'get Commands with rg!help'];
let currentStatus = 0;

bot.on('ready', () => {
    bot.user.setStatus('online') 
    bot.user.setActivity(`TTT and 3 won`)
    console.log(`I'm driving and I'm speeding.`);
})

bot.on('interactionCreate', (button) => {
    if(!button.isButton()) return;
    if(button.message.author.id === '842053072666099733' || button.message.author.id === '799388234877632558')
    { 
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

bot.on('messageCreate', async msg => {
    if(msg.author.bot) return;

    msg.color = '#663399';
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
        await commands.global.globalChat(bot, msg, data);
        return;
    }
    //Help
    if(msg.content == `${prefix}help`)
    {
        commands.help.help(msg);
    }
    else if(msg.content === `${prefix}source`)
    {
        commands.help.source(msg);
    }
    else if(msg.content === `${prefix}invite`)
    {
        commands.help.invite(msg);
    }
    //Admin
    
    else if(msg.content.startsWith(`${prefix}setGlobal`))
    {
        commands.global.setGlobal(msg, bot);
    }
    else if(msg.content === `${prefix}delGlobal`)
    {   
        commands.global.delGlobal(msg, bot);
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
        commands.Game.TTT.run(msg);
    }

    else if(msg.content.startsWith(`${prefix}3won`))
    {
        if(msg.content.split(' ')[1] === 'delete' && msg.mentions.users.first())
        {
            if(msg.mentions.users.first())
            {
                const Opponnent = msg.mentions.users.first();
                const connectedIDs = tools.module.connectIDs(msg.author.id, Opponnent.id);
                const data = JSON.parse(fs.readFileSync('commands_dc/_Game/_data/3Won.json', {encoding: 'utf-8'}));
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
                    fs.writeFileSync('commands_dc/_Game/_data/3Won.json', JSON.stringify(newGames), (err) => {
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
        }
        if(msg.mentions.users.first())
        {
            msg.Player2 = msg.mentions.members.first()
            commands.Game.threeWon.run(msg);
        }
    }
    else if(msg.content === `${prefix}hangman`)
    {
        commands.Game.hangman.startGame(msg);
    }
    else if(msg.content.startsWith(`${prefix}guess`))
    {
        commands.Game.hangman.checkLetter(msg);
    }
    //infos
    else if(msg.content.startsWith(`${prefix}getTweets`))
    {
        commands.news.twitter.run(msg, bot);
    }
   //My Commands
   
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
});

setInterval(()=>{
    let length = statusArr.length;
    if(currentStatus === length - 1)
    {
        currentStatus = 0;
    }
    else 
    {
        ++currentStatus;
    }
    if(!statusArr[currentStatus])
    {
        currentStatus = 0;
    }
    bot.user.setActivity(statusArr[currentStatus]);
}, 10000);

bot.login(token.token);