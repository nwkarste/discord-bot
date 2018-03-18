var bs = require('binarysearch');
var Discord = require('discord.io');
var logger = require('winston');
var env = require('./env');
var spells = require('./spells.json');
var util = require('util');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

function randomNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

function binaryIndexOf(spellBook, searchElement) {
    var minIndex = 0;
    var maxIndex = spellBook.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = spellBook[currentIndex];
        currentSpell = currentElement.name.toString().toLowerCase();
        logger.info(currentSpell);

        if (currentSpell.indexOf(searchElement) === 0) {
            return currentIndex;
        }
        else if (currentSpell < searchElement) {
            minIndex = currentIndex + 1;
        }
        else {
            maxIndex = currentIndex - 1;
        }
    }

    return -1;
}

function spellMatch(spellBook, spell) {
    currentSpell = spellBook.name.toLowerCase();
    return currentSpell.indexOf(spell.toLowerCase()) === 0;
}

// Initialize Discord Bot
var bot = new Discord.Client({
   token: env.TOKEN,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) === '!') {
        var pattTemp = '[0-9]{0,2}d[0-9]{0,3}';
        var pattDice = util.format('^! *%s( +%s){0,10}$', pattTemp, pattTemp)
        var pattSpell = '^! *spell .*$';
        if (message.match(RegExp(pattDice))) {
            var args = message.substring(1).split(' ');
            var cmd = args[0];

            var dice = message.substring(1).match(/\S+/g);
            var diceLength = dice.length;
            var totalRoll = 0;
            var combinedRolls = " (";
            for (var i = 0; i < diceLength; i++) {
                rolls = dice[i].split('d');
                var totalRolls;
                if (rolls[0]) {
                    totalRolls = rolls[0];
                }
                else {
                    totalRolls = 1;
                }
                var diceMax;
                if (rolls[1]) {
                    diceMax = rolls[1];
                }
                else {
                    diceMax = 20;
                }
                for (var j = 0; j < totalRolls; j++) {
                    var roll = randomNum(diceMax);
                    totalRoll += roll;
                    combinedRolls += roll + '/' + diceMax + ', ';
                }
            }
            var fullMessage = user + " rolled\n" + totalRoll + combinedRolls.substring(0, combinedRolls.length - 2) + ')';
            bot.sendMessage({
                to: channelID,
                message: fullMessage
            });
        }
        else if (message.match(RegExp(pattSpell))){
            var spellName = message.substring(message.indexOf("spell ") + 6);
            var fullMessage;
            spellName = spellName.toLowerCase();
            var spellIndex = binaryIndexOf(spells, spellName);
            if (spellIndex === -1) {
               fullMessage = "Could not find a spell with that name";
            }
            else {
                fullMessage = JSON.stringify(spells[spellIndex],null,4)
                fullMessage = fullMessage.replace(/\\\\n/g, "\n")
            }
            bot.sendMessage({
                to: channelID,
                message: fullMessage
            });
        }
    }
});
