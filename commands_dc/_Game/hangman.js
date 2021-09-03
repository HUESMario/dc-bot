let word;
let remainigFails = 8;
let usedLetters = [];
let wrongLetters = [];
let rightLetters = [];
let error;
let output;
let errorCode;

const fs = require('fs');
let db = require(`./hangman/words/en-us.json`);
let pics = require('./hangman/hangarts.json');
let words = db.words;

const startGame = (msg) => {
	output = "";
	const activeGames = JSON.parse(fs.readFileSync('./commands_dc/_Game/_data/hangman.json'));
	word = words[parseInt((Math.random() * (words.length - 1) + 1).toFixed(0))];
	if(!activeGames[msg.guild.id])
	{
		activeGames[msg.guild.id] = {}
		if(!activeGames[msg.guild.id][msg.author.id])
		{
			activeGames[msg.guild.id][msg.author.id] = {}
			activeGames[msg.guild.id][msg.author.id].toGuess = word;
			activeGames[msg.guild.id][msg.author.id].usedLetters = usedLetters;
			activeGames[msg.guild.id][msg.author.id].wrongLetters = wrongLetters;
			activeGames[msg.guild.id][msg.author.id].rightLetters = rightLetters;
			activeGames[msg.guild.id][msg.author.id].remainigFails = remainigFails;
		}
	}
	fs.writeFileSync('./commands_dc/_Game/_data/hangman.json', JSON.stringify(activeGames), (err)=>{
		console.log(err);
	});
	output += pics[remainigFails];
	output += computeOutput();
	output += `\nword Length: ${word.length}`;

	msg.channel.send(output);
}

const computeOutput = (letter = null) => {
	let output = "\n\n";
	if(letter === null)
	{
		for(let wordL = 0; wordL < word.length; ++wordL)
		{
			output += "-";
		}
	}
	else if(typeof(letter) === "string")
	{
		let isCorrectLetter = false;
		for(let i = 0; i < word.length; ++i)
		{
			if(word.split('')[i] === letter)
			{
				output += letter;
				usedLetters.push(letter);
				rightLetters.push(letter);
				correctLetters = true;
			}
			else if(word.split('')[i] !== letter)
			{
				output += "-";
			}
		}
		if(!isCorrectLetter)
		{
			usedLetters.push(letter);
			wrongLetters.push(letter);
		}

	}
	return output;
}

const typeLetter = (msg) => {
	error = "";
	errorCode = "0";
	output = "";
	const data = ('./commands_dc/_Game/_data/hangman.json', JSON.stringify(activeGames), (err)=>{
		console.log(err);
	});
	if(data[msg.guild.id][msg.author.id])
	{
		checkForCorrectFormat( msg.content.split(" ")[1].toLowerCase() )
		if(parseInt(errorCode) === 0)
		{
			output += pics[remainigFails];
			output += computeOutput(msg.content.split(" ")[1].toLowerCase());
			output += `\nword Length: ${word.length}`;
		}
		else if(parseInt(errorCode) > 0)
		{
			msg.channel.send(`errorCode: ${errorCode}, errors:
			${error}`)
		}
	}
	msg.channel.send(output)
}

const checkForCorrectFormat = ( letter ) => {
	if(letter.length > 1)
	{
		errorCode += "1";
		error += "You entered more then one Letter\n";
	}
	if( !isNaN( Number( letter ) ) )
	{
		errorCode += "2";
		error += "\t\tYou entered a Number\n";
	}
	//check for Symbols
	if( /[$-/:-?{-~!"^_`\[\]]/.test( letter ) )
	{
		errorCode += "3";
		error += "\t\tYou entered an Symbol.\n";
	}
}

module.exports = {
	startGame: startGame,
	checkLetter: typeLetter
}