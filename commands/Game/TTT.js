const data = require('./data/games.json');
const fs = require('fs');
const TTT = (msg, discord) => {
    const Gameinfo = data;
    console.log(Gameinfo);
    Gameinfo.test = "Hello World";
    console.log(Gameinfo);

    fs.writeFile('./commands/Game/data/games.json', JSON.stringify(Gameinfo), (err) => {
        if(err) throw err;
    })
}

exports.module = {
    TTT: TTT
}