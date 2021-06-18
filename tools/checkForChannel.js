const checkForChannel = (msg, channel) => {
    if(msg.channel.id === channel.id) return true;
    return false;    
}
exports.module = {
    checkForChannel: checkForChannel
}