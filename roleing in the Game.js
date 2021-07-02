`strict mode`

const discord = require('discord.js');
const bot = new discord.Client();
const disbut = require('discord-buttons');
disbut(bot);
const commands = require('./commands_dc/commands.js');
const tools = require('./tools/tools.js');
const fs = require('fs');
const token = require('./token.js');
let prefix = 'rg!';
let channelForRolePlay;
let bankbalance = 0;
let ownbalance = 0;
let setGlobal;

bot.on('clickButton', async (button) => {
    button.button = disbut;
    commands.module.Game.TTT.handleClick(button);
    await button.defer();
})

bot.on('ready', () => {
    console.log(`I'm driving and I'm speeding.`);
})

bot.on('message', msg => {
    msg.color = '#13ab13';
    msg.seperator = `//\\\\\\ \n \\\\\\\\//`;
    msg.prefix = prefix;
    msg.bankbalance = 0;
    msg.Player1 = msg.member;
    msg.Player2;

    if(msg.channel === setGlobal && !msg.author.bot)
    {
        const globalEmbed = new discord.MessageEmbed()
        .setThumbnail(bot.user.avatarURL)
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setColor([180, 160, 50])

        
        if(msg.referenced_message){
            console.log(msg.referenced_message.embeds[0].author.name);
            globalEmbed.addFields({name: `antwortet auf: ${msg.referenced_message.embeds[0].author.name || msg.content.author.name}`, value: `${msg.referenced_message.content || msg.referenced_message.embeds[0].fields[msg.referenced_message.embeds[0].fields.length - 1].value}`})
        }
        globalEmbed.addFields({name: 'rg Global', value: `${msg.content}`})

        msg.channel.send(globalEmbed);
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
        const channel = msg.mentions.channels.first();
        setGlobal = channel;
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
});



bot.login(token.module.token);