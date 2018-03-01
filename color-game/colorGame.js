
//Number of squares
var numSquares = 6;
//array of colors
var colors = [generateRandomColors(numSquares)];
//Select elements and ids
var squares = document.querySelectorAll(".square");
var pickedColor = pickColor();
var colorDisplay = document.getElementById("colorDisplay");
var clickedColor;
colorDisplay.textContent = pickedColor;
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");

//start the game
init();

function init() {
	setUpModeButtons();
	setUpSquares();	
}

//set up mode buttons
function setUpModeButtons() {
	for (var i = 0; i < modeButtons.length; i++) {
	    modeButtons[i].addEventListener("click", function(){
		modeButtons[0].classList.remove("selected");
		modeButtons[1].classList.remove("selected");
		this.classList.add("selected");
		this.textContent === "Easy" ? numSquares = 3 : numSquares = 6;
		reset();
	});
	}
}

//set up squares
function setUpSquares() {
	//Color all the squares
	for (var i = 0; i < colors.length; i++) {
	//Add click listeners to squares
	squares[i].addEventListener("click", function() {
		//grab color of picked square
		clickedColor = this.style.backgroundColor;

		//compare color to picked color
		if (clickedColor === pickedColor) {
			messageDisplay.textContent = "Praise Yahweh!";
			resetButton.textContent = "Play Again?";
			changeColors(clickedColor);
			h1.style.backgroundColor = clickedColor;
		}
		else {
			this.style.backgroundColor = "#232323";
			messageDisplay.textContent = "Try Again";
		}
	});

	reset();
	}
}


//reset everything
function reset() {
	colors = generateRandomColors(numSquares);
  //pick a new random color from array
  pickedColor = pickColor();
  //change color display to match picked color
  colorDisplay.textContent = pickedColor;
  //change colors of squares
  for (var i = 0; i < squares.length; i++) {
  	if (colors[i]){
  		squares[i].style.display = "block";
  		squares[i].style.backgroundColor = colors[i];
  	} else {
  		squares[i].style.display = "none";
  	}  	
  }
  //reset color of h1
  h1.style.backgroundColor = "steelblue";
  //change text content  
  resetButton.textContent = "New Colors";  	
  //remove message content
  messageDisplay.textContent = "";
}

//reset button
resetButton.addEventListener("click", function(){
  reset();
});


 //Change colors on the squares to same color
function changeColors(color){
	//loop through all colors
	for (var i = 0; i < squares.length; i++) {
		squares[i].style.backgroundColor = color;
	}
}

//Pick a random color
function pickColor(){
	var random = Math.floor(Math.random() * colors.length);  
	return colors[random];
}

//Generate Random Colors
function generateRandomColors(num){	
	//make an array
	var arr = [];
	//add num random colors to array
	for (var i = 0; i < num; i++) {
		//Assign random color to array
		arr.push(randomColor());
	}
	//return that array
	return arr;
}

//Generate one random color
function randomColor(){    
    //256 is based on max number of rgb colors. The numbers correspond to red, green, and blue
	var finalColor = "rgb(" + randomNumber(256) + ", " + randomNumber(256) + ", " + randomNumber(256) + ")";
	return finalColor;
}

//Generate a random number up to max number
function randomNumber(max){
	return Math.floor(Math.random() * max);
}

