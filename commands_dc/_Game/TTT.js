`strict mode`

let activePlayer = 0;
const playerChars = [['X', 1], ['O', 3]];
const fs = require('fs');
const tools = require('../../tools/tools.js');
const discord = require('discord.js');
let Player1;
let Player2;

const solutions = [
    [["0:0"], ["0:1"], ["0:2"], 0], [["1:0"],["1:1"],["1:2"], 1], [["2:0"], ["2:1"], ["2:2"], 2], 
    [["0:0"], ["1:0"], ["2:0"], 3], [["0:1"], ["1:1"], ["2:1"], 4], [["0:2"], ["1:2"], ["2:2"], 5],
    [["0:0"], ["1:1"], ["2:2"], 6], [["0:2"], ["1:1"], ["2:0"], 7]
]

let fields = [
    [{character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}], 
    [{character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}], 
    [{character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}]
]

/**
 * initialise TTT Game
 * Checks for correct Opponnent, if there is an Game already 
 * and Sends Playfield.
 * @param {discord.Message} msg get Player `Names`, `IDs`, `Channel`, `Guild`
 * @returns {void}
 */
const TTT = async(msg) => {
    const data = JSON.parse(fs.readFileSync('./commands_dc/_Game/_data/TTT.json'));
    Player1 = msg.Player1;
    Player2 = msg.Player2;
    Player1.userID = Player1.user.id;
    Player2.userID = Player2.user.id;

    if(Player1.userID === Player2.userID)
    {
        const embed = new discord.MessageEmbed()
        .setColor(msg.color)
        .setTitle(`roleing in the Game - Tic Tac Toe`)
        .setAuthor(msg.author.username)
        .addFields({name: "> TTT", value: `Lonely? Choose one to Play with you ^^!`})
        .setFooter(msg.guild.name, msg.guild.iconURL())

        msg.channel.send({embeds: [embed]});
        return;
    }
    activePlayer = 0;
    fields = [
        [{character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}], 
        [{character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}], 
        [{character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}, {character: " ", style: 'SECONDARY', Disabled: false}]
    ]

    const joinedIDs = tools.module.connectIDs(Player1.id, Player2.id);
    let newGame = {};
    if(data[joinedIDs] === undefined)
    {
        newGame[joinedIDs] = {}
        newGame[joinedIDs] = {
            "Player1": Player1,
            "Player2": Player2,
            "fields": fields,
            "activePlayer": activePlayer
        }
        getPlayfield(msg);
        saveGameData(joinedIDs, data);
    }
    else if(data[joinedIDs] !== undefined)
    {
        const embed = new discord.MessageEmbed()
        .setColor(msg.color)
        .setTitle(`roleing in the Game - Tic Tac Toe`)
        .setAuthor(msg.author.username)
        .addFields({name: "> TTT", value: `You two already have a Game, I'll load it for you.`})
        .setFooter(msg.guild.name, msg.guild.iconURL())

        msg.channel.send({embeds: [embed]});
        getGameData(joinedIDs, data);
        getPlayfield(msg);        
    }

}

/**
 * Checks if Correct Player pressed Button, process Move and sends it to Channel.
 * @param {discord.Interaction} handleData get `Player` `Names`, `IDs`, `Channel`, `Guild`, `Playfield`
 */
