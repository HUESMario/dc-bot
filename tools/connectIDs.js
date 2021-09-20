/**
 * connect the Ids from Player 1 and Player 2 with '&'
 * @param {string} player1Id 
 * @param {string} player2Id 
 * @returns {string} connected IDs
 */
const connect = (player1Id, player2Id) => {
    let connectIds = [];
    connectIds.push(player1Id, player2Id)
    connectIds = connectIds.join('&');
    return connectIds;
}
exports.module = {
    connectIDs: connect
}