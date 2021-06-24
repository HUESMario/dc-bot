`strict mode`

let activePlayer = 0;
const playerChars = [['X', 1], ['O', 3]];
const fs = require('fs');
const tools = require('../../tools/tools.js');
const solutions = [
    [["0:0"], ["0:1"], ["0:2"], 0], [["1:0"],["1:1"],["1:2"], 1], [["2:0"], ["2:1"], ["2:2"], 2], 
    [["0:0"], ["1:0"], ["2:0"], 3], [["0:1"], ["1:1"], ["2:1"], 4], [["0:2"], ["1:2"], ["2:2"], 5],
    [["0:0"], ["1:1"], ["2:2"], 6], [["0:2"], ["1:1"], ["2:0"], 7]
]
let fields = [
    [{character: " ", style: 2}, {character: " ", style: 2}, {character: " ", style: 2}], 
    [{character: " ", style: 2}, {character: " ", style: 2}, {character: " ", style: 2}], 
    [{character: " ", style: 2}, {character: " ", style: 2}, {character: " ", style: 2}]
]
const TTT = (msg, discord) => {
    const data = require('./_data/games.json');
    const Player1 = msg.author;
    const Player2 = msg.mentions.users.first();

    getPlayfield(msg);
    let newGame = {};
    if(data === {})
    {
        newGame[msg.guild.id] = {
            "Player1": Player1,
            "Player2": Player2
        }
    }
    else if(data !== {}) newGame = data;

    fs.writeFile('./commands_dc/_Game/_data/games.json', JSON.stringify(newGame), (err) => {
        if(err) throw err;
    })
}

const handleTTT = (handleData) => {
    changeField(handleData)
    getPlayfield(handleData);
    if(checkForWin(handleData.message.components))
    {
        console.log('Won');
    }
    else
    {
        changePlayer(); 
    }
    handleData.message.delete();
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

    msg.channel.send(`Player ${activePlayer + 1}:`, {components: [row1, row2, row3]});
    return [row1, row2, row3]
}

const checkForWin = (componentsRows) => {
    let won = false;
    solutions.forEach(solution => {
        if(typeof(solution) !== 'number')
        {
            const position1 = tools.module.extractPos(solution[0]);
            const position2 = tools.module.extractPos(solution[1]);
            const position3 = tools.module.extractPos(solution[2]);
            let button1 = componentsRows[position1[0]].components[position1[1]];
            let button2 = componentsRows[position2[0]].components[position2[1]];
            let button3 = componentsRows[position3[0]].components[position3[1]];
            if(button1.label === 'X' && button2.label ==='X' && button3.label === 'X')
            {
                won = true;
            }
        }
    });
    return won;
}

const changePlayer = () => {
    if(activePlayer === 0)
    {
        activePlayer = 1;
    }
    else if(activePlayer === 1)
    {
        activePlayer = 0;
    }
}

const changeField = (button) => {
    const getIndexes = tools.module.extractPos(button.id)
    fields[getIndexes[0]][getIndexes[1]].character = playerChars[activePlayer]; 
    button.message.components[getIndexes[0]].components[getIndexes[1]].label = playerChars[activePlayer];
}

exports.module = {
    TTT: TTT,
    handleClick: handleTTT
}