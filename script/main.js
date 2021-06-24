var scoreXSelected = false;
var scoreOSelected = false;
var easySelected = false;
var mediumSelected = false;
var hardSelected = false;

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
    first = "user";
    scoreXSelected = true;
    if(scoreOSelected){
        deselectedBtn("scoreO");
    }
    selectedBtn("scoreX");
}

function selectO(){
    first = "comp";
    scoreOSelected = true;
    if(scoreXSelected){
        deselectedBtn("scoreX");
    }
    selectedBtn("scoreO");
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
var userSign, compSign;
var noOfBoxes = document.getElementById("board").children.length;
var boxes = ["","","","","","","","",""];
var numbersGenerated = new Array();
var winnerCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

var generatedNumbers = new Array();
var turn;
var nextMove;
var current;

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

for(i=1; i<noOfBoxes+1; i++){
    document.getElementById(i).addEventListener("click", move);
}

function startGame(){
    if(scoreXSelected){
        userSign = "X";
        compSign = "O";
        current = "user";
    }else{
        userSign = "O";
        compSign = "X";
        current = "comp"; 
    }
}

function move(e){
    if(current === "user"){
        userMove(e);
    }else{
        compMove();
    }
}

function userMove(e){
    setText(e.target.id, userSign);
    boxes.splice(e.target.id-1,1, userSign); //adding X sign into the array
    for(i=0; i<noOfBoxes; i++){              //for testing
        console.log(i+" is "+boxes[i]);
    }
    compMove();
}

function compMove(){
    if(easySelected){
        easyMove();
    }else if(mediumSelected){
        mediumMove();
    }else if(hardSelected){
        hardMove();
    }
}

function easyMove() {
    var random = randomNumber();
    console.log("number random "+random);
    if(boxes[random] == ""){
        boxes[random] = compSign;
        setText(random+1, compSign);
    }
    for(i=0; i<noOfBoxes; i++){              //for testing
        console.log(i+" is "+boxes[i]);
    }
}

function mediumMove(){
}

function hardMove(){
}

function checkWinner(){
    
}

function randomNumber(){
    var randomNum = (Math.round(Math.random() * noOfBoxes));
    return randomNum;
}

/*

function startGame(){
    console.log(scoreXSelected);
    console.log(scoreOSelected);
    if(scoreXSelected){
        user = "X";
        comp = "O";
        console.log("User ka turn first");
    }else{
        user = "O";
        comp = "X";
        console.log("COmputer ka turn");
    }
    for(i=1; i<noOfBoxes+1; i++){
        document.getElementById(i).addEventListener("click", userMove);
    }
}

function userMove(e){
    console.log("my sign "+user);
    console.log(e.target.id);
    setText(e.target.id, user);
    e.target.classList.remove("box-input");
    boxes[e.target.id] = user;
    turn++;
    checkResult("user");
    if(turn < 8 && nextMove){
        setTimeout(function() {
          easyMove();
        }, 1000);
  }
  e.target.removeEventListener("click", userMove);
}




//Here 'e' is the event object
function click(e){
    if(typeof origBoard[square.target.id] == 'number'){
        move(e.target.id, user);
        if(!checkTie()) 
            turn(bestMove(), comp); 
	}
}

function move(id, sign){
    boxes[id] = sign;
    setText(id, sign);
}
function checkTie(){
    
}

function checkWinner(){
    
}

function easyMove(){
    var randomNo = generateRandom(boxes.length);
    while (boxes[randomNo] === user || boxes[randomNo] === comp){
        randomNo = generateRandom(boxes.length);
    }
    console.log(randomNo);
    setText(randomNo, comp);
    boxes[randomNo].textContent = comp;
    boxes[randomNo].classList.remove("box-input");
    boxes[randomNo].removeEventListener("click", userMove);
    boxes[randomNo] = comp;
    turn++;
    setTimeout(function() {
    checkResult("comp");
    }, 1000);
}

function mediumMove(){
    
}

function hardMove(){
    
}

function generateRandom(max){
    var randomNo = (Math.round(Math.random() * max));
    return randomNo;
}

function checkResult(player){
    // win
  if ((player === "user") 
      && ((boxes[0]===user && boxes[1]===user && boxes[2]===user)
      ||  (boxes[3]===user && boxes[4]===user && boxes[5]===user)
      ||  (boxes[6]===user && boxes[7]===user && boxes[8]===user)
      ||  (boxes[0]===user && boxes[3]===user && boxes[6]===user)
      ||  (boxes[1]===user && boxes[4]===user && boxes[7]===user)
      ||  (boxes[2]===user && boxes[5]===user && boxes[8]===user)
      ||  (boxes[0]===user && boxes[4]===user && boxes[8]===user)
      ||  (boxes[2]===user && boxes[4]===user && boxes[6]===user))
    ) {
    next = 0;
    setTimeout(function() {
        console.log("jeet gaye");
//      reset("You win !");
    }, 1000);
  }
  // lose
  else if ( (player === "comp") 
        && ((boxes[0]===comp && boxes[1]===comp && boxes[2]===comp)
        ||  (boxes[3]===comp && boxes[4]===comp && boxes[5]===comp)
        ||  (boxes[6]===comp && boxes[7]===comp && boxes[8]===comp)
        ||  (boxes[0]===comp && boxes[3]===comp && boxes[6]===comp)
        ||  (boxes[1]===comp && boxes[4]===comp && boxes[7]===comp)
        ||  (boxes[2]===comp && boxes[5]===comp && boxes[8]===comp)
        ||  (boxes[0]===comp && boxes[4]===comp && boxes[8]===comp)
        ||  (boxes[2]===comp && boxes[4]===comp && boxes[6]===comp))
    ) {
    setTimeout(function() {
//      reset("You lose !");
        console.log("haar gayi!");
    }, 1000);
  }
  // tie
  else if (turn === 9) {
    setTimeout(function() {
        console.log("dono maze!");
//      reset("You tied !");
    }, 1000);
  }
}

*/


