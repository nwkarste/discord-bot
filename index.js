var bs = require('binarysearch');
var Discord = require('discord.io');
var winston = require('winston');
var env = require('./env');
var spells = require('./spells.json');
var util = require('util');


// Configure logger settings
winston.remove(winston.transports.Console);
winston.add(new winston.transports.Console, {
    colorize: true
});
winston.level = 'debug';

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

function isRoll(message) {
    var pattFirstDice = '[0-9]{0,2}d([1-9][0-9]{0,2})?';
    var pattNextDice = '[0-9]{0,2}(d|[0-9])([1-9][0-9]{0,2})?';
    var pattDice = util.format('^! *%s( *[ \+-] *%s){0,10}$', pattFirstDice, pattNextDice)
    val = message.match(RegExp(pattDice));
    return val != null
}

function isSpell(message) {
    var pattSpell = '^! *spell .*$';
    val = message.match(RegExp(pattSpell))
    return val != null
}

function rollDice(message) {
    var message = message.substring(1).replace(/\+/g, ' ');
    var message = message.replace('-', ' - ');
    var dice = message.match(/\S+/g);
    var diceLength = dice.length;
    var totalRoll = 0;
    var combinedRolls = " (";
    var subtractNext = false;
    for (var i = 0; i < diceLength; i++) {
        //check for constant modifier
        if (dice[i]=='-') {
            subtractNext = true;
        }
        else if (dice[i].indexOf('d') == -1) {
            if (subtractNext) {
                totalRoll -= parseInt(dice[i], 10);
                combinedRolls += '-' + dice[i] + ', ';
                subtractNext = false
            }
            else {
                totalRoll += parseInt(dice[i], 10);
                combinedRolls += '+' + dice[i] + ', ';
            }
       }
        else {
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
                if (subtractNext) {
                    totalRoll -= roll;
                    combinedRolls += '-' + roll + '/' + diceMax + ', ';
                }
                else {
                    totalRoll += roll;
                    combinedRolls += roll + '/' + diceMax + ', ';
                }
           }
           subtractNext = false
        }
    }
    var fullMessage = totalRoll + combinedRolls.substring(0, combinedRolls.length - 2) + ')';
    return fullMessage
}

// Initialize Discord Bot
var bot = new Discord.Client({
   token: env.TOKEN,
   autorun: true
});
bot.on('ready', function (evt) {
    winston.info('Connected');
    winston.info('Logged in as: ');
    winston.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) === '!') {
        if ( isRoll(message) ) {
            roll = rollDice(message);
            finalMessage = user + " rolled " + roll
            bot.sendMessage({
                to: channelID,
                message: finalMessage
            });
        }
        else if ( isSpell(message) ) {
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
