const getURLSFromImages = require('get-image-urls');
const discord = require('discord.js');
const queryString = require('querystring');
const fs = require('fs');

class queueList
{
    addItem = (item) => {
        this.gifList[size] = item;
    }

    workOnNext = async (channels) => {
        const data = JSON.parse(fs.readFileSync('./serversForGlobalChat.json', {encoding: 'utf-8'}));
        const registeredGuilds = Object.keys(data);
        getURLSFromImages(this.gifList[0].gif.url).then(urls => {
            const getIndex = (urlList) => {
                for(let i = 0; i < urlList.length; ++i)
                {
                    if(queryString.parse(urlList[i].url)[urlList[i].url] === undefined) {
                        return i;
                    } 
                }
            }

            const deleteFirst = () => {
                let newList = [];
                for(let i = 0; i < this.size; ++i)
                {
                    if(this.gifList[i + 1] !== undefined) newList[i] = this.gifList[i + 1]
                }
                this.gifList = newList;
                --this.size;
            }

            console.log(this.gifList);
            
            const globalEmbed = new discord.MessageEmbed();
            globalEmbed.setThumbnail(this.gifList[0].msg.bot.user.avatarURL)
            globalEmbed.setAuthor(this.gifList[0].msg.author.username, this.gifList[0].msg.author.avatarURL())
            globalEmbed.setColor(this.gifList[0].msg.color)
            globalEmbed.setFooter(this.gifList[0].user.username, this.gifList[0].msg.guild.iconURL());
            globalEmbed.addField(`> ${this.gifList[0].user.username}`, `sent gif:`)
            globalEmbed.setImage(urls[getIndex(urls)].url)
        
            for(let i = 0; i < registeredGuilds.length; ++i)
            {
                channels.cache.get(data[registeredGuilds[i]].globalChannel.id).send(globalEmbed);
            }
            deleteFirst();
        })
    }

    returnLength = () => {
        return this.size;
    }

    addGif = (item) => {
        this.gifList[this.size] = item;
        ++this.size;
    }   
    size = 0;
    gifList = [];
}

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
}