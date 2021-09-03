//Help
const help = require('./help/help.js');
const source = require('./help/source.js')
//Admin
//Games
const TTT = require('./_Game/TTT.js');
const threeWon = require('./_Game/3 won.js');
//rg Global
const global = require('./globalChat/globalChat.js');
const { handleClick } = require('./_Game/3 won.js');
const hangman = require('./_Game/hangman.js');

module.exports = {
    help: { 
        help: help.run,
        source: source.run
    },
    Admin: {
    },
    Game: {
        TTT: {
            run: TTT.TTT,
            handleClick: TTT.handleClick
        },
        threeWon:
        {
            run: threeWon.threeWon,
            handleClick: threeWon.handleClick
        },
        hangman: {
            startGame: hangman.startGame,
            checkLetter: hangman.checkLetter
        }
    },
    global:
    {
        delGlobal: global.delGlobal,
        setGlobal: global.setGlobal,
        globalChat: global.global
    }
    
}