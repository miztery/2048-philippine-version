/* =========================================================
   2048 PHILIPPINE PESO VERSION - PRO EDITION
   CGWCEISC-DRDU
========================================================= */

let board = [];
let score = 0;
let playerName = "";
let gameStarted = false;
let gameEnded = false;
let modalCallback = null;

// Undo Feature State Tracking
let previousBoard = null;
let previousScore = 0;
let canUndo = false;


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
const undoBtn = document.getElementById("undoBtn");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");


/* =========================================================
   CUSTOM MODAL POPUP FUNCTIONS
========================================================= */

function showModal(title, message, callback = null) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    modalCallback = callback;
    if (modalOverlay) modalOverlay.classList.add("active");
}

function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove("active");
    if (modalCallback) {
        const cb = modalCallback;
        modalCallback = null;
        cb();
    }
}

window.closeModal = closeModal;


/* =========================================================
   LEADERBOARD STORAGE
========================================================= */

let leaderboard = [];

try {
    const savedLeaderboard = localStorage.getItem("peso2048Leaderboard");
    if (savedLeaderboard) {
        leaderboard = JSON.parse(savedLeaderboard);
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
    const name = playerNameInput.value.trim();

    if (name === "") {
        showModal("Notice Required", "Please enter your callsign or player name to proceed.", function () {
            playerNameInput.focus();
        });
        return;
    }

    playerName = name.substring(0, 30);
    score = 0;
    gameStarted = true;
    gameEnded = false;

    playerDisplay.textContent = playerName;
    playerBox.style.display = "none";
    gameArea.style.display = "block";

    createNewGame();
}

window.startPlayerGame = startPlayerGame;


/* =========================================================
   CREATE NEW GAME
========================================================= */

function createNewGame() {
    board = [];
    score = 0;
    gameEnded = false;
    clearUndoState();

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
    if (!gameStarted) return;
    createNewGame();
}

window.newGame = newGame;


/* =========================================================
   UNDO FEATURE LOGIC
========================================================= */

function cloneBoard(sourceBoard) {
    return sourceBoard.map(row => [...row]);
}

function clearUndoState() {
    previousBoard = null;
    previousScore = 0;
    canUndo = false;
    if (undoBtn) undoBtn.disabled = true;
}

function undoMove() {
    if (!canUndo || !previousBoard || !gameStarted || gameEnded) return;

    board = cloneBoard(previousBoard);
    score = previousScore;

    clearUndoState();
    updateBoard();
}

window.undoMove = undoMove;


/* =========================================================
   ADD RANDOM TILE
========================================================= */

function addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];

    board[cell.row][cell.col] = Math.random() < 0.9 ? 2 : 4;
}


/* =========================================================
   UPDATE BOARD
========================================================= */

function updateBoard() {
    boardElement.innerHTML = "";

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const tile = document.createElement("div");
            tile.className = "tile";

            const value = board[row][col];

            if (value !== 0) {
                const imgPath = images[value];

                if (imgPath) {
                    const img = document.createElement("img");
                    img.src = imgPath;
                    img.alt = "₱" + value;

                    img.onerror = function () {
                        img.remove();
                        showTileNumber(tile, value);
                    };

                    tile.appendChild(img);
                } else {
                    showTileNumber(tile, value);
                }
            }

            boardElement.appendChild(tile);
        }
    }

    scoreElement.textContent = score.toLocaleString();
}


/* =========================================================
   FALLBACK TILE NUMBER
========================================================= */

function showTileNumber(tile, value) {
    const valueElement = document.createElement("div");
    valueElement.className = "tileValue";
    valueElement.textContent = "₱" + value;

    tile.appendChild(valueElement);
}


/* =========================================================
   KEYBOARD CONTROLS (Includes Ctrl+Z / 'u' for Undo)
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {
        if (modalOverlay && modalOverlay.classList.contains("active")) {
            if (event.key === "Enter") {
                event.preventDefault();
                closeModal();
            }
            return;
        }

        if (
            document.activeElement === playerNameInput ||
            document.activeElement.tagName === "INPUT"
        ) {
            return;
        }

        if (
            event.key === "ArrowUp" ||
            event.key === "ArrowDown" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight"
        ) {
            event.preventDefault();
        }

        if (!gameStarted || gameEnded) return;

        // Undo Shortcuts: Ctrl+Z, Cmd+Z, or 'u'
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
            event.preventDefault();
            undoMove();
            return;
        }

        if (event.key.toLowerCase() === "u") {
            event.preventDefault();
            undoMove();
            return;
        }

        if (event.key === "ArrowLeft") moveLeft();
        else if (event.key === "ArrowRight") moveRight();
        else if (event.key === "ArrowUp") moveUp();
        else if (event.key === "ArrowDown") moveDown();
    },
    { passive: false }
);


/* =========================================================
   MOVE LOGIC
========================================================= */

function moveLeft() {
    const preMoveBoard = cloneBoard(board);
    const preMoveScore = score;
    let moved = false;

    for (let row = 0; row < 4; row++) {
        const oldLine = [...board[row]];
        let line = board[row].filter(v => v !== 0);
        line = mergeLine(line);
        while (line.length < 4) line.push(0);
        board[row] = line;
        if (JSON.stringify(oldLine) !== JSON.stringify(line)) moved = true;
    }

    afterMove(moved, preMoveBoard, preMoveScore);
}

