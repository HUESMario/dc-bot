const superagent = require('superagent');
const discord = require('discord.js');

const { parse } = require('node-html-parser');

/**
 * 
 * @param {discord.Message} oldMsg 
 * @param {discord.Client} bot 
 * @param {object} data
 * @param {number} i
 */
const sendGif = async (oldMsg, bot, data, i) => {

const gifs = (link) => {
    return new Promise(function(resolve, reject)
        {
            let url = new URL(link); 

            superagent.get(url.href).then((object) => {resolve(object.text)}).catch((e) => {reject(e)})
        })
    }
        const pageStr = await gifs(oldMsg.embeds[0].url);
        const pageHTML = parse(pageStr);
        const gifLink = pageHTML.querySelector('#single-gif-container').querySelector('img').attributes.src;
    

        const globalEmbed = new discord.MessageEmbed();

        globalEmbed.setAuthor(oldMsg.author.username, oldMsg.author.avatarURL())
        globalEmbed.addField('> Gif sent by', `${oldMsg.author.username}`);
        globalEmbed.setImage(gifLink)
        const registeredGuilds = Object.keys(data);
        bot.channels.cache.get(data[registeredGuilds[i]].globalChannel.id).send({embeds: [globalEmbed]});
}



module.exports = {
    sendGif: sendGif
}