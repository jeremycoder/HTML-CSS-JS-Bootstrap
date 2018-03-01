/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he wishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

//Game variables
var scores, roundScore, roundScore2, totalRoundScore, activePlayer;
var gameHighScore = 20;

//Game starting variables
init();

var diceDOM = document.querySelector('.dice');
diceDOM.style.display = 'none';

var diceDOM2 = document.querySelector('.dice-2');
diceDOM2.style.display = 'none';

var rollDice = document.querySelector('.btn-roll');
rollDice.addEventListener('click', rollDiceHandler, true);

//Hold button
var holdButton = document.querySelector('.btn-hold');
holdButton.addEventListener('click', holdButtonHandler, true);

//New Game Button
var newGameButton = document.querySelector('.btn-new');
newGameButton.addEventListener('click', newGameButtonHandler, true);

//Enter new high score
var gameWinningText = document.querySelector('.btn-game-text');
gameWinningText.textContent = gameHighScore;
var gameWinningButton = document.querySelector('.btn-game-btn');
var gameWinningInput = document.querySelector('.btn-game-btn');
gameWinningText.addEventListener('click', function(){
  gameWinningText.classList.toggle('hidden');
  gameWinningButton.classList.toggle('hidden');
  gameWinningInput.addEventListener('mouseleave', gameWinningInputHandler, true);
    
});

//Zero some elements out
function zeroOut(){
  document.querySelector('#current-0').textContent = '0';
  document.querySelector('#current-1').textContent = '0';  
  document.querySelector('.dice').style.display = 'none';
  document.querySelector('.dice-2').style.display = 'none';
  changeActivePlayer();
  roundScore = roundScore2 = totalRoundScore = 0;    
}

//Check winner
function checkWinner(){
    if(scores[activePlayer] >= gameHighScore){
        var playerName = document.getElementById('name-'+activePlayer);
        playerName.textContent = 'WINNER!';
        playerName.style.color = 'red';
        rollDice.removeEventListener('click', rollDiceHandler, true);
        holdButton.removeEventListener('click', holdButtonHandler, true);
        document.querySelector('.player-'+activePlayer+'-panel').classList.add('active');
        toggleActiveClass();
    }
}

function holdButtonHandler(){
  scores[activePlayer] += roundScore + roundScore2;
    document.getElementById('score-'+activePlayer).textContent = scores[activePlayer];
    checkWinner();
    zeroOut();    
}

function rollDiceHandler(){
  //1. Get random dice number
  var diceNumber = Math.floor(Math.random()*6)+1;
  var diceNumber2 = Math.floor(Math.random()*6)+1;
    
  
    
  //2. Display number
  //Add score from dice 1
  roundScore += diceNumber;
  diceDOM.style.display = 'block';
  diceDOM.src = 'dice-' + diceNumber + '.png'; 
  
  //Add score from dice 2
  roundScore2 += diceNumber2;
  diceDOM2.style.display = 'block';
  diceDOM2.src = 'dice-' + diceNumber2 + '.png';
    
  //Add scores from both dice
  totalRoundScore = roundScore + roundScore2;  
    
  //Update the round score IF the rolled number was not a 1
  if(diceNumber === 1 || diceNumber2 === 1){
    scores[activePlayer] = 0;
    document.querySelector('#score-' + activePlayer).textContent = '0';
    zeroOut();
    } else {
    document.querySelector('#current-' + activePlayer).textContent = totalRoundScore;
  }    
    
}

function newGameButtonHandler(){
    //Reset every to 0
    init();
    holdButton.addEventListener('click', holdButtonHandler, true);
    rollDice.addEventListener('click', rollDiceHandler, true);
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-0').style.color = 'black';
    document.getElementById('name-1').textContent = 'Player 2';
    document.getElementById('name-1').style.color = 'black';
    document.querySelector('#score-0').textContent = '0';
    document.querySelector('#score-1').textContent = '0'; 
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');    
}

function gameWinningInputHandler(){
    var highScore = document.querySelector('.btn-game-input').value;
    if (highScore < 1 || !highScore){
        highScore = 20;
    }
    gameHighScore = Number(highScore);
    gameWinningText.textContent = highScore;
    gameWinningText.classList.remove('hidden');
    gameWinningButton.classList.add('hidden');    
}

function toggleActiveClass(){
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');
}

function init(){
    scores = [0,0];
    roundScore = roundScore2 = totalRoundScore = 0;
    activePlayer = 0;
}

function changeActivePlayer(){
  //Ternary operator
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  toggleActiveClass();  
}

//Adding and removing classes to and from elements
//document.querySelector('.player-0-panel').classList.remove('active');
//document.querySelector('.player-0-panel').classList.add('active');

//console.log(dice);

//Place dice number into player score


//var x = document.querySelector('#score-0').textContent;
//console.log(x);


