var board = [];
var score = 0;
var playerName = "";
var gameOver = false;
var gameWon = false;

var images = {
2: "images/2.jpg",
4: "images/4.jpg",
8: "images/8.jpg",
16: "images/16.jpg",
32: "images/32.jpg",
64: "images/64.jpg",
128: "images/128.jpg",
256: "images/256.jpg",
512: "images/512.jpg",
1024: "images/1024.jpg",
2048: "images/2048.jpg"
};

// ==============================
// START PLAYER
// ==============================

function startPlayerGame() {


var input = document.getElementById("playerName");

if (!input) {
    alert("ERROR: playerName input not found.");
    return;
}

var name = input.value.trim();

if (name === "") {
    alert("Please enter your name first.");
    input.focus();
    return;
}

playerName = name;

document.getElementById("playerDisplay").innerHTML =
    "Player: " + playerName;

document.getElementById("playerBox").style.display = "none";

document.getElementById("gameArea").style.display = "block";

startGame();


}

// ==============================
// START GAME
// ==============================

function startGame() {


board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

score = 0;
gameOver = false;
gameWon = false;

addTile();
addTile();

draw();


}

// ==============================
// NEW GAME
// ==============================

function newGame() {


if (playerName === "") {
    return;
}

startGame();


}

// ==============================
// ADD TILE
// ==============================

function addTile() {


var empty = [];
var r;
var c;

for (r = 0; r < 4; r++) {

    for (c = 0; c < 4; c++) {

        if (board[r][c] === 0) {
            empty.push([r, c]);
        }
    }
}

if (empty.length === 0) {
    return;
}

var position =
    empty[Math.floor(Math.random() * empty.length)];

board[position[0]][position[1]] =
    Math.random() < 0.9 ? 2 : 4;


}

// ==============================
// DRAW
// ==============================

function draw() {


var boardElement =
    document.getElementById("board");

if (!boardElement) {
    return;
}

boardElement.innerHTML = "";

var r;
var c;

for (r = 0; r < 4; r++) {

    for (c = 0; c < 4; c++) {

        var tile =
            document.createElement("div");

        tile.className = "tile";

        var value = board[r][c];

        if (value !== 0) {

            var img =
                document.createElement("img");

            img.src = images[value];

            img.alt = value;

            tile.appendChild(img);
        }

        boardElement.appendChild(tile);
    }
}

document.getElementById("score").innerHTML =
    "Score: " + score;


}

// ==============================
// COMPRESS
// ==============================

function compress(row) {


var result = [];
var i;

for (i = 0; i < row.length; i++) {

    if (row[i] !== 0) {
        result.push(row[i]);
    }
}

while (result.length < 4) {
    result.push(0);
}

return result;


}

// ==============================
// MERGE
// ==============================

function merge(row) {


var i;

for (i = 0; i < 3; i++) {

    if (
        row[i] !== 0 &&
        row[i] === row[i + 1]
    ) {

        row[i] = row[i] * 2;

        score = score + row[i];

        row[i + 1] = 0;

        if (row[i] === 2048) {
            winGame();
        }
    }
}

return row;


}

// ==============================
// MOVE LEFT
// ==============================

function moveLeft() {


var changed = false;
var r;

for (r = 0; r < 4; r++) {

    var old =
        JSON.stringify(board[r]);

    var row =
        compress(board[r]);

    row =
        merge(row);

    row =
        compress(row);

    board[r] = row;

    if (
        old !==
        JSON.stringify(row)
    ) {
        changed = true;
    }
}

return changed;


}

// ==============================
// ROTATE
// ==============================

function rotate() {


var newBoard = [
    [],
    [],
    [],
    []
];

var r;
var c;

for (c = 0; c < 4; c++) {

    for (r = 3; r >= 0; r--) {

        newBoard[c].push(
            board[r][c]
        );
    }
}

board = newBoard;


}

// ==============================
// MOVE
// ==============================

function move(direction) {


if (gameOver) {
    return;
}

if (!board || board.length !== 4) {
    return;
}

var moved = false;


if (direction === "left") {

    moved = moveLeft();
}


if (direction === "right") {

    rotate();
    rotate();

    moved = moveLeft();

    rotate();
    rotate();
}


if (direction === "up") {

    rotate();
    rotate();
    rotate();

    moved = moveLeft();

    rotate();
}


if (direction === "down") {

    rotate();

    moved = moveLeft();

    rotate();
    rotate();
    rotate();
}


if (moved) {

    addTile();

    draw();

    if (checkGameOver()) {
        finishGame();
    }
}


}

// ==============================
// GAME OVER CHECK
// ==============================

function checkGameOver() {


var r;
var c;

for (r = 0; r < 4; r++) {

    for (c = 0; c < 4; c++) {

        if (board[r][c] === 0) {
            return false;
        }

        if (
            c < 3 &&
            board[r][c] ===
            board[r][c + 1]
        ) {
            return false;
        }

        if (
            r < 3 &&
            board[r][c] ===
            board[r + 1][c]
        ) {
            return false;
        }
    }
}

return true;


}

