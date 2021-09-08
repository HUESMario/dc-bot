const getURLSFromImages = require('get-image-urls');
const discord = require('discord.js');
const {URLSearchParams} = require('url');
const fs = require('fs');

class queueList
{
    addGif = (item) => {
        this.gifList[this.size] = item;
        ++this.size;
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
        const data = JSON.parse(fs.readFileSync('./globalChatServers.json', {encoding: 'utf-8'}));
        const registeredGuilds = Object.keys(data);
        getURLSFromImages(currentGif.gif.url).then(urls => {
            const getIndex = (urlList) => {
                for(let i = 0; i < urlList.length; ++i)
                {
                    const object = {}
                    const nameArrURLList = urlList[i].url.split('/')[4].split('.')[0].split('-');
                    const nameArrCurrentGif = currentGif.gif.url.split('/')[4].split('.')[0].split('-');
                    
                    let isCorrect = true;
                    for(let j = 0; j < nameArrURLList.length; ++j)
                    {
                        if(nameArrURLList[j] !== nameArrCurrentGif[j])
                        {
                            isCorrect = false;
                        }
                    }
                    if(isCorrect)
                    {
                        return i;
                    } 
                }
                return 1;
            }
                
                    const globalEmbed = new discord.MessageEmbed();
                    globalEmbed.setThumbnail(currentGif.msg.bot.user.avatarURL)
                    globalEmbed.setAuthor(`rg!global`, currentGif.msg.author.avatarURL())
                    globalEmbed.setColor(currentGif.msg.color)
                    globalEmbed.setFooter(currentGif.msg.guild.name, currentGif.msg.guild.iconURL());
                    globalEmbed.addField(`> ${currentGif.user.username}`, `sent gif:`)
                    globalEmbed.setImage(urls[getIndex(urls)].url)
                
                    for(let i = 0; i < registeredGuilds.length; ++i)
                    {
                        channels.cache.get(data[registeredGuilds[i]].globalChannel.id).send({embeds: [globalEmbed]});
                    }
        
    }).catch(err => { console.log(err) });
        }
        --this.size;
};


    returnLength = () => {
        return this.size;
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

module.exports = {
    queueList: queueList,
    queueItem: queueItem
};
