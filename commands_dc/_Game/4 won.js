`use Strict`

const discord = require('discord.js');
const tools = require('../../tools/tools.js');
let Player1;
let Player2;
let activePlayer = 0;
const playerChars = [[' ', 1], [' ', 3]];
let won = false;

let fields = [
    [{character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}], 
    [{character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}], 
    [{character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}],
    [{character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 3, Disabled: true}], 
    [{character: " ", style: 2, Disabled: true}, {character: " ", style: 3, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 3, Disabled: true}]
]

const threeWonGame = (msg) => {
    Player1 = msg.Player1;
    Player2 = msg.Player2;
    computePlayfield();
    getPlayfield(msg)
}

const threeClick = (button) => {
    
}

const computePlayfield = () => {
    const ContainsDifferentValue = (currentValue) => currentValue === 2;
    for(let i = fields.length - 1; i >= 0; --i)
    {
        const rowField = [];
        for(let j = 0; j < fields[i].length; ++j)
        {
            rowField.push(fields[i][j].style);

            if(fields[i][j].style === 2)
            {
               if(fields[i + 1] === undefined || fields[i + 1][j].style !== 2)
               {
                   fields[i][j].Disabled = false;
               }
               
            }
        }
        if(rowField.every(ContainsDifferentValue))
        {
            return;
        }
    }
}

const saveGameData = (connectedID, data) => {
    data[connectedID] = {};
    data[connectedID]["fields"] = fields;
    data[connectedID]["activePlayer"] = activePlayer;
    data[connectedID]["Player1"] = Player1;
    data[connectedID]["Player2"] = Player2;
    fs.writeFileSync('./commands_dc/_Game/_data/games.json', JSON.stringify(data), (err) => {
        if(err) throw err;
    })
}

const getPlayfield = (msg) => {
    const playerEmbed = new discord.MessageEmbed();
//
    playerEmbed.addField('Player IDs:', `${[Player1.userID, Player2.userID].join('&')}`);
    
    if(activePlayer === 0)
    {
        if(!won)
        {
            if(!Player1.user)
            {
                playerEmbed.addField('active Player: ', Player1.displayName)
            }
            else
            {
                playerEmbed.addField('active Player: ', Player1.user.username)
            }
        }
        else if(won)
        {
            playerEmbed.addField('Player who won: ', Player1.displayName)
        }
    }
    else
    {
        if(!won)
        {
            if(!Player2.user)
            {
                playerEmbed.addField('active Player: ', Player2.displayName)
            }
            else
            {
                playerEmbed.addField('active Player: ', Player2.user.username)
            }
        }
        else if(won)
        {
            playerEmbed.addField('Player who won: ', Player2.displayName)
        }
    }
    playerEmbed.addField('Game:', `3 Won`);

    const rows = [];

    for(let i = 0; i < fields.length; ++i)
    {
        const row = new msg.button.MessageActionRow();
        for(let j = 0; j < fields[i].length; ++j)
        {
            const button = new msg.button.MessageButton()
            .setID(`${i}:${j}`)
            .setStyle(fields[i][j].style)
            .setLabel(fields[i][j].character)
            .setDisabled(fields[i][j].Disabled);

            row.addComponent(button);
        }
        rows.push(row);
    }
    
    msg.channel.send({embed: playerEmbed,components: rows});
}

module.exports = {
    handleClick: threeClick,
    threeWon: threeWonGame
}