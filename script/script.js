var scoreXSelected = false;
var scoreOSelected = false;
var easySelected = false;
var mediumSelected = false;
var hardSelected = false;
var count =1;

function oppositeSign(sign){
    if(sign === "X"){
        return "O";
    }else if(sign === "O"){
        return "X";
    }
}
/*HELPER*/
function setText(id, text){
    document.getElementById(id).innerHTML = text;
}

function show(id){
    document.getElementById(id).style.display = 'block';
}

function hide(id){
    document.getElementById(id).style.display = 'none';
}

function selectedBtn(id){
    document.getElementById(id).style.borderBottom = "solid 3px #D1A617";
    document.getElementById(id).style.boxShadow = "0 4px 4px 0 #BBB";
}

function deselectedBtn(id){
    document.getElementById(id).style.borderBottom = "solid 1px #8A7544";
    document.getElementById(id).style.boxShadow = "0 0 0 0 #BBB";
}

/*End Of Helpers*/

function removeListeners(){
//    document.getElementById("scoreX").addEventListener("click", function(e){
//        e.preventDefault();
//    });
//    document.getElementById("scoreO").addEventListener("click", function(e){
//        e.preventDefault();
//    });
    document.getElementById("scoreX").removeEventListener("click", selectX);
    document.getElementById("scoreO").removeEventListener("click", selectO);
    document.getElementById("easy").removeEventListener("click", selectEasy);
    document.getElementById("medium").removeEventListener("click", selectMedium);
    document.getElementById("hard").removeEventListener("click", selectHard);
}

document.getElementById("scoreX").addEventListener("click", selectX);
document.getElementById("scoreO").addEventListener("click", selectO);
document.getElementById("easy").addEventListener("click", selectEasy);
document.getElementById("medium").addEventListener("click", selectMedium);
document.getElementById("hard").addEventListener("click", selectHard);

function selectX(){
    scoreXSelected = true;
    if(scoreOSelected){
        deselectedBtn("scoreO");
    }
    selectedBtn("scoreX");
    scoreOSelected = false;
}

function selectO(){
    scoreOSelected = true;
    if(scoreXSelected){
        deselectedBtn("scoreX");
    }
    selectedBtn("scoreO");
    scoreXSelected = false;

}

function selectEasy(){
    easySelected = true;
    if(mediumSelected || hardSelected){
        deselectedBtn("medium");
        deselectedBtn("hard");
    }
    selectedBtn("easy");
}

function selectMedium(){
    mediumSelected = true;
    if(easySelected || hardSelected){
        deselectedBtn("easy");
        deselectedBtn("hard");
    }
    selectedBtn("medium");
}

function selectHard(){
    hardSelected = true;
    if(mediumSelected || easySelected){
        deselectedBtn("medium");
        deselectedBtn("easy");
    }
    selectedBtn("hard");
}

/*
GAME MODULE
*/

var playing = false;
var score;

document.getElementById("start-reset").addEventListener("click", checkSelections);

function checkSelections(){
    if(!scoreXSelected && !scoreOSelected ){
        alert("Select X or O");
    }else if(!easySelected && !mediumSelected && !hardSelected){
        alert("Select Difficulty Level");
    }else{
        startReset();
    }
}

var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var user, comp;
var winnerCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];
const boxes = document.querySelectorAll('.box-input');

function startReset(){
    if(playing === true){
        //game is on and you want to reset
        playing = false;
        window.location.reload();
    }else{
        //game is off and you want to start
        playing = true;
        score = 0;
        setText("score-value-X", score);
        setText("score-value-O", score);
        hide("starting-lead");
        show("turn");
        removeListeners();
        setText("start-reset", "Reset Game");
        //I have done this because you cannot change the choice once the game has started.
        startGame();
    }
}

function startGame(){
    for(i=0; i<boxes.length; i++){
        boxes[i].textContent = "";
        boxes[i].addEventListener("click", turnClick);
    }
    if(scoreXSelected){
        user = "X";
        comp = "O";
    }else if(scoreOSelected){
        user = "O";
        comp = "X";
    }
}