const handleTTT = async (handleData) => {
    const isCorrectPlayer = () => {
        const splitedUser = tools.module.splitIDs(handleData.message.embeds[0].fields[0].value);
        const clickedUser = () => {
            return handleData.member;
        }
        const getObject = clickedUser();
        if(splitedUser[0] === getObject.id || splitedUser[1] === getObject.id)
        {
            return true;
        }
        return false;
    }
    const isCurrentPlayer = () => {
        const splitedUser = tools.module.splitIDs(handleData.message.embeds[0].fields[0].value);
        const clickedUser = () => {
            return handleData.member;
        }
        const getObject = clickedUser();
        if(splitedUser[activePlayer] === getObject.id)
        {
            return true;
        }
        return false;
    }
    const connectedID = tools.module.extractID(handleData.message.embeds[0].fields[0]);
    const data = JSON.parse(fs.readFileSync('./commands_dc/_Game/_data/ttt.json', 'utf-8'))
    getGameData(connectedID, data);
    if(isCorrectPlayer())
    {
        if(isCurrentPlayer())
        {
            changeField(handleData);
            if(checkForWin(fields) || !isTherePlace())
            {
                gameEnd();
                getPlayfield(handleData, true);
                deleteGameData(connectedID, data);
            }
            else
            {
                changePlayer(); 
                saveGameData(connectedID, data);
                getPlayfield(handleData)
            }
            handleData.message.delete();
        }
        else if(!isCurrentPlayer())
        {
            handleData.channel.send("It's not your Turn.");
        }
    }
    else if(!isCorrectPlayer())
    {
        handleData.channel.send("You aren't the one who was challenged or challenging.");
    }
}

/**
 * @returns {boolean} Checks for remaining Space.
 */
const isTherePlace = () => {
    for(let i = 0; i < fields.length; ++i)
    {
        for(let j = 0; j < fields[i].length; ++j)
        {
            if(fields[i][j].character === " ")
            {
                return true;
            }
        }
    }
    return false;
}

/**
 * if the Game End this function is called. It deletes the Game of Player 1 and 2, then sets every Field to Disabled so we can send the Playfield again.
 */
const gameEnd = () => {
    deleteGameData(Player1.userID, Player2.userID);
    for(let i = 0; i < fields.length; ++i)
    {
        for(let j = 0; j < fields[i].length; ++j)
        {
            fields[i][j].Disabled = true;
        }
    }
}
/**
 * Saves the current Game Data
 * @param {string} connectedID string ID from player 1 and 2 joined with an '&'
 * @param {object} data Game Data stored in ./commands_dc/_Game/_data/TTT.json
 */
const saveGameData = (connectedID, data) => {
    data[connectedID] = {};
    data[connectedID]["fields"] = fields;
    data[connectedID]["activePlayer"] = activePlayer;
    data[connectedID]["Player1"] = Player1;
    data[connectedID]["Player2"] = Player2;
    fs.writeFileSync('./commands_dc/_Game/_data/ttt.json', JSON.stringify(data), (err) => {
        if(err) throw err;
    })
}

/**
 * Loads Game of Players
 * @param {string} connectedIDs string ID from player 1 and 2 joined with an '&'
 * @param {object} getData Game Data stored in ./commands_dc/_Game/_data/TTT.json
 */
const getGameData = (connectedIDs, getData) => {
    fields = getData[connectedIDs]["fields"];
    activePlayer = getData[connectedIDs]["activePlayer"];
    Player1 = getData[connectedIDs]["Player1"];
    Player2 = getData[connectedIDs]["Player2"];
}

/**
 * Deletes Game of Players
 * @param {string} connectedID string ID from player 1 and 2 joined with an '&'
 * @param {object} getData Game Data stored in ./commands_dc/_Game/_data/TTT.json
 */
const deleteGameData = (connectedID, getData) => {
    delete getData[connectedID];
    fs.writeFileSync('./commands_dc/_Game/_data/ttt.json', JSON.stringify(getData), (err) => {
        if(err) throw err;
    });
}
/**
 * 
 * @param {discord.Message} msg get Player `Names`, `IDs`, `Channel`, `Guild`
 * @param {boolean} won get if someone already won to Check if we need to Send the Congrats.
 * @returns {discord.MessageActionRow[]} multiple Button Rows
 */
