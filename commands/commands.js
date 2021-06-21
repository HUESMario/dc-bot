//Help
const help = require('./help/help.js');
const source = require('./help/source.js')
//Admin
const setRPC = require('./Admin/setRPC.js');
//Games
const deposit = require('./Game/deposit.js');
const TTT = require('./Game/TTT.js');

exports.module = {
    help: { 
        help: help.module.run,
        source: source.module.run
    },
    Admin: {
        setRolePlayChannel: setRPC.module.setRolePlayChannel
    },
    Game: {
        TTT: TTT.module.TTT,
        deposit: deposit.module.deposit
    }
    
}