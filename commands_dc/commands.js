//Help
const help = require('./help/help.js');
const source = require('./help/source.js')
//Admin
const setRPC = require('./Admin/setRPC.js');
//Games
const deposit = require('./_Game/deposit.js');
const TTT = require('./_Game/TTT.js');
//Different
const getHappy = require('./lol.js');

exports.module = {
    help: { 
        help: help.module.run,
        source: source.module.run
    },
    Admin: {
        setRolePlayChannel: setRPC.module.setRolePlayChannel
    },
    Game: {
        TTT: {
            run: TTT.module.TTT,
            handleClick: TTT.module.handleClick
        },
        deposit: deposit.module.deposit
    },
    Different:
    {
        getHappy: getHappy.module.getHappy
    }
    
}