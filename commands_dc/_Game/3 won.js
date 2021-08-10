`use Strict`

const discord = require('discord.js');
const fs = require('fs');
const tools = require('../../tools/tools.js');
let Player1;
let Player2;
let activePlayer = 0;
const playerChars = [[' ', 1], [' ', 3]];
let won = 0;
let button;

let fields;

const threeWonGame = (msg) => 
{
    Player1 = msg.Player1;
    Player2 = msg.Player2;
    button = msg.button;
    initializeField();
    computePlayfield();
    const connectedIDs = tools.module.connectIDs(Player1.user.id, Player2.user.id);
    
    const data = JSON.parse(fs.readFileSync('./commands_dc/_Game/_data/3Won.json', (err) => {console.log(err)}));
    if(!data[connectedIDs])
    {
        saveGameData(connectedIDs, data);
        getPlayfield(msg);
    }
    else 
    {
        msg.channel.send(`Seems like you two are already playing \nI'll load it for you`);
        loadGameData(connectedIDs, data);
        getPlayfield(msg);
    }
}

const threeClick = async (button) => 
{
    const clickUser = button.clicker;
    const idsOfPlayers = tools.module.splitIDs(button.message.embeds[0].fields[0].value);
    const idsOfPlayersConnected = tools.module.extractID(button.message.embeds[0].fields[0]);
    
    const data = JSON.parse(fs.readFileSync('./commands_dc/_Game/_data/3Won.json', (err) => {console.log(err)}));
    loadGameData(idsOfPlayersConnected, data);
    const ids = tools.module.extractPos(button.id);
    button.message.button = button.button;

    //get if Correct User wants to Play.
    if(idsOfPlayers[activePlayer] === clickUser.user.id)
    {
        fields[[ids[0]]][ids[1]].style = playerChars[activePlayer][1];
        checkForWin(button.message);
        if(won === 0)
        {
            switchPlayer();
            computePlayfield();
            getPlayfield(button.message);
            saveGameData(idsOfPlayersConnected, data);
            button.message.delete();
        }
        else if(won !== 0)
        {
            getPlayfield(button.message);
            deleteGameData(idsOfPlayersConnected, data);
            button.message.delete();
        }
    }
}

const initializeField = () => {
    won = 0;
    fields = [
        [{character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}], 
        [{character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}], 
        [{character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}],
        [{character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}], 
        [{character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}, {character: " ", style: 2, Disabled: true}]
    ];
}