// ==============================
// FINISH GAME
// ==============================

function finishGame() {


if (gameOver) {
    return;
}

gameOver = true;

saveScore();

setTimeout(function() {

    alert(
        "GAME OVER\n\n" +
        "Player: " +
        playerName +
        "\nScore: " +
        score
    );

    showPlayerScreen();

}, 300);


}

// ==============================
// WIN
// ==============================

function winGame() {


if (gameWon) {
    return;
}

gameWon = true;

setTimeout(function() {

    alert(
        "CONGRATULATIONS!\n\n" +
        "You reached 2048!"
    );

}, 300);


}

// ==============================
// SHOW NEW PLAYER SCREEN
// ==============================

function showPlayerScreen() {


document.getElementById("gameArea").style.display =
    "none";

document.getElementById("playerBox").style.display =
    "block";

var input =
    document.getElementById("playerName");

input.value = "";

board = [];
score = 0;
playerName = "";
gameOver = false;
gameWon = false;

setTimeout(function() {
    input.focus();
}, 100);


}

// ==============================
// SAVE SCORE
// ==============================

function saveScore() {


var leaderboard =
    JSON.parse(
        localStorage.getItem("leaderboard")
    ) || [];

leaderboard.push({
    name: playerName,
    score: score
});


leaderboard.sort(function(a, b) {
    return b.score - a.score;
});


// ONLY 6 PLAYERS
leaderboard =
    leaderboard.slice(0, 6);


localStorage.setItem(
    "leaderboard",
    JSON.stringify(leaderboard)
);

showLeaderboard();


}

// ==============================
// DISPLAY LEADERBOARD
// ==============================

function showLeaderboard() {


var body =
    document.getElementById(
        "leaderboardBody"
    );

if (!body) {
    return;
}

body.innerHTML = "";

var leaderboard =
    JSON.parse(
        localStorage.getItem("leaderboard")
    ) || [];

leaderboard =
    leaderboard.slice(0, 6);

var i;

for (i = 0; i < leaderboard.length; i++) {

    var row =
        document.createElement("tr");

    var rank =
        document.createElement("td");

    rank.innerHTML =
        i + 1;

    var name =
        document.createElement("td");

    name.textContent =
        leaderboard[i].name;

    var playerScore =
        document.createElement("td");

    playerScore.innerHTML =
        leaderboard[i].score;

    row.appendChild(rank);
    row.appendChild(name);
    row.appendChild(playerScore);

    body.appendChild(row);
}


}

// ==============================
// KEYBOARD
// ==============================

document.addEventListener(
"keydown",
function(e) {


    var input =
        document.getElementById("playerName");


    // ENTER STARTS GAME
    if (
        e.key === "Enter" &&
        document.activeElement === input
    ) {

        startPlayerGame();

        return;
    }


    if (gameOver) {
        return;
    }


    if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
    ) {

        e.preventDefault();
    }


    if (e.key === "ArrowLeft") {
        move("left");
    }

    if (e.key === "ArrowRight") {
        move("right");
    }

    if (e.key === "ArrowUp") {
        move("up");
    }

    if (e.key === "ArrowDown") {
        move("down");
    }


    if (e.key === "a" || e.key === "A") {
        move("left");
    }

    if (e.key === "d" || e.key === "D") {
        move("right");
    }

    if (e.key === "w" || e.key === "W") {
        move("up");
    }

    if (e.key === "s" || e.key === "S") {
        move("down");
    }

},
false


);

// ==============================
// MOBILE SWIPE
// ==============================

var touchStartX = 0;
var touchStartY = 0;

document.addEventListener(
"touchstart",
function(e) {


    if (
        e.touches &&
        e.touches.length > 0
    ) {

        touchStartX =
            e.touches[0].clientX;

        touchStartY =
            e.touches[0].clientY;
    }
},
false


);

document.addEventListener(
"touchend",
function(e) {


    if (gameOver) {
        return;
    }

    if (
        !e.changedTouches ||
        e.changedTouches.length === 0
    ) {
        return;
    }

    var touchEndX =
        e.changedTouches[0].clientX;

    var touchEndY =
        e.changedTouches[0].clientY;


    var dx =
        touchEndX - touchStartX;

    var dy =
        touchEndY - touchStartY;


    if (
        Math.abs(dx) < 30 &&
        Math.abs(dy) < 30
    ) {
        return;
    }


    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 0) {
            move("right");
        } else {
            move("left");
        }

    } else {

        if (dy > 0) {
            move("down");
        } else {
            move("up");
        }
    }

},
false


);

// ==============================
// INITIALIZE
// ==============================

showLeaderboard();

// ==============================
// MAKE HTML ONCLICK WORK
// ==============================

window.startPlayerGame =
startPlayerGame;

window.newGame =
newGame;
