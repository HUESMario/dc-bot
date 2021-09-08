const discord = require('discord.js');
const cfg = require('../../config.json');
const tw = require('node-tweet-stream')(cfg);

const twitter = (msg, bot) => {
    const data = require('./receiver.json');
    if(data[msg.channel.id])
    {
        tw.language('en');
        tw.track(msg.content.split(' ')[1] || 'Game');
        tw.on('tweet', (tweet) => {
            console.log(tweet);
            if(tweet.text.length > 0)
            {
                const embed = new discord.MessageEmbed()
                .setAuthor(tweet.user.name, tweet.user.profile_background_image_url)
                .addField('Tweet', tweet.text);

                msg.channel.send({embeds: [embed]});
            }
        });
    }
    else 
    {
        
    }
}

module.exports = {
    twitter: twitter
}