function turnClick(e){
    if(typeof board[e.target.id] == 'number'){
        turn(e.target.id, user);
        if(!checkDraw()){
            if(easySelected){
                turn(easyMove(), comp);
            }else if(mediumSelected){
                turn(mediumMove(), comp);
            }else if(hardSelected){
                turn(hardMove(), comp);
            }
        }
    }
}

var gamewins = 0;

function turn(id, player){
    if(gamewins == 0){
        board[id] = player;
        let gameWon = checkWin(board, player);
        setText(id, player);
        //If game has been won then call gameOver()
        if(gameWon){
            gamewins++;
            gameOver(gameWon);
        }
    }    
}

function checkWin(board, player){
    //plays is storing the indexes where box is occupied by the sign
    let plays = [];
    for(i=0; i<board.length; i++){
        if(board[i] === player){
            plays.push(i);
        }
    }
    plays.sort();
    /*
    let gameWon = null;
    for(i=0; i<winnerCombinations.length; i++){
        for(j=0; j<winnerCombinations[i].length; j++){
            if(plays.indexOf(winnerCombinations[i][j]) > -1){
                gameWon = {i:i, player: player};
                break;
            }   
        }
    }*/
    
    let gameWon = null;
    for(let [index, win] of winnerCombinations.entries()) {
       if(win.every(elem => plays.indexOf(elem) > -1)){
        gameWon = {index: index, player: player};
        break; 
       }
    }
    return gameWon;
}

var first = 0;

function gameOver(gameWon){
    first++;
    if(first == 2){
        
    }else{
        for(let index of winnerCombinations[gameWon.index]){
        document.getElementById(index).style.color = 
            gameWon.player == user ? "#006E62" : "#C0564B";
        console.log(index);
        }
        for(i=0; i<boxes.length; i++){
            boxes[i].removeEventListener("click", turnClick);
        }
        declareWinner(gameWon.player === user ? "You Won" : "You Lost");
    }
    setTimeout(() => {  startReset(); }, 2000); //Game will reset in 2 seconds
}

function emptySquares(){
//    let empty = [];
//    for(i=0; i<board.length; i++){
//        if(typeof board[i] == 'number'){
//            empty.push(board[i]);   
//        }
//    }
//    return empty;
    return board.filter(s => typeof s == 'number');
}

function shuffle(array){
    var currentIndex = array.length;
    var temp, randomNo;
    while (currentIndex !== 0){
        randomNo = Math.round(Math.random() * currentIndex);
        currentIndex -= 1;
        temp = array[currentIndex];
        array[currentIndex] = array[randomNo];
        array[randomNo] = temp;
    }
    return array;
}

function declareWinner(message){
    show("end");
    setText("end", message);
}

function checkDraw(){
    if(emptySquares().length == 0 && gamewins == 0){
        for(i=0; i<boxes.length; i++){
//            boxes[i].style.color = "#4E4637";
            boxes[i].removeEventListener("click", turnClick);
        }
        declareWinner("Draw Game!")
        return true;
    }
    return false;
}

function easyMove(){
    console.log("easy")
    return pickRandomBoxes();
}

//Workign like easy moves
function mediumMove(){
    count++;
    console.log("medium", count);
    if(count % 2 == 0){
        return easyMove();
    }else{
        return hardMove();
    }
}

function hardMove(){  
    console.log("hard");
    return minimax(board, comp).index;
}

function pickRandomBoxes(){
    var shuffledArray = shuffle(emptySquares());
    /*for(i=0; i<shuffledArray.length; i++){
        console.log("elements: "+shuffledArray[i]);
    }*/
    return shuffledArray[0]; //pick first element from empty square array
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, user)) {
		return {score: -10};
	} else if (checkWin(newBoard, comp)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == comp) {
			var result = minimax(newBoard, user);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, comp);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === comp) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
