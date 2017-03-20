/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var log = console.log.bind(console);

function randomNum (min, max) {
    return Math.ceil(Math.random() * max) || min;
}

function Player (element) {
    this.currentRoundScore = 0;
    this.totalScore = 0;
    this.active = false;
    this.element = element;
    this.currentRoundScoreElm = 
        element.querySelector('.player-current-box .player-current-score');
    this.totalScoreElm = element.querySelector('.player-score');
    this.refresh();
}

// Static (non-changing) constants
Player.activeClassName = 'active';
Player.maxScore = 100;

Player.prototype.reset = function () {
    this.totalScore = 0;
    this.currentRoundScore = 0;
    this.active = false;
    return this.refrehs();
};

Player.prototype.refresh = function () {
    this.currentRoundScoreElm.textContent = this.currentRoundScore;
    this.totalScoreElm.textContent = this.totalScore;
    this.element.classList.toggle(Player.activeClassName, this.active);
    return this;
};

function Dice (element) {
    this.minNum = 1;
    this.maxNum = 6;
    this.element = element;
    this.currentNum = 0;
    this.roll();
}

Dice.prototype.roll = function () {
    this.currentNum = randomNum(this.minNum, this.maxNum);
    return this.refresh();
};

Dice.prototype.refresh = function () {
    this.element.src = 'dice-' + this.currentNum + '.png';
    return this;
};

function fetchGameDOMElements (doc) {
    var wrapper = doc.querySelector('.wrapper');
    return {
        wrapper: wrapper,
        newGameBtn: wrapper.querySelector('.btn-new'),
        rollDiceBtn: wrapper.querySelector('.btn-roll'),
        holdBtn: wrapper.querySelector('.btn-hold'),
        player1View: wrapper.querySelector('.player-0-panel'),
        player2View: wrapper.querySelector('.player-1-panel'),
        diceImg: wrapper.querySelector('.dice')
    };
}

function DiceGame (doc) {
    var ui = this.ui = fetchGameDOMElements(doc);
    this.player1 = new Player(ui.player1View);
    this.player2 = new Player(ui.player2View);
    this.dice = new Dice(ui.diceImg);
    this.currentPlayer = null;
    this.addEventListeners(this.player1, this.player2, this.dice)
        .setActivePlayerRandomly()
        .refresh();
    log('New game started');
}

DiceGame.prototype.addEventListeners = function (player1, player2, dice) {
    var self = this;
    this.ui.newGameBtn.addEventListener('click', function (e) {
        log('New game btn clicked');
        player1.reset();
        player2.reset();
        dice.roll();
    });
    
    this.ui.rollDiceBtn.addEventListener('click', function (e) {
        log('Roll Dice Btn');
        self.rollDice();
    });
    
    this.ui.holdBtn.addEventListener('click', function (e) {
        self.toggleActivePlayer()
            .refresh();
        log('Hold Btn');
    });
    
    return this;
};

DiceGame.prototype.rollDice = function () {
    this.currentPlayer.currentRoundScore += this.dice.roll().currentNum;
    return this.refresh();
};

DiceGame.prototype.refresh = function () {
    this.player1.refresh();
    this.player2.refresh();
    this.dice.refresh();
    return this;
};

DiceGame.prototype.toggleActivePlayer = function () {
    if (this.player1.active) {
        this.currentPlayer = this.player2;
        this.player2.active = true;
        this.player1.active = false;
    }
    else {
        this.currentPlayer = this.player1;
        this.player1.active = true;
        this.player2.active = false;
    }
    return this;
};

DiceGame.prototype.setActivePlayerRandomly = function () {
    if (Math.round(Math.random())) {
        this.currentPlayer = this.player1;
        this.player1.active = true;
        this.player2.active = false;
    }
    else {
        this.currentPlayer = this.player2;
        this.player2.active = true;
        this.player1.active = false;
    }
    return this;
};

function main () {
    new DiceGame(document);
}

window.addEventListener('load', main);
