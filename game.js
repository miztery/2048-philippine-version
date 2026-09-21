/* =========================================================
   2048 PHILIPPINE PESO VERSION
   CGWCEISC-DRDU
========================================================= */

let board = [];
let score = 0;
let playerName = "";
let gameStarted = false;
let gameEnded = false;


/* =========================================================
   IMAGE MAPPING
========================================================= */

const images = {
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


/* =========================================================
   HTML ELEMENTS
========================================================= */

const playerBox = document.getElementById("playerBox");
const playerNameInput = document.getElementById("playerName");
const gameArea = document.getElementById("gameArea");
const playerDisplay = document.getElementById("playerDisplay");
const scoreElement = document.getElementById("score");
const boardElement = document.getElementById("board");
const leaderboardBody = document.getElementById("leaderboardBody");


/* =========================================================
   LEADERBOARD
========================================================= */

let leaderboard = [];

try {

    const savedLeaderboard =
        localStorage.getItem("peso2048Leaderboard");

    if (savedLeaderboard) {

        leaderboard =
            JSON.parse(savedLeaderboard);

        if (!Array.isArray(leaderboard)) {

            leaderboard = [];

        }

    }

} catch (error) {

    leaderboard = [];

}


/* =========================================================
   START PLAYER GAME
========================================================= */

function startPlayerGame() {

    const name =
        playerNameInput.value.trim();


    if (name === "") {

        alert("Please enter your name first.");

        playerNameInput.focus();

        return;

    }


    playerName =
        name.substring(0, 30);


    score = 0;

    gameStarted = true;

    gameEnded = false;


    playerDisplay.textContent =
        "Player: " + playerName;


    playerBox.style.display = "none";

    gameArea.style.display = "block";


    createNewGame();

}


/*
 * IMPORTANT:
 * Make the function available to
 * onclick="startPlayerGame()"
 */

window.startPlayerGame =
    startPlayerGame;


/* =========================================================
   CREATE NEW GAME
========================================================= */

function createNewGame() {

    board = [];

    score = 0;

    gameEnded = false;


    for (let row = 0; row < 4; row++) {

        board[row] = [];

        for (let col = 0; col < 4; col++) {

            board[row][col] = 0;

        }

    }


    addRandomTile();

    addRandomTile();


    updateBoard();

}


/* =========================================================
   NEW GAME BUTTON
========================================================= */

function newGame() {

    if (!gameStarted) {

        return;

    }


    createNewGame();

}


window.newGame = newGame;


/* =========================================================
   ADD RANDOM TILE
========================================================= */

function addRandomTile() {

    const emptyCells = [];


    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (board[row][col] === 0) {

                emptyCells.push({
                    row: row,
                    col: col
                });

            }

        }

    }


    if (emptyCells.length === 0) {

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() * emptyCells.length
        );


    const cell =
        emptyCells[randomIndex];


    board[cell.row][cell.col] =
        Math.random() < 0.9 ? 2 : 4;

}


/* =========================================================
   UPDATE BOARD
========================================================= */

function updateBoard() {

    boardElement.innerHTML = "";


    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            const tile =
                document.createElement("div");


            tile.className = "tile";


            const value =
                board[row][col];


            if (value !== 0) {

                const imgPath =
                    images[value];


                if (imgPath) {

                    const img =
                        document.createElement("img");


                    img.src = imgPath;

                    img.alt =
                        "₱" + value;


                    img.onerror =
                        function () {

                            img.remove();

                            showTileNumber(
                                tile,
                                value
                            );

                        };


                    tile.appendChild(img);

                }

                else {

                    showTileNumber(
                        tile,
                        value
                    );

                }

            }


            boardElement.appendChild(tile);

        }

    }


    scoreElement.textContent =
        "Score: " + score;

}


/* =========================================================
   FALLBACK TILE NUMBER
========================================================= */

