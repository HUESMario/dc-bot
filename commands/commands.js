const help = require('./help/help.js');
const setRPC = require('./Admin/setRPC.js');
const deposit = require('./Game/deposit.js');
exports.module = {
    help: { 
        help: help.module.run
    },
    Admin: {
        setRolePlayChannel: setRPC.module.setRolePlayChannel
    },
    Game: {
        deposit: deposit.module.deposit
    }
    
}