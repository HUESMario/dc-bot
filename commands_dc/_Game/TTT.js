const fs = require('fs');
const tools = require('../../tools/tools.js');
const solutions = [
    [["0:0"], ["0:1"], ["0:2"]], [["1:0"],["1:1"],["1:2"]], [["2:0"], ["2:1"], ["2:2"]], 
    [["0:0"], ["1:0"], ["2:0"]], [["0:1"], ["1:1"], ["2:1"]], [["0:2"], ["1:2"], ["2:2"]],
    [[["0:0"], ["1:1"], ["2:2"]], [["0:2"], ["1:1"], ["2:0"]]]
]
let fields = [[{character: " ", style: 2}, {character: " ", style: 2}, {character: " ", style: 2}], [{character: " ", style: 2}, {character: " ", style: 2}, {character: " ", style: 2}], [{character: " ", style: 2}, {character: " ", style: 2}, {character: " ", style: 2}]]
const TTT = (msg, discord) => {
    const data = require('./_data/games.json');
    const Player1 = msg.author;
    const Player2 = msg.mentions.users.first();

    getPlayfield(msg);
    let newGame = {};
    if(data !== {})
    {
        newGame[msg.guild.id] = {
            "Player1": Player1,
            "Player2": Player2
        }
    }
    newGame = data;
    fs.writeFile('./commands_dc/_Game/_data/games.json', JSON.stringify(newGame), (err) => {
        if(err) throw err;
    })
}

const handleTTT = async function(handleData) {
    checkForWin(handleData.message.components)
    changeField(handleData.id)
    getPlayfield(handleData);
}

const getPlayfield = (msg) => {
    const upper_left = new msg.button.MessageButton()
    .setID('0:0')
    .setStyle(fields[0][0].style)
    .setLabel(fields[0][0].character);
    const upper_middle = new msg.button.MessageButton()
    .setID('0:1')
    .setStyle(fields[0][1].style)
    .setLabel(fields[0][1].character);
    const upper_right = new msg.button.MessageButton()
    .setID('0:2')
    .setStyle(fields[0][2].style)
    .setLabel(fields[0][2].character);

    const middle_left = new msg.button.MessageButton()
    .setID('1:0')
    .setStyle(fields[1][0].style)
    .setLabel(fields[1][0].character);
    const middle_middle = new msg.button.MessageButton()
    .setID('1:1')
    .setStyle(fields[1][1].style)
    .setLabel(fields[1][1].character);
    const middle_right = new msg.button.MessageButton()
    .setID('1:2')
    .setStyle(fields[1][2].style)
    .setLabel(fields[1][2].character);

    const buttom_left = new msg.button.MessageButton()
    .setID('2:0')
    .setStyle(fields[2][0].style)
    .setLabel(fields[2][0].character);
    const buttom_middle = new msg.button.MessageButton()
    .setID('2:1')
    .setStyle(fields[2][1].style)
    .setLabel(fields[2][1].character);
    const buttom_right = new msg.button.MessageButton()
    .setID('2:2')
    .setStyle(fields[2][2].style)
    .setLabel(fields[2][2].character);


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

const checkForWin = (components) => {
    solutions[0].forEach(solution => {
        
    });
}

const changeField = (id) => {
    const getIndexes = tools.module.extractPos(id);
    console.log(getIndexes);
    fields[getIndexes[0]][getIndexes[1]].character = 'X'; 
}

exports.module = {
    TTT: TTT,
    handleClick: handleTTT
}