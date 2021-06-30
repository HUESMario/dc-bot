const connect = (player1Id, player2Id) => {
    let connectIds = [];
    connectIds.push(player1Id, player2Id)
    connectIds = connectIds.join('&');
    return connectIds;
}
exports.module = {
    connectIDs: connect
}