const getPlayfield = (msg, won = false) => {

    const playerEmbed = new discord.MessageEmbed();

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
    playerEmbed.addField('Game:', `Tic Tac Toe`);
    const upper_left = new discord.MessageButton()
    .setCustomId('0:0')
    .setStyle(fields[0][0].style)
    .setLabel(fields[0][0].character)
    .setDisabled(fields[0][0].Disabled);
    const upper_middle = new discord.MessageButton()
    .setCustomId('0:1')
    .setStyle(fields[0][1].style)
    .setLabel(fields[0][1].character)
    .setDisabled(fields[0][1].Disabled);
    const upper_right = new discord.MessageButton()
    .setCustomId('0:2')
    .setStyle(fields[0][2].style)
    .setLabel(fields[0][2].character)
    .setDisabled(fields[0][2].Disabled);

    const middle_left = new discord.MessageButton()
    .setCustomId('1:0')
    .setStyle(fields[1][0].style)
    .setLabel(fields[1][0].character)
    .setDisabled(fields[1][0].Disabled);
    const middle_middle = new discord.MessageButton()
    .setCustomId('1:1')
    .setStyle(fields[1][1].style)
    .setLabel(fields[1][1].character)
    .setDisabled(fields[1][1].Disabled);
    const middle_right = new discord.MessageButton()
    .setCustomId('1:2')
    .setStyle(fields[1][2].style)
    .setLabel(fields[1][2].character)
    .setDisabled(fields[1][2].Disabled);

    const buttom_left = new discord.MessageButton()
    .setCustomId('2:0')
    .setStyle(fields[2][0].style)
    .setLabel(fields[2][0].character)
    .setDisabled(fields[2][0].Disabled);
    const buttom_middle = new discord.MessageButton()
    .setCustomId('2:1')
    .setStyle(fields[2][1].style)
    .setLabel(fields[2][1].character)
    .setDisabled(fields[2][1].Disabled);
    const buttom_right = new discord.MessageButton()
    .setCustomId('2:2')
    .setStyle(fields[2][2].style)
    .setLabel(fields[2][2].character)
    .setDisabled(fields[2][2].Disabled);


    const row1 = new discord.MessageActionRow()
    .addComponents(upper_left, upper_middle, upper_right);

    const row2 = new discord.MessageActionRow()
    .addComponents(middle_left, middle_middle, middle_right);
    
    const row3 = new discord.MessageActionRow()
    .addComponents(buttom_left, buttom_middle, buttom_right);

    
    msg.channel.send({embeds: [playerEmbed],components: [row1, row2, row3]});
    return [row1, row2, row3]
}

/**
 * checks for Win of someone
 * @param {discord.MessageActionRow[]} componentsRows List of fields
 * @returns {boolean} if someone won or not
 */
const checkForWin = (componentsRows) => {
    let won = false;
    solutions.forEach(solution => {
        if(typeof(solution) !== 'number')
        {
            const position1 = tools.module.extractPos(solution[0]);
            const position2 = tools.module.extractPos(solution[1]);
            const position3 = tools.module.extractPos(solution[2]);
            let button1 = componentsRows[position1[0]][position1[1]];
            let button2 = componentsRows[position2[0]][position2[1]];
            let button3 = componentsRows[position3[0]][position3[1]];
            if(button1.character === playerChars[activePlayer][0] && button2.character === playerChars[activePlayer][0] && button3.character === playerChars[activePlayer][0])
            {
                fields[position1[0]][position1[1]].style = 'DANGER';
                fields[position2[0]][position2[1]].style = 'DANGER';
                fields[position3[0]][position3[1]].style = 'DANGER';
                won = true;
            }
        }
    });
    return won;
}
/**
 * change active Player.
 * @returns {null}
 */
const changePlayer = () => activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

/**
 * @param {discord.Interaction} button get components customId.
 */
const changeField = (button) => {
    const getIndexes = tools.module.extractPos(button.component.customId)
    fields[getIndexes[0]][getIndexes[1]].character = playerChars[activePlayer][0]; 
    fields[getIndexes[0]][getIndexes[1]].style = playerChars[activePlayer][1]; 
}
module.exports = {
    TTT: TTT,
    handleClick: handleTTT
}