const checkForWin = (msg) => {
    for(let row = 0; row < fields.length; ++row)
    {
        for(let column = 0; column < fields[row].length; ++column)
        {
            if(fields[row][column].style !== 2)
            {
                const Player = fields[row][column].style;
                //nach oben/unten
                if(fields[row + 1] !== undefined)
                {
                    if(fields[row + 1][column].style == Player)
                    {
                        if(fields[row + 2] !== undefined)
                        {
                            if(fields[row + 2][column].style === Player)
                            {
                                console.log('up/down');
                                if(fields[row + 2][column].style === 1)
                                {
                                    disableAll();
                                    fields[row][column].style = 4;
                                    fields[row + 1][column].style = 4;
                                    fields[row + 2][column].style = 4;
                                    getPlayfield(msg);
                                    won = 1;
                                }
                                else if(fields[row + 2][column].style === 3)
                                {
                                    disableAll();
                                    fields[row][column].style = 4;
                                    fields[row + 1][column].style = 4;
                                    fields[row + 2][column].style = 4;
                                    getPlayfield(msg);
                                    won = 2;
                                }
                                return;
                            }
                        }
                    }
                    
                    //nach oben/unten links
                    if(fields[row + 1][column + 1] !== undefined)
                    {
                        if(fields[row + 1][column + 1].style === Player)
                        {
                            if(fields[row + 2] !== undefined)
                            {
                                if(fields[row + 2][column + 2] !== undefined)
                                {
                                    if(fields[row + 2][column + 2].style === Player)
                                    {
                                        console.log('up left');
                                        if(fields[row + 2][column + 2].style === 1)
                                        {
                                            disableAll();
                                            fields[row][column].style = 4;
                                            fields[row + 1][column + 1].style = 4;
                                            fields[row + 2][column + 2].style = 4;
                                            getPlayfield(msg);
                                            won = 1;
                                        }
                                        else if(fields[row + 2][column + 2].style === 3)
                                        {
                                            disableAll();
                                            fields[row][column].style = 4;
                                            fields[row + 1][column + 1].style = 4;
                                            fields[row + 1][column + 2].style = 4;
                                            getPlayfield(msg);
                                            won = 2;
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    //nach oben/unten rechts
                    if(fields[row + 1][column - 1] !== undefined)
                    {
                        if(fields[row + 1][column - 1].style === Player)
                        {
                            if(fields[row + 2] !== undefined)
                            {
                                if(fields[row + 2][column - 2] !== undefined)
                                {
                                    if(fields[row + 2][column - 2].style === Player)
                                    {
                                        console.log('up rechts');
                                        if(fields[row + 2][column - 2].style === 1)
                                        {
                                            disableAll();
                                            fields[row][column].style = 4;
                                            fields[row + 1][column - 1].style = 4;
                                            fields[row + 2][column - 2].style = 4;
                                            getPlayfield(msg)
                                            won = 1;
                                        }
                                        else if(fields[row + 2][column - 2].style === 3)
                                        {
                                            disableAll();
                                            fields[row][column].style = 4;
                                            fields[row + 1][column - 1].style = 4;
                                            fields[row + 2][column - 2].style = 4;
                                            getPlayfield(msg);
                                            won = 2;
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
                //nach links/rechts
                if(fields[row][column + 1] !== undefined)
                {
                    if(fields[row][column + 1].style === Player)
                    {
                        if(fields[row][column + 2] !== undefined)
                        {
                            if(fields[row][column + 2].style === Player)
                            {
                                console.log('left/right');
                                if(fields[row][column + 2].style === 1)
                                {
                                    disableAll();
                                    fields[row][column].style = 4;
                                    fields[row][column + 1].style = 4;
                                    fields[row][column + 2].style = 4;
                                    getPlayfield(msg);
                                    won = 1;
                                }
                                else if(fields[row][column + 2].style === 3)
                                {
                                    disableAll();
                                    fields[row][column].style = 4;
                                    fields[row][column + 1].style = 4;
                                    fields[row][column + 2].style = 4;
                                    getPlayfield(msg);
                                    won = 2;
                                }
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}

const disableAll = () => {
    for(let i = 0; i < fields.length; ++i)
    {
        for(let j = 0; j < fields[i].length; ++j)
        {
            fields[i][j].Disabled = true;
        }
    }
}

const computePlayfield = () => {
    for(let i = fields.length - 1; i >= 0; --i)
    {
        for(let j = 0; j < fields[i].length; ++j)
        {
            if(fields[i][j].style === 2)
            {
               if(fields[i + 1] === undefined || fields[i + 1][j].style !== 2)
               {
                   fields[i][j].Disabled = false;
               }
            }
        }
    }
}

const switchPlayer = () => {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
}

const saveGameData = (connectedID, data) => {
    data[connectedID] = {};
    data[connectedID]["fields"] = fields;
    data[connectedID]["activePlayer"] = activePlayer;
    data[connectedID]["Player1"] = Player1;
    data[connectedID]["Player2"] = Player2;
    fs.writeFileSync('./commands_dc/_Game/_data/3Won.json', JSON.stringify(data), (err) => {
        if(err) throw err;
    })
}

const loadGameData = (connectedIDs, getData) => {
    fields = getData[connectedIDs]["fields"];
    activePlayer = getData[connectedIDs]["activePlayer"];
    Player1 = getData[connectedIDs]["Player1"];
    Player2 = getData[connectedIDs]["Player2"];
}

const deleteGameData = (connectedID, getData) => {
    delete getData[connectedID];
    fs.writeFileSync('./commands_dc/_Game/_data/3Won.json', JSON.stringify(getData), (err) => {
        if(err) throw err;
    });
}

const getPlayfield = (msg) => {
    const playerEmbed = new discord.MessageEmbed();
    if(!Player1.user)
    {
        playerEmbed.addField('Player IDs:', `${[Player1.userID, Player2.userID].join('&')}`);
    }
    else
    {
        playerEmbed.addField('Player IDs:', `${[Player1.user.id, Player2.user.id].join('&')}`);
    }
    
    if(activePlayer === 0)
    {
        if(won === 0)
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
        else if(won === 1)
        {
            if(!Player1.user)
            {
                playerEmbed.addField('Player who won: ', Player1.displayName)
            }
            else
            {
                playerEmbed.addField('Player who won: ', Player1.user.username)
            }
        }
    }
    else
    {
        if(won === 0)
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
        else if(won === 2)
        {
            playerEmbed.addField('Player who won: ', Player2.displayName)
        }
    }
    playerEmbed.addField('Game:', `3 Won`);

    const rows = [];

    for(let i = 0; i < fields.length; ++i)
    {
        const row = new button.MessageActionRow();
        for(let j = 0; j < fields[i].length; ++j)
        {
            const btn = new button.MessageButton()
            .setID(`${i}:${j}`)
            .setStyle(fields[i][j].style)
            .setLabel(fields[i][j].character)
            .setDisabled(fields[i][j].Disabled);

            row.addComponent(btn);
        }
        rows.push(row);
    }
    
    msg.channel.send({embed: playerEmbed,components: rows});
}

module.exports = {
    handleClick: threeClick,
    threeWon: threeWonGame,
    delGame: deleteGameData
}