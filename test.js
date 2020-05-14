var sinon = require('sinon');
const assert = require('assert');
const rewire = require("rewire");

// test private functions
const index = rewire("./index");  
const rollDice = index.__get__("rollDice");
const isRoll = index.__get__("isRoll");
const isSpell = index.__get__("isSpell");

// Stub out Math.random so it always returns '1'
sinon.stub(Math, 'random').returns(.99);

describe('diceRoll()', function() {
    var tests = [
        {name: "one dice", arg: "!3d", expected: "60 (20/20, 20/20, 20/20)"},
        {name: "two dice", arg: "!2d6 + d4", expected: "16 (6/6, 6/6, 4/4)"},
        {name: "three dice", arg: "!2d6 + 2d100 + d", expected: "232 (6/6, 6/6, 100/100, 100/100, 20/20)"},
        {name: "extra spaces", arg: "!  2d6  +  2d100  +  d", expected: "232 (6/6, 6/6, 100/100, 100/100, 20/20)"},
        {name: "no spaces", arg: "!2d6+d4", expected: "16 (6/6, 6/6, 4/4)"},
        {name: "just spaces", arg: "!2d6 d4", expected: "16 (6/6, 6/6, 4/4)"},
        {name: "mix spaces", arg: "!2d6 + 2d100 d", expected: "232 (6/6, 6/6, 100/100, 100/100, 20/20)"},
        {name: "modifier space", arg: "!2d6 + 2d100 d 4", expected: "236 (6/6, 6/6, 100/100, 100/100, 20/20, +4)"},
        {name: "modifier plus", arg: "!2d6 + 2d100 d + 4", expected: "236 (6/6, 6/6, 100/100, 100/100, 20/20, +4)"},
        {name: "modifier middle", arg: "!2d6 + 3 2d100 d + 4", expected: "239 (6/6, 6/6, +3, 100/100, 100/100, 20/20, +4)"},
    ];
    tests.forEach(function(test) {
        it(test.name, function() {
            assert.equal(rollDice(test.arg), test.expected)
        }); 
    });
});

describe('isRoll()', function() {
    var tests = [
        {arg: "!d", expected: true},
        {arg: "!k", expected: false},
        {arg: "!2d6 + 2d100 + d", expected: true},
        {arg: "!2d6 + 2d100 d", expected: true},
        {arg: "!2 d6", expected: false},
        {arg: "!3d0", expected: false},
        {arg: "!d + 4", expected: true},
    ];
    tests.forEach(function(test) {
        it("regex " + test.arg + " " + test.expected, function() {
            assert.equal(isRoll(test.arg), test.expected)
        }); 
    });
});

describe('isSpell()', function() {
    var tests = [
        {arg: "!d", expected: false},
        {arg: "!spell firebolt", expected: true},
    ];
    tests.forEach(function(test) {
        it("regex " + test.arg + " " + test.expected, function() {
            assert.equal(isSpell(test.arg), test.expected)
        }); 
    });
});