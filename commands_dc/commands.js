//Help
const help = require('./help/help.js');
const invite = require('./help/invite.js');
const source = require('./help/source.js')
//Admin
//Games
const TTT = require('./_Game/TTT.js');
const threeWon = require('./_Game/3 won.js');
const hangman = require('./_Game/hangman.js');
//rg Global
const global = require('./globalChat/globalChat.js');
//news
const twitter = require('./news/twitter.js');

module.exports = {
    /**
     * get help for commands, invitation of this Bot or the Source Code.
     */
    help: { 
        help: help.run,
        invite: invite.run,
        source: source.run
    },
    /**
     * Maybe I add here some important stuff in the Future.
     */
    Admin: {
    },
    /**
     * Most important Part for this Bot, the freaking good Games!
     */
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
    /**
     * Second most important Part of this Bot, globalChat aka rg!Chat
     * I'd love to talk to you^^
     */
    global:
    {
        delGlobal: global.delGlobal,
        setGlobal: global.setGlobal,
        globalChat: global.global
    },
    /**
     * Get News from twitter for some Topics
     */
    news:
    {
        twitter:
        {
            run: twitter
        }
    }
}