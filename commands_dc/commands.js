//Help
const help = require('./help/help.js');
const source = require('./help/source.js')
//Admin
//Games
const deposit = require('./_Game/deposit.js');
const TTT = require('./_Game/TTT.js');
//rg Global
const getHappy = require('./lol.js');
const global = require('./globalChat/globalChat.js');

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
        deposit: deposit.deposit
    },
    global:
    {
        setGlobal: global.setGlobal,
        globalChat: global.global
    }
    
}