function showTileNumber(tile, value) {

    const valueElement =
        document.createElement("div");


    valueElement.className =
        "tileValue";


    valueElement.textContent =
        "₱" + value;


    tile.appendChild(
        valueElement
    );

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        /*
         * Prevent the browser from scrolling
         * when using arrow keys.
         */

        if (
            event.key === "ArrowUp" ||
            event.key === "ArrowDown" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight"
        ) {

            event.preventDefault();

        }


        /*
         * Game must be active.
         */

        if (!gameStarted || gameEnded) {

            return;

        }


        /*
         * Don't move the game while typing
         * the player's name.
         */

        if (
            document.activeElement ===
            playerNameInput
        ) {

            return;

        }


        if (event.key === "ArrowLeft") {

            moveLeft();

        }

        else if (event.key === "ArrowRight") {

            moveRight();

        }

        else if (event.key === "ArrowUp") {

            moveUp();

        }

        else if (event.key === "ArrowDown") {

            moveDown();

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   MOVE LEFT
========================================================= */

function moveLeft() {

    let moved = false;


    for (let row = 0; row < 4; row++) {

        const oldLine =
            [...board[row]];


        let line =
            board[row].filter(
                value => value !== 0
            );


        line =
            mergeLine(line);


        while (line.length < 4) {

            line.push(0);

        }


        board[row] =
            line;


        if (
            JSON.stringify(oldLine) !==
            JSON.stringify(line)
        ) {

            moved = true;

        }

    }


    afterMove(moved);

}


/* =========================================================
   MOVE RIGHT
========================================================= */

function moveRight() {

    let moved = false;


    for (let row = 0; row < 4; row++) {

        const oldLine =
            [...board[row]];


        let line =
            board[row].filter(
                value => value !== 0
            );


        line.reverse();


        line =
            mergeLine(line);


        while (line.length < 4) {

            line.push(0);

        }


        line.reverse();


        board[row] =
            line;


        if (
            JSON.stringify(oldLine) !==
            JSON.stringify(line)
        ) {

            moved = true;

        }

    }


    afterMove(moved);

}


/* =========================================================
   MOVE UP
========================================================= */

function moveUp() {

    let moved = false;


    for (let col = 0; col < 4; col++) {

        const oldLine = [

            board[0][col],
            board[1][col],
            board[2][col],
            board[3][col]

        ];


        let line = [];


        for (let row = 0; row < 4; row++) {

            if (board[row][col] !== 0) {

                line.push(
                    board[row][col]
                );

            }

        }


        line =
            mergeLine(line);


        while (line.length < 4) {

            line.push(0);

        }


        for (let row = 0; row < 4; row++) {

            board[row][col] =
                line[row];

        }


        const newLine = [

            board[0][col],
            board[1][col],
            board[2][col],
            board[3][col]

        ];


        if (
            JSON.stringify(oldLine) !==
            JSON.stringify(newLine)
        ) {

            moved = true;

        }

    }


    afterMove(moved);

}


/* =========================================================
   MOVE DOWN
========================================================= */

function moveDown() {

    let moved = false;


    for (let col = 0; col < 4; col++) {

        const oldLine = [

            board[0][col],
            board[1][col],
            board[2][col],
            board[3][col]

        ];


        let line = [];


        for (let row = 3; row >= 0; row--) {

            if (board[row][col] !== 0) {

                line.push(
                    board[row][col]
                );

            }

        }


        line =
            mergeLine(line);


        while (line.length < 4) {

            line.push(0);

        }


        for (let row = 3; row >= 0; row--) {

            board[row][col] =
                line[3 - row];

        }


        const newLine = [

            board[0][col],
            board[1][col],
            board[2][col],
            board[3][col]

        ];


        if (
            JSON.stringify(oldLine) !==
            JSON.stringify(newLine)
        ) {

            moved = true;

        }

    }


    afterMove(moved);

}


/* =========================================================
   MERGE LINE
========================================================= */

function mergeLine(line) {

    const result = [];


    for (let i = 0; i < line.length; i++) {

        if (
            i + 1 < line.length &&
            line[i] === line[i + 1]
        ) {

            const merged =
                line[i] * 2;


            result.push(merged);


            score += merged;


            i++;

        }

        else {

            result.push(
                line[i]
            );

        }

    }


    return result;

}


/* =========================================================
   AFTER MOVE
========================================================= */

function afterMove(moved) {

    if (!moved) {

        return;

    }


    addRandomTile();

    updateBoard();


    if (has2048()) {

        setTimeout(
            function () {

                alert(
                    "Congratulations " +
                    playerName +
                    "!\n\n" +
                    "You reached ₱2048!"
                );

            },
            100
        );

        return;

    }


    if (!canMove()) {

        endGame();

    }

}


/* =========================================================
   CHECK 2048
========================================================= */

function has2048() {

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (
                board[row][col] === 2048
            ) {

                return true;

            }

        }

    }


    return false;

}


