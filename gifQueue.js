const getURLSFromImages = require('get-image-urls');
const discord = require('discord.js');
const queryString = require('querystring');
const psList = require('ps-list');
const fs = require('fs');

class queueList
{
    addItem = (item) => {
        this.gifList[size] = item;
    }

    

    workOnNext = (channels) => {
        const currentGif = this.gifList[0];
        if(this.size === 0) return;
        const deleteFirst = () => {
            let newList = [];

            for(let i = 0; i < this.size; ++i)
            {
                if(this.gifList[i + 1]) newList[i] = this.gifList[i + 1]
            }
            this.gifList = newList;
        }
        
        deleteFirst();
        if(this.size !== 0)
        {
        const data = JSON.parse(fs.readFileSync('./serversForGlobalChat.json', {encoding: 'utf-8'}));
        const registeredGuilds = Object.keys(data);
        getURLSFromImages(currentGif.gif.url).then(urls => {
            console.log('done')
            const getIndex = (urlList) => {
                for(let i = 0; i < urlList.length; ++i)
                {
                    if(queryString.parse(urlList[i].url)[urlList[i].url] === undefined) {
                        return i;
                    } 
                }
            }
                
                    const globalEmbed = new discord.MessageEmbed();
                    globalEmbed.setThumbnail(currentGif.msg.bot.user.avatarURL)
                    globalEmbed.setAuthor(currentGif.msg.author.username, currentGif.msg.author.avatarURL())
                    globalEmbed.setColor(currentGif.msg.color)
                    globalEmbed.setFooter(currentGif.user.username, currentGif.msg.guild.iconURL());
                    globalEmbed.addField(`> ${currentGif.user.username}`, `sent gif:`)
                    globalEmbed.setImage(urls[getIndex(urls)].url)
                
                    for(let i = 0; i < registeredGuilds.length; ++i)
                    {
                        channels.cache.get(data[registeredGuilds[i]].globalChannel.id).send(globalEmbed);
                    }
        
    }).catch(err => { console.log(err) });
        }
        --this.size;
};


    returnLength = () => {
        return this.size;
    }

    addGif = (item) => {
        this.gifList[this.size] = item;
        ++this.size;
    }   
    size = 0;
    gifList = [];
};

class queueItem
{
    addGif = (gifObject, user, msg) => {
        this.gif = gifObject;
        this.user = user;
        this.msg = msg;
    }   

    gif = {}
    user = {}
    msg = {}
}

exports.module = {
    queueList: queueList,
    queueItem: queueItem
};