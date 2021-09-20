`use Strict`

const discord = require('discord.js');
const fs = require('fs');
const tools = require('../../tools/tools.js');
let Player1;
let Player2;
let activePlayer = 0;
const playerChars = [[' ', 'PRIMARY'], [' ', 'SUCCESS']];
let won = 0;

let fields;

/**
 * @param {discord.Message} msg to get `Player`, `Opponent`, `Channel` and `Guild` 
 */
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

/**
 * Computes click on Button and sends it to the Channel.
 * @param {discord.Interaction} button get `Player`, `Opponent`, `Channel`, `Guild` and `Playfield` 
 */
const threeClick = async (button) => 
{
    const clickUser = button.member;
    const idsOfPlayers = tools.module.splitIDs(button.message.embeds[0].fields[0].value);
    const idsOfPlayersConnected = tools.module.extractID(button.message.embeds[0].fields[0]);
    
    const data = JSON.parse(fs.readFileSync('./commands_dc/_Game/_data/3Won.json', (err) => {console.log(err)}));
    loadGameData(idsOfPlayersConnected, data);
    const ids = tools.module.extractPos(button.component.customId);
    button.message.button = button.button;

    if(idsOfPlayers[activePlayer] === clickUser.id)
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
    else 
    {
        button.message.channel.send("It's either not your turn or you're not participating.");
    }
}
/**
 * Start the Game and reset `won`, `fields` and `activePlayer`
 */
const initializeField = () => {
    activePlayer = 0;
    won = 0;
    fields = [
        [{character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}], 
        [{character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}], 
        [{character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}],
        [{character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}], 
        [{character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}, {character: " ", style: 'SECONDARY', Disabled: true}]
    ];
}

/**
 * Checks if someone won the Game
 * @param {discord.Message} msg 
 * @returns {null} null
 */
