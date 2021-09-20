const discord = require('discord.js');

/**
 * This Function sends an Embed with all Commands.
 * @param {discord.Message} msg get Channel to Send Embed to. 
 * @returns void
 */
const help = (msg) => {
    const embed = new discord.MessageEmbed()
    .setColor(msg.color)
    .setTitle(`roleing in the Game`)
    .setAuthor(msg.author.username)
    .addFields(
        {name: "> `Admin`", value: `You can select the Global Chat Channel with **rg!setGlobal <#channel>**.
        ${msg.seperator}
        You can Delete the Global Chat with **rg!delGlobal**`},
        {name: "> `Game`", value: `You can Play **Tic Tac Toe** with someone else: **rg!TTT <@opponent>**.
        ${msg.seperator}
        You can delete Your Game with: **rg!TTT delete <@opponent>**.`},
        {name: "> `new Games:`", value: `You can Play **3 Won** with **rg!3won <@opponent>** ( wanted to make 4 wins but Technical Limitations kinda restricted me, sadge )
        ${msg.seperator}
        You can delete your Game with **rg!3won delete <@opponent>**.`},
        {name: "> `rg Global`", value: `You can get something to do by typing in the rg Chat Channel: **rg!imBored**`},
        {name: "> `different`", value: `You can get my Code from **rg!source**
        ${msg.seperator}
        If you want to support me Invite me with **rg!invite**.
        ${msg.seperator}
        You can Send feedback through sliding in my DMs: **weirdo_flugzeug#0919** or write me an E-mail: **happlemnm@gmail.com**`}
    )  
    .setFooter(msg.guild.name, msg.guild.iconURL())

    msg.channel.send({embeds: [embed]});
    return;
}

module.exports = {
    run: help
}