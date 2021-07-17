const gifQueue = require('./gifQueue.js');
const sendGif = (oldMsg, gifList, bot) => {
    const queueItem = new gifQueue.queueItem();
    oldMsg.bot = bot;
    queueItem.addGif(oldMsg.embeds[0], oldMsg.author, oldMsg, bot.channels);
    gifList.addGif(queueItem);

    if(Object.values(processes).indexOf('phantomjs.exe') <= -1){
        if(queueList.returnLength() > 0 && !msg.author.bot)
        {
            queueList.workOnNext(bot.channels);
        }
    }

    return;
}
module.exports = {
    sendGif: sendGif
}