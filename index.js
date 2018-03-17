var Discord = require('discord.io');
var logger = require('winston');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

function randomNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

// Initialize Discord Bot
var bot = new Discord.Client({
   token: process.env.BOT_TOKEN,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    var patt = /^! *[0-9]{0,2}d[0-9]{0,3}( +[0-9]{0,2}d[0-9]{0,3}){0,2}$/;
    if (message.match(patt)) {

        var args = message.substring(1).split(' ');
        var cmd = args[0];

        var dice = message.substring(1).match(/\S+/g);
        var diceLength = dice.length;
        var totalRoll = 0;
        var combinedRolls = " (";
        for (var i = 0; i < diceLength; i++) {
            rolls = dice[i].split('d');
            var total_rolls;
            if (rolls[0]) {
                total_rolls = rolls[0];
            }
            else {
                total_rolls = 1;
            }
            var dice_max;
            if (rolls[1]) {
                dice_max = rolls[1];
            }
            else {
                dice_max = 20;
            }
            for (var j = 0; j < total_rolls; j++) {
                var roll = randomNum(dice_max);
                totalRoll += roll;
                combinedRolls += roll + "/" + dice_max + ", ";
            }
        }
        var fullMessage = user + " rolled\n" + totalRoll + combinedRolls.substring(0, combinedRolls.length - 2) + ")";
        bot.sendMessage({
            to: channelID,
            message: fullMessage
        });
     }
});
