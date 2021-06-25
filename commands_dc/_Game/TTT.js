`strict mode`

let activePlayer = 0;
const playerChars = [['X', 1], ['O', 3]];
const fs = require('fs');
const tools = require('../../tools/tools.js');
let Player1;
let Player2;
let msgCopy;
const solutions = [
    [["0:0"], ["0:1"], ["0:2"], 0], [["1:0"],["1:1"],["1:2"], 1], [["2:0"], ["2:1"], ["2:2"], 2], 
    [["0:0"], ["1:0"], ["2:0"], 3], [["0:1"], ["1:1"], ["2:1"], 4], [["0:2"], ["1:2"], ["2:2"], 5],
    [["0:0"], ["1:1"], ["2:2"], 6], [["0:2"], ["1:1"], ["2:0"], 7]
]
let fields = [
    [{character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}], 
    [{character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}], 
    [{character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}]
]
const TTT = (msg, discord) => {
    msgCopy = msg;
    const data = require('./_data/games.json');
    Player1 = msg.Player1;
    Player2 = msg.Player2;
    console.log(Player1);
    fields = [
        [{character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}], 
        [{character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}], 
        [{character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}]
    ]

    const joinedIDs = [Player1.id, Player2.id].join('&')
    let newGame = {};
    if(data[joinedIDs] === undefined)
    {
        createRole(msg.guild, Player1.id, Player2.id);
        newGame[joinedIDs] = {}
        newGame[joinedIDs] = {
            "Player1": Player1,
            "Player2": Player2
        }
        getPlayfield(msg);
    }
    else if(data[joinedIDs] !== undefined)
    {
        const embed = new discord.MessageEmbed()
        .setColor(msg.color)
        .setTitle(`roleing in the Game - Tik Tak Toe`)
        .setAuthor(msg.author.username)
        .addFields({name: "> TTT", value: `You two already have a Game!`})
        .setFooter(msg.guild.name, msg.guild.iconURL())

        msg.channel.send(embed);
    }

    fs.writeFile('./commands_dc/_Game/_data/games.json', JSON.stringify(newGame), (err) => {
        if(err) throw err;
    })
}

const addRole = (msg, Player1, Player2) => {
    const addedIDs = [Player1.id, Player2.id].join('&');
    const role = msg.guild.roles.cache.find(role => role.name === addedIDs);
    
    Player1.roles.add(role);
    Player2.roles.add(role);
}

const createRole = (guild, Player1ID, Player2ID) => {
    const ids = [Player1ID, Player2ID];
    guild.roles.create({
        data: {
            name: ids.join('&'),
            color:'green',
        },
        reason: 'Role for Tik Tak Toe, to organize Games',
    })
    .then(function(value){
        msgCopy.guild = value
        addRole(msgCopy, Player1, Player2)
        })
}

const deleteRole = () => {

}

const handleTTT = (handleData) => {
    changeField(handleData);
    if(checkForWin(handleData.message.components))
    {
        Won(handleData);
    }
    else
    {
        changePlayer(); 
    }
    getPlayfield(handleData);
    handleData.message.delete();
}

const Won = (member) => {
    const data = require('./_data/games.json');
    const wonGame = data;
    
    for(let i = 0; i < fields.length; ++i)
    {
        for(let j = 0; j < fields[i].length; ++j)
        {
            fields[i][j].Disabled = true;
        }
    }
    
}

const getPlayfield = (msg) => {
    const upper_left = new msg.button.MessageButton()
    .setID('0:0')
    .setStyle(fields[0][0].style)
    .setLabel(fields[0][0].character)
    .setDisabled(fields[0][0].Disabled);
    const upper_middle = new msg.button.MessageButton()
    .setID('0:1')
    .setStyle(fields[0][1].style)
    .setLabel(fields[0][1].character)
    .setDisabled(fields[0][1].Disabled);
    const upper_right = new msg.button.MessageButton()
    .setID('0:2')
    .setStyle(fields[0][2].style)
    .setLabel(fields[0][2].character)
    .setDisabled(fields[0][2].Disabled);

    const middle_left = new msg.button.MessageButton()
    .setID('1:0')
    .setStyle(fields[1][0].style)
    .setLabel(fields[1][0].character)
    .setDisabled(fields[1][0].Disabled);
    const middle_middle = new msg.button.MessageButton()
    .setID('1:1')
    .setStyle(fields[1][1].style)
    .setLabel(fields[1][1].character)
    .setDisabled(fields[1][1].Disabled);
    const middle_right = new msg.button.MessageButton()
    .setID('1:2')
    .setStyle(fields[1][2].style)
    .setLabel(fields[1][2].character)
    .setDisabled(fields[1][2].Disabled);

    const buttom_left = new msg.button.MessageButton()
    .setID('2:0')
    .setStyle(fields[2][0].style)
    .setLabel(fields[2][0].character)
    .setDisabled(fields[2][0].Disabled);
    const buttom_middle = new msg.button.MessageButton()
    .setID('2:1')
    .setStyle(fields[2][1].style)
    .setLabel(fields[2][1].character)
    .setDisabled(fields[2][1].Disabled);
    const buttom_right = new msg.button.MessageButton()
    .setID('2:2')
    .setStyle(fields[2][2].style)
    .setLabel(fields[2][2].character)
    .setDisabled(fields[2][2].Disabled);
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

    if(activePlayer === 0)
    {
        msg.channel.send(`${Player1.username}:`, {components: [row1, row2, row3]});
    }
    else if(activePlayer === 1)
    {
        msg.channel.send(`${Player2.username}:`, {components: [row1, row2, row3]});
    }
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
            if(button1.label === playerChars[activePlayer][0] && button2.label === playerChars[activePlayer][0] && button3.label === playerChars[activePlayer][0])
            {
                fields[position1[0]][position1[1]].style = 4;
                fields[position2[0]][position2[1]].style = 4;
                fields[position3[0]][position3[1]].style = 4;
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
    fields[getIndexes[0]][getIndexes[1]].character = playerChars[activePlayer][0]; 
    fields[getIndexes[0]][getIndexes[1]].style = playerChars[activePlayer][1]; 
    button.message.components[getIndexes[0]].components[getIndexes[1]].label = playerChars[activePlayer][0];
}

exports.module = {
    TTT: TTT,
    handleClick: handleTTT
}