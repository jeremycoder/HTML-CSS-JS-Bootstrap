//Number Guessing Game

//Get random number between 1 and 100
var num = (Math.ceil((Math.random()*100)));

//Number of tries
var tries = 1;

//Ask user, turn string prompt into a number
var guess = Number(prompt("Guess a number between 1 and 100"));

//Ask again if guess is incorrect
while (guess !== num)
{
	tries++;
	if (guess < num)
		guess = Number(prompt("Too low! Try again:"));
	else
		guess = Number(prompt("Too high! Try again:"));
}

//Tell user after guess is right
if (tries === 1)
	alert( num + " You got it! It only took you 1 try! EXCELLENT!");
else
	alert(num + " You got it! It only took you " + tries + " tries!");