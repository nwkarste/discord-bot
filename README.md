# discord-bot

## Setup instructions

* Creating a bot app in discord https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
* Instructions for creating the bot and deploying to heroku https://github.com/synicalsyntax/discord.js-heroku
* Another set of instructions specific to discord bot defining https://medium.com/@renesansz/tutorial-creating-a-simple-discord-bot-9465a2764dc0
* Getting discord bot token in heroku https://devcenter.heroku.com/articles/config-vars

## Using the bot

### Dice

* Trigger with !(number of dice)d(size of dice)
```
!2d6
nwkarste rolled 11 (6/6, 5/6)
```

* number of dice defaults to 1
```
!d12
nwkarste rolled 3 (3/12)
```

* dice defaults to d20
```
!d
nwkarste rolled 11 (11/20)
```

* adding a modifier
```
!d + 4
nwkarste rolled 6 (2/20, +4)
```

* include additional dice with either ' ' or '+'
```
!d d4
!d+d4
!d + d4
```

### Spells
* lookup a spell by messaging !spell (spell name)
```
!spell feather fall
{
    "name": "Feather Fall",
    "desc": "Choose up to five falling creatures within range. A falling creature’s rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature.",
    "page": "phb 239",
    "range": "60 feet",
    "components": "V, M",
    "material": "A small feather or a piece of down.",
    "ritual": "no",
    "duration": "1 minute",
    "concentration": "no",
    "casting_time": "1 reaction",
    "level": "1st-level",
    "school": "Transmutation",
    "class": "Bard, Sorcerer, Wizard"
}
```

* matches from the start of the spell

## Unit tests
Run them with mocha

### Install mocha
```
npm install --global mocha
```

### Running mocha tests
```
mocha
```

## ToDo
* Continuous integration
* auto deploy on github merge
