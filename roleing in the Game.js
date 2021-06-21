`strict mode`

const discord = require('discord.js');
const bot = new discord.Client();
const disbut = require('discord-buttons');
disbut(bot);
const commands = require('./commands/commands.js');
const tools = require('./tools/tools.js');
const fs = require('fs');
const token = require('./token.js');
let prefix = 'rg!';
let channelForRolePlay;
let bankbalance = 0;
let ownbalance = 0;

bot.on('ready', () => {
    console.log(`I'm driving and I'm speeding.`);
})

bot.on('message', msg => {
    msg.color = '#13ab13';
    msg.seperator = `//\\\\\\ \n \\\\\\\\//`;
    msg.prefix = prefix;
    msg.bankbalance = 0;
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
    //Games

    else if(msg.content.startsWith(`${prefix}deposit`))
    {
        msg.channelForRolePlay = channelForRolePlay;
        msg.amountForNow = Number.parseInt(bankbalance);
        msg.tool = {checkForChannel: tools.module.checkForChannel};
        commands.module.Game.deposit(msg, discord);
        bankbalance += Number.parseInt(msg.bankbalance);
    }
    else if(msg.content === `${prefix}TTT`)
    {
        commands.module.Game.TTT(msg, discord);
    }
});



bot.login(token.module.token);