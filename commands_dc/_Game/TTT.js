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

const TTT = async(msg, discord) => {
    msgCopy = msg;
    const data = require('./_data/games.json');
    Player1 = msg.Player1;
    Player2 = msg.Player2;
    Player1.userID = Player1.user.id;
    Player2.userID = Player2.user.id;
    activePlayer = 0;
    fields = [
        [{character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}], 
        [{character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}], 
        [{character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}, {character: " ", style: 2, Disabled: false}]
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
    saveGameData(joinedIDs, data);

}

const handleTTT = async (handleData) => {
    const isCorrectPlayer = async () => {
        const splitedUser = tools.module.splitIDs(handleData.message.content);
        const clickedUser = async () => {
            return await handleData.clicker;
        }
        const getObject = await clickedUser();
        if(splitedUser[0] === await getObject.user.id || splitedUser[1] === await getObject.user.id)
        {
            return true;
        }
        return false;
    }
    const isCurrentPlayer = async () => {
        const splitedUser = tools.module.splitIDs(handleData.message.content);
        const clickedUser = async () => {
            return await handleData.clicker;
        }
        const getObject = await clickedUser();
        if(splitedUser[activePlayer] === await getObject.user.id)
        {
            return true;
        }
        return false;
    }
    const connectedID = tools.module.extractID(handleData.message);
    const data = JSON.parse(fs.readFileSync('./commands_dc/_Game/_data/games.json', 'utf-8'))
    getGameData(connectedID, data);
    if(await isCorrectPlayer())
    {
        if(await isCurrentPlayer())
        {
            changeField(handleData);
            if(checkForWin(handleData.message.components) || !isTherePlace())
            {
                gameEnd();
                getPlayfield(handleData)
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
        else if(!await isCurrentPlayer())
        {
            handleData.channel.send("It's not your Turn.");
        }
    }
    else if(!await isCorrectPlayer())
    {
        handleData.channel.send("You aren't the one who was challenged or challenging.");
    }
}

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

const getGameData = (connectedIDs, getData) => {
    fields = getData[connectedIDs]["fields"];
    activePlayer = getData[connectedIDs]["activePlayer"];
    Player1 = getData[connectedIDs]["Player1"];
    Player2 = getData[connectedIDs]["Player2"];
}

const deleteGameData =  (connectedID, getData) => {
    delete getData[connectedID];
    fs.writeFileSync('./commands_dc/_Game/_data/games.json', JSON.stringify(getData), (err) => {
        if(err) throw err;
    });
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
        if(msg.components !== undefined)
        {
            msg.channel.send(`${[Player1.userID, Player2.userID].join('&')}`, {components: [row1, row2, row3]})
        }
        else
        {
            msg.channel.send(`${msg.message.content}`, {components: [row1, row2, row3]});
        }
    }
    else if(activePlayer === 1)
    {
        if(msg.components !== undefined)
        {
            msg.channel.send(`${[Player1.userID, Player2.userID].join('&')}`, {components: [row1, row2, row3]})
        }
        else
        {
            msg.channel.send(`${msg.message.content}`, {components: [row1, row2, row3]});
        }
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
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
}

const changeField = (button) => {
    const getIndexes = tools.module.extractPos(button.id)
    fields[getIndexes[0]][getIndexes[1]].character = playerChars[activePlayer][0]; 
    fields[getIndexes[0]][getIndexes[1]].style = playerChars[activePlayer][1]; 
}

exports.module = {
    TTT: TTT,
    handleClick: handleTTT
}