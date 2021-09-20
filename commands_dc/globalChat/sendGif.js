/*const gifQueue = require('./gifQueue.js');
const psList = require('ps-list');
const sendGif = (oldMsg, gifList, bot) => {
    psList().then(processes => {
        if(!oldMsg.author.bot){
            const queueItem = new gifQueue.queueItem();
            oldMsg.bot = bot;
            queueItem.addGif(oldMsg.embeds[0], oldMsg.author, oldMsg, bot.channels);
            gifList.addGif(queueItem);

            if(Object.values(processes).indexOf('phantomjs.exe') <= -1){
                if(gifList.returnLength() > 0 && !oldMsg.author.bot)
                {
                    gifList.workOnNext(bot.channels);
                }
            }
        }
        return;
    })
}
module.exports = {
    sendGif: sendGif
}*/