function moveRight() {
    const preMoveBoard = cloneBoard(board);
    const preMoveScore = score;
    let moved = false;

    for (let row = 0; row < 4; row++) {
        const oldLine = [...board[row]];
        let line = board[row].filter(v => v !== 0);
        line.reverse();
        line = mergeLine(line);
        while (line.length < 4) line.push(0);
        line.reverse();
        board[row] = line;
        if (JSON.stringify(oldLine) !== JSON.stringify(line)) moved = true;
    }

    afterMove(moved, preMoveBoard, preMoveScore);
}

function moveUp() {
    const preMoveBoard = cloneBoard(board);
    const preMoveScore = score;
    let moved = false;

    for (let col = 0; col < 4; col++) {
        const oldLine = [board[0][col], board[1][col], board[2][col], board[3][col]];
        let line = [];
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== 0) line.push(board[row][col]);
        }
        line = mergeLine(line);
        while (line.length < 4) line.push(0);
        for (let row = 0; row < 4; row++) board[row][col] = line[row];
        const newLine = [board[0][col], board[1][col], board[2][col], board[3][col]];
        if (JSON.stringify(oldLine) !== JSON.stringify(newLine)) moved = true;
    }

    afterMove(moved, preMoveBoard, preMoveScore);
}

function moveDown() {
    const preMoveBoard = cloneBoard(board);
    const preMoveScore = score;
    let moved = false;

    for (let col = 0; col < 4; col++) {
        const oldLine = [board[0][col], board[1][col], board[2][col], board[3][col]];
        let line = [];
        for (let row = 3; row >= 0; row--) {
            if (board[row][col] !== 0) line.push(board[row][col]);
        }
        line = mergeLine(line);
        while (line.length < 4) line.push(0);
        for (let row = 3; row >= 0; row--) board[row][col] = line[3 - row];
        const newLine = [board[0][col], board[1][col], board[2][col], board[3][col]];
        if (JSON.stringify(oldLine) !== JSON.stringify(newLine)) moved = true;
    }

    afterMove(moved, preMoveBoard, preMoveScore);
}

function mergeLine(line) {
    const result = [];
    for (let i = 0; i < line.length; i++) {
        if (i + 1 < line.length && line[i] === line[i + 1]) {
            const merged = line[i] * 2;
            result.push(merged);
            score += merged;
            i++;
        } else {
            result.push(line[i]);
        }
    }
    return result;
}

function afterMove(moved, preMoveBoard, preMoveScore) {
    if (!moved) return;

    // Save history before generating random tile
    previousBoard = preMoveBoard;
    previousScore = preMoveScore;
    canUndo = true;
    if (undoBtn) undoBtn.disabled = false;

    addRandomTile();
    updateBoard();

    if (has2048()) {
        setTimeout(function () {
            showModal("Victory Reached!", "Congratulations " + playerName + "!\n\nYou successfully matched ₱2048!");
        }, 100);
        return;
    }

    if (!canMove()) endGame();
}

function has2048() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 2048) return true;
        }
    }
    return false;
}

function canMove() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) return true;
        }
    }

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === board[row][col + 1]) return true;
        }
    }

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === board[row + 1][col]) return true;
        }
    }

    return false;
}


/* =========================================================
   GAME OVER
========================================================= */

function endGame() {
    if (gameEnded) return;
    gameEnded = true;
    gameStarted = false;

    saveScore();

    setTimeout(function () {
        showModal(
            "Game Over",
            playerName + "'s Score: " + score.toLocaleString() + "\n\nSession finished. Ready for the next player.",
            function () {
                gameArea.style.display = "none";
                playerBox.style.display = "block";
                playerNameInput.value = "";
                playerDisplay.textContent = "---";
                playerName = "";
                board = [];
                score = 0;
                gameEnded = false;
                clearUndoState();

                setTimeout(() => {
                    playerNameInput.focus();
                }, 50);
            }
        );
    }, 200);
}


/* =========================================================
   LEADERBOARD LOGIC
========================================================= */

function saveScore() {
    if (playerName === "") return;
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 6);

    localStorage.setItem("peso2048Leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
}

function updateLeaderboard() {
    if (!leaderboardBody) return;
    leaderboardBody.innerHTML = "";

    const topSix = leaderboard.slice(0, 6);
    topSix.forEach((player, index) => {
        const row = document.createElement("tr");
        const rank = document.createElement("td");
        const name = document.createElement("td");
        const playerScore = document.createElement("td");

        rank.textContent = "#" + (index + 1);
        name.textContent = player.name;
        playerScore.textContent = player.score.toLocaleString();

        row.appendChild(rank);
        row.appendChild(name);
        row.appendChild(playerScore);

        leaderboardBody.appendChild(row);
    });
}


/* =========================================================
   EVENT LISTENERS & INIT
========================================================= */

if (playerNameInput) {
    playerNameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            startPlayerGame();
        }
    });
}

updateLeaderboard();

window.startPlayerGame = startPlayerGame;
window.newGame = newGame;
window.undoMove = undoMove;
window.closeModal = closeModal;
