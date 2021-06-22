const fs = require('fs');
let fields = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]
const TTT = (msg, discord) => {
    const data = require('./data/games.json');
    const Gameinfo = data;
    const Player1 = msg.author;
    const Player2 = msg.mentions.users.first();

    getPlayfield(msg);
    
    let newGame = {};
    newGame[msg.guild.id] = {
        "Player1": Player1,
        "Player2": Player2
    }

    fs.writeFile('./commands/Game/data/games.json', JSON.stringify(newGame), (err) => {
        if(err) throw err;
    })
}

const handleTTT = (handleData) => {

}

const getPlayfield = (msg) => {
    const upper_left = new msg.button.MessageButton()
    .setID('upper_left')
    .setStyle(2)
    .setLabel(fields[0][0]);
    const upper_middle = new msg.button.MessageButton()
    .setID('upper_middle')
    .setStyle(2)
    .setLabel(fields[0][0]);
    const upper_right = new msg.button.MessageButton()
    .setID('upper_right')
    .setStyle(2)
    .setLabel(fields[0][0]);

    const middle_left = new msg.button.MessageButton()
    .setID('upper_left')
    .setStyle(2)
    .setLabel(fields[0][0]);
    const middle_middle = new msg.button.MessageButton()
    .setID('middle_middle')
    .setStyle(2)
    .setLabel(fields[0][0]);
    const middle_right = new msg.button.MessageButton()
    .setID('middle_right')
    .setStyle(2)
    .setLabel(fields[0][0]);

    const buttom_left = new msg.button.MessageButton()
    .setID('buttom_left')
    .setStyle(2)
    .setLabel(fields[0][0]);
    const buttom_middle = new msg.button.MessageButton()
    .setID('buttom_middle')
    .setStyle(2)
    .setLabel(fields[0][0]);
    const buttom_right = new msg.button.MessageButton()
    .setID('buttom_right')
    .setStyle(2)
    .setLabel(fields[0][0]);


    const row1 = new msg.button.MessageActionRow()
    .addComponent(upper_left)
    .addComponent(upper_middle)
    .addComponent(upper_right);

    const row2 = new msg.button.MessageActionRow()
    .addComponent(middle_left)
    .addComponent(middle_middle)
    .addComponent(middle_right);
    
    const row3 = new msg.button.MessageActionRow()
    .addComponent(buttom_left)
    .addComponent(buttom_middle)
    .addComponent(buttom_right);

    msg.channel.send('Player 1:', {components: [row1, row2, row3]});
    return [row1, row2, row3]
}

exports.module = {
    TTT: TTT,
    handleClick: handleTTT
}