/* =========================================================
   CHECK WHETHER GAME CAN MOVE
========================================================= */

function canMove() {

    /*
     * Check empty cells.
     */

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (board[row][col] === 0) {

                return true;

            }

        }

    }


    /*
     * Check horizontal matches.
     */

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 3; col++) {

            if (
                board[row][col] ===
                board[row][col + 1]
            ) {

                return true;

            }

        }

    }


    /*
     * Check vertical matches.
     */

    for (let row = 0; row < 3; row++) {

        for (let col = 0; col < 4; col++) {

            if (
                board[row][col] ===
                board[row + 1][col]
            ) {

                return true;

            }

        }

    }


    return false;

}


/* =========================================================
   GAME OVER
========================================================= */

function endGame() {

    if (gameEnded) {

        return;

    }


    gameEnded = true;

    gameStarted = false;


    saveScore();


    setTimeout(
        function () {

            alert(
                "GAME OVER!\n\n" +
                playerName +
                "'s Score: " +
                score +
                "\n\n" +
                "Enter the next player's name."
            );


            /*
             * Hide game.
             */

            gameArea.style.display =
                "none";


            /*
             * Show player-name screen.
             */

            playerBox.style.display =
                "block";


            /*
             * Clear old name.
             */

            playerNameInput.value =
                "";


            /*
             * Reset display.
             */

            playerDisplay.textContent =
                "Player:";


            /*
             * Reset variables.
             */

            playerName = "";

            board = [];

            score = 0;

            gameEnded = false;


            /*
             * Put cursor in name box.
             */

            playerNameInput.focus();

        },
        200
    );

}


/* =========================================================
   SAVE SCORE
========================================================= */

function saveScore() {

    if (playerName === "") {

        return;

    }


    leaderboard.push({

        name: playerName,

        score: score

    });


    /*
     * Highest score first.
     */

    leaderboard.sort(
        function (a, b) {

            return b.score - a.score;

        }
    );


    /*
     * ONLY SIX PLAYERS.
     */

    leaderboard =
        leaderboard.slice(0, 6);


    localStorage.setItem(
        "peso2048Leaderboard",
        JSON.stringify(
            leaderboard
        )
    );


    updateLeaderboard();

}


/* =========================================================
   UPDATE LEADERBOARD
========================================================= */

function updateLeaderboard() {

    if (!leaderboardBody) {

        return;

    }


    leaderboardBody.innerHTML = "";


    const topSix =
        leaderboard.slice(0, 6);


    topSix.forEach(
        function (player, index) {

            const row =
                document.createElement("tr");


            const rank =
                document.createElement("td");


            const name =
                document.createElement("td");


            const playerScore =
                document.createElement("td");


            rank.textContent =
                index + 1;


            name.textContent =
                player.name;


            playerScore.textContent =
                player.score;


            row.appendChild(rank);

            row.appendChild(name);

            row.appendChild(
                playerScore
            );


            leaderboardBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   ENTER KEY TO START GAME
========================================================= */

if (playerNameInput) {

    playerNameInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                startPlayerGame();

            }

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

updateLeaderboard();


/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================================= */

window.startPlayerGame =
    startPlayerGame;

window.newGame =
    newGame;