const checkForWin = (msg) => {
    for(let row = 0; row < fields.length; ++row)
    {
        for(let column = 0; column < fields[row].length; ++column)
        {
            if(fields[row][column].style !== 'SUCCESS')
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
                                if(fields[row + 2][column].style === 'PRIMARY')
                                {
                                    disableAll();
                                    fields[row][column].style = 'DANGER';
                                    fields[row + 1][column].style = 'DANGER';
                                    fields[row + 2][column].style = 'DANGER';
                                    getPlayfield(msg);
                                    won = 1;
                                }
                                else if(fields[row + 2][column].style === 'SUCCESS')
                                {
                                    disableAll();
                                    fields[row][column].style = 'DANGER';
                                    fields[row + 1][column].style = 'DANGER';
                                    fields[row + 2][column].style = 'DANGER';
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
                                        if(fields[row + 2][column + 2].style === 'PRIMARY')
                                        {
                                            disableAll();
                                            fields[row][column].style = 'DANGER';
                                            fields[row + 1][column + 1].style = 'DANGER';
                                            fields[row + 2][column + 2].style = 'DANGER';
                                            getPlayfield(msg);
                                            won = 1;
                                        }
                                        else if(fields[row + 2][column + 2].style === 'SUCCESS')
                                        {
                                            disableAll();
                                            fields[row][column].style = 'DANGER';
                                            fields[row + 1][column + 1].style = 'DANGER';
                                            fields[row + 1][column + 2].style = 'DANGER';
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
                                        if(fields[row + 2][column - 2].style === 'PRIMARY')
                                        {
                                            disableAll();
                                            fields[row][column].style = 'DANGER';
                                            fields[row + 1][column - 1].style = 'DANGER';
                                            fields[row + 2][column - 2].style = 'DANGER';
                                            getPlayfield(msg)
                                            won = 1;
                                        }
                                        else if(fields[row + 2][column - 2].style === 'SUCCESS')
                                        {
                                            disableAll();
                                            fields[row][column].style = 'DANGER';
                                            fields[row + 1][column - 1].style = 'DANGER';
                                            fields[row + 2][column - 2].style = 'DANGER';
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
                                if(fields[row][column + 2].style === 'PRIMARY')
                                {
                                    disableAll();
                                    fields[row][column].style = 'DANGER';
                                    fields[row][column + 1].style = 'DANGER';
                                    fields[row][column + 2].style = 'DANGER';
                                    getPlayfield(msg);
                                    won = 1;
                                }
                                else if(fields[row][column + 2].style === 'SUCCESS')
                                {
                                    disableAll();
                                    fields[row][column].style = 'DANGER';
                                    fields[row][column + 1].style = 'DANGER';
                                    fields[row][column + 2].style = 'DANGER';
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

/**
 * Disable all fields on the Playground, to Prepare the computation from `computePlayfield()`
 */
const disableAll = () => {
    for(let i = 0; i < fields.length; ++i)
    {
        for(let j = 0; j < fields[i].length; ++j)
        {
            fields[i][j].Disabled = true;
        }
    }
}
/**
 * Computes all Active Fields
 */
const computePlayfield = () => {
    for(let i = fields.length - 1; i >= 0; --i)
    {
        for(let j = 0; j < fields[i].length; ++j)
        {
            if(fields[i][j].style === 'SECONDARY')
            {
               if(fields[i + 1] === undefined || fields[i + 1][j].style !== 'SECONDARY')
               {
                   fields[i][j].Disabled = false;
               }
            }
        }
    }
}


/**
 * Switchs the active Player
 * @returns {null}
 */
const switchPlayer = () => activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;


/**
 * Saves the current Game Data
 * @param {string} connectedID string ID from player 1 and 2 joined with an '&'
 * @param {object} data Game Data stored in ./commands_dc/_Game/_data/3Won.json
 */
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

/**
 * Loads Game of Players
 * @param {string} connectedIDs string ID from player 1 and 2 joined with an '&'
 * @param {object} getData Game Data stored in ./commands_dc/_Game/_data/3Won.json
 */
const loadGameData = (connectedIDs, getData) => {
    fields = getData[connectedIDs]["fields"];
    activePlayer = getData[connectedIDs]["activePlayer"];
    Player1 = getData[connectedIDs]["Player1"];
    Player2 = getData[connectedIDs]["Player2"];
}

/**
 * Deletes Game of Players
 * @param {string} connectedID string ID from player 1 and 2 joined with an '&'
 * @param {object} getData Game Data stored in ./commands_dc/_Game/_data/3Won.json
 */
const deleteGameData = (connectedID, getData) => {
    delete getData[connectedID];
    fs.writeFileSync('./commands_dc/_Game/_data/3Won.json', JSON.stringify(getData), (err) => {
        if(err) throw err;
    });
}


/**
 * Constructs and sends Playground to Channel where Button were Clicked or Message was sent.
 * @param {discord.Message | discord.Interaction} msg get `IDs`, `Names`, `Channel`, `Guild` and ( if interaction ) `Playground`
 */
const getPlayfield = (msg) => {
    const playerEmbed = new discord.MessageEmbed();

    if(!Player1.user)
    {
        playerEmbed.addField('Player IDs:', `${[Player1.userId, Player2.userId].join('&')}`);
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
        const row = new discord.MessageActionRow();
        for(let j = 0; j < fields[i].length; ++j)
        {
            const btn = new discord.MessageButton()
            .setCustomId(`${i}:${j}`)
            .setStyle(fields[i][j].style)
            .setLabel(fields[i][j].character)
            .setDisabled(fields[i][j].Disabled);

            if(fields[i][j].style !== 'SECONDARY') console.log(fields[i][j].style);
            row.addComponents(btn);
        }
        rows.push(row);
    }
    
    msg.channel.send({embeds: [playerEmbed], components: [rows[0], rows[1], rows[2], rows[3], rows[4]]});
}

module.exports = {
    handleClick: threeClick,
    threeWon: threeWonGame,
    delGame: deleteGameData
}