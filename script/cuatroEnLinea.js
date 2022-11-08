"use strict";

window.onload = () => {
    const canvas = document.querySelector('#juego');
    const ctx = canvas.getContext('2d');

    let nEnLinea = 4;
    const selectedDificulty = document.querySelector('#nEnLinea');
    const menuDificultyDisplay = document.querySelector('#nEnLineaDisplay');
    const timerDisplay = document.querySelector('#time');
    menuDificultyDisplay.innerHTML = selectedDificulty.value;
    selectedDificulty.addEventListener('change', () => {
        menuDificultyDisplay.innerHTML = selectedDificulty.value;
        nEnLinea = parseInt(selectedDificulty.value);
    })

    const inputNameJ1 = document.querySelector('#nameJugador1');
    const inputNameJ2 = document.querySelector('#nameJugador2');

    const gameOverContainer = document.querySelector('#gameOver');
    const gameOverMessage = document.querySelector('#result');
    const gameOverWinnerDisplay = document.querySelector('#winner');

    const startButton = document.querySelector('#start');
    const startMenu = document.querySelector("#gameInit");
    const gameOverlay = document.querySelector('#gameOverlay');
    const j1NameDisplay = document.querySelector('#j1Name');
    const j2NameDisplay = document.querySelector('#j2Name');

    const restartButton = document.querySelector('#restart');

    restartButton.addEventListener('click', () => {
        gameOverContainer.classList.toggle('invisible');
        startMenu.classList.toggle('invisible');
    })

    startButton.addEventListener('click', () => {

        isRunning = true;

        timeLeft = parseInt(document.querySelector('input[name="timer"]:checked').value);

        timerController = window.setInterval(() => {
            timeLeft--;
        }, 1000);

        canvas.width = (nEnLinea + 3 + 6) * tileSize * sizeFactor;
        canvas.height = (nEnLinea + 2 + 6) * tileSize * sizeFactor;

        gameBackground = new Background({ wBoard: nEnLinea + 3, hBoard: nEnLinea + 2 });
        gameBoard = new Board({ position: { x: tileSize * sizeFactor * 3, y: tileSize * sizeFactor * 3 }, wBoard: nEnLinea + 3, hBoard: nEnLinea + 2 });
        player1 = new Player({ name: inputNameJ1.value, pieces: PlayerPiece.jugador1 });
        player2 = new Player({ name: inputNameJ2.value, pieces: PlayerPiece.jugador2 });
        baseBlue = new PlayerBase({ position: { x: 0, y: 0 }, player: player1 });
        baseRed = new PlayerBase({ position: { x: (nEnLinea + 6) * tileSize * sizeFactor, y: 0 }, player: player2 });
        player1.addBase(baseBlue);
        player2.addBase(baseRed);
        currentPlayer = player1;
        j1NameDisplay.classList.add('currentPlayer');

        animate();
        startMenu.classList.add('invisible');
        gameOverlay.classList.remove('invisible');
        j1NameDisplay.innerHTML = inputNameJ1.value;
        j2NameDisplay.innerHTML = inputNameJ2.value;

    });

    let isRunning = false;

    const tileSize = 32;
    const sizeFactor = 1;
    let timeLeft;


    let fadeTick = -0.5;

    canvas.width = (nEnLinea + 3 + 6) * tileSize * sizeFactor;
    canvas.height = (nEnLinea + 2 + 6) * tileSize * sizeFactor;

    let currentPlayer;
    let currentPiece;
    let currentMouseMove;

    function changePlayer() {
        (currentPlayer == player1) ? currentPlayer = player2: currentPlayer = player1;
        if (currentPlayer == player1) {
            j1NameDisplay.classList.add('currentPlayer');
            j2NameDisplay.classList.remove('currentPlayer');
        } else {
            j1NameDisplay.classList.remove('currentPlayer');
            j2NameDisplay.classList.add('currentPlayer');
        }
    }

    function gameOver(player, { firstElement, winSecuence }) {
        currentGhostPiece = null;
        gameOverContainer.classList.toggle('invisible');
        if (timeLeft <= 0) {
            gameOverMessage.innerHTML = 'La partida resulto en un';
            gameOverWinnerDisplay.innerHTML = 'Empate';
        } else {
            gameOverMessage.innerHTML = 'El ganador es';
            gameOverWinnerDisplay.innerHTML = player.name;
        }

    }

    const boardTiles = {
        board: [
            '../assets/juego/background_tiles/tablero1.png',
            '../assets/juego/background_tiles/tablero2.png',
            '../assets/juego/background_tiles/tablero3.png',
            '../assets/juego/background_tiles/tablero4.png',
        ],
        background: [
            '../assets/juego/background_tiles/bg1.png',
            '../assets/juego/background_tiles/bg2.png',
            '../assets/juego/background_tiles/bg3.png',
            '../assets/juego/background_tiles/bg4.png',
            '../assets/juego/background_tiles/bg5.png',
            '../assets/juego/background_tiles/bg6.png',
        ],
        base: [
            '../assets/juego/background_tiles/11.png',
            '../assets/juego/background_tiles/12.png',
            '../assets/juego/background_tiles/13.png',
            '../assets/juego/background_tiles/21.png',
            '../assets/juego/background_tiles/22.png',
            '../assets/juego/background_tiles/23.png',
            '../assets/juego/background_tiles/31.png',
            '../assets/juego/background_tiles/32.png',
            '../assets/juego/background_tiles/33.png',
        ]
    }

    const PlayerPiece = {
        jugador1: '../assets/juego/background_tiles/jugador1.png',
        jugador2: '../assets/juego/background_tiles/jugador2.png',
        whiteRunes: '../assets/juego/background_tiles/light_runes.png',
    }

    let whiteRunes = new Image();
    whiteRunes.src = PlayerPiece.whiteRunes;


    class Background {
        constructor({
            wBoard = 7,
            hBoard = 6,
        }) {
            this.w = wBoard + 6;
            this.h = hBoard + 6;
            this.tiles = [];
            for (let i = 0; i < this.w; i++) {
                for (let j = 0; j < this.h; j++) {
                    let currentImage = new Image();
                    currentImage.src = boardTiles.background[Math.floor(Math.random() * boardTiles.background.length)];
                    this.tiles[i + j * this.w] = currentImage;
                }
            }
        }

        draw() {
            for (let i = 0; i < this.w; i++) {
                for (let j = 0; j < this.h; j++) {
                    ctx.drawImage(
                        this.tiles[i + j * this.w],
                        0,
                        0,
                        tileSize,
                        tileSize,
                        tileSize * i * sizeFactor,
                        tileSize * j * sizeFactor,
                        tileSize * sizeFactor,
                        tileSize * sizeFactor,
                    )
                }
            }

        }
    }

    let detectCollision = (mouseX, mouseY, objectX, objectY, objectW, objectH) => {
        return (mouseX > objectX && mouseX < (objectX + objectW) && mouseY > objectY && mouseY < (objectY + objectH));
    }

    class MouseMovement {
        constructor({
            initialPosition,
            initialPiecePosition,
        }) {
            this.initialPosition = initialPosition;
            this.initialPiecePosition = initialPiecePosition;
        }

        calculateOffset(currentX, currentY) {
            return {
                x: this.initialPiecePosition.x + currentX - this.initialPosition.mouseX,
                y: this.initialPiecePosition.y + currentY - this.initialPosition.mouseY,
            }
        }
    }

    class PlayerBase {
        constructor({
            position,
            player,
        }) {
            this.position = position;
            this.player = player;
            this.piece = new Piece({ position: { x: this.position.x + tileSize * sizeFactor, y: this.position.y }, player: player });
        }

        tookPiece(mouseX, mouseY) {
            return detectCollision(mouseX, mouseY, this.position.x + tileSize * sizeFactor, this.position.y, tileSize * sizeFactor, tileSize * sizeFactor * 2);
        }

        getNewPiece() {
            this.piece = new Piece({ position: { x: this.position.x + tileSize * sizeFactor, y: this.position.y }, player: this.player });
        }

        draw() {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    let currentTile = new Image();
                    currentTile.src = boardTiles.base[i + j * 3];
                    ctx.drawImage(
                        currentTile,
                        0,
                        0,
                        tileSize,
                        tileSize,
                        this.position.x + tileSize * i * sizeFactor,
                        this.position.y + tileSize * j * sizeFactor,
                        tileSize * sizeFactor,
                        tileSize * sizeFactor,
                    )
                }
            }
            this.piece.draw();
            if (this.player == currentPlayer) {
                ctx.drawImage(
                    whiteRunes,
                    0,
                    0,
                    tileSize,
                    tileSize * 2,
                    this.piece.position.x,
                    this.piece.position.y,
                    tileSize * sizeFactor,
                    tileSize * sizeFactor * 2,
                )
            }
        }
    }

    class Board {
        constructor({
            position,
            wBoard = 7,
            hBoard = 6,
        }) {
            this.highlightingColumns = false;
            this.position = position;
            this.wBoard = wBoard;
            this.hBoard = hBoard;
            this.tiles = [];
            this.pieces = [];
            for (let col = 0; col < wBoard; col++) {
                this.pieces[col] = [];
            }
            this.boardXStart = tileSize * 3 * sizeFactor;
            this.boardXEnd = tileSize * (3 + wBoard) * sizeFactor;
            this.boardYStart = tileSize * 3 * sizeFactor;
            this.boardYEnd = tileSize * (3 + hBoard) * sizeFactor;
            for (let i = 0; i < wBoard; i++) {
                for (let j = 0; j < hBoard; j++) {
                    let currentImage = new Image();
                    currentImage.src = boardTiles.board[Math.floor(Math.random() * boardTiles.board.length)];
                    this.tiles[i + j * wBoard] = currentImage;
                }
            }
        }

        draw() {
            for (let i = 0; i < this.wBoard; i++) {
                for (let j = 0; j < this.hBoard; j++) {
                    ctx.drawImage(
                        this.tiles[i + j * this.wBoard],
                        0,
                        0,
                        tileSize,
                        tileSize,
                        this.position.x + tileSize * i * sizeFactor,
                        this.position.y + tileSize * j * sizeFactor,
                        tileSize * sizeFactor,
                        tileSize * sizeFactor,
                    )
                }

            }
            this.highlightingColumns ? this.highlightColumns() : null;
            if (currentGhostPiece) currentGhostPiece.draw();
            this.drawPieces();
        }

        drawPieces() {
            this.pieces.forEach(col => {
                for (let pos = col.length - 1; pos >= 0; pos--) {
                    col[pos].draw();
                }
            })
        }

        addPiece({ player, position }) {
            let col = Math.floor(position.x / tileSize * sizeFactor);
            if (this.pieces[col].length < this.hBoard) {
                let newPiece = new Piece({
                    player: player,
                    position: {
                        x: col * tileSize * sizeFactor + this.boardXStart,
                        y: this.boardYEnd - (2 * tileSize * sizeFactor) - (this.pieces[col].length * tileSize * sizeFactor),
                    }
                });
                this.pieces[col].push(newPiece);
                this.checkWinCondition();

                changePlayer();
            }
        }

        checkWinCondition() {
            let firstElement;
            let winSecuence;
            for (let col = 0; col < this.pieces.length; col++) {
                this.pieces[col].forEach((piece, pos) => {
                    if (!isRunning) {
                        return;
                    }

                    let toTop = 1;
                    let nextPos = pos + 1;
                    while (this.pieces[col][nextPos] && this.pieces[col][nextPos].player == piece.player && toTop < nEnLinea) {
                        nextPos++;
                        toTop++;
                    }
                    if (toTop == nEnLinea) {
                        isRunning = false;
                        firstElement = {
                            col: col,
                            row: nextPos,
                        }
                        winSecuence = 'toTop';
                        gameOver(currentPlayer, {
                            firstElement: firstElement,
                            winSecuence: winSecuence,
                        });
                        return;
                    }
                    let toRight = 1;
                    let nextCol = col + 1;
                    while (this.pieces[nextCol] && this.pieces[nextCol][pos] && this.pieces[nextCol][pos].player == piece.player && toRight < nEnLinea) {
                        nextCol++;
                        toRight++;
                    }
                    if (toRight == nEnLinea) {
                        isRunning = false;
                        firstElement = {
                            col: nextCol,
                            row: pos,
                        }
                        winSecuence = 'toRight';
                        gameOver(currentPlayer, {
                            firstElement: firstElement,
                            winSecuence: winSecuence,
                        });
                        return;
                    }
                    let toTopRight = 1;
                    let nextColX = col + 1;
                    let nextPosX = pos + 1;
                    while (this.pieces[nextColX] && this.pieces[nextColX][nextPosX] && this.pieces[nextColX][nextPosX].player == piece.player && toTopRight < nEnLinea) {
                        nextColX++;
                        nextPosX++;
                        toTopRight++;
                    }
                    if (toTopRight == nEnLinea) {
                        isRunning = false;
                        firstElement = {
                            col: nextColX,
                            row: nextPosX,
                        }
                        winSecuence = 'toTopRight';
                        gameOver(currentPlayer, {
                            firstElement: firstElement,
                            winSecuence: winSecuence,
                        });
                        return;
                    }
                    let toTopLeft = 1;
                    let nextColY = col - 1;
                    let nextPosY = pos + 1;
                    while (this.pieces[nextColY] && this.pieces[nextColY][nextPosY] && this.pieces[nextColY][nextPosY].player == piece.player && toTopLeft < nEnLinea) {
                        nextColY--
                        nextPosY++;
                        toTopLeft++;
                    }
                    if (toTopLeft == nEnLinea) {
                        isRunning = false;
                        firstElement = {
                            col: nextColY,
                            row: nextPosY,
                        }
                        winSecuence = 'toTopLeft';
                        gameOver(currentPlayer, {
                            firstElement: firstElement,
                            winSecuence: winSecuence,
                        });
                        return;
                    }
                })
            }
        }

        highlightColumns() {
            let startPosition = tileSize * sizeFactor * 3;
            for (let i = 0; i < this.wBoard; i++) {
                ctx.fillStyle = '#22fa2220';
                ctx.fillRect(startPosition + 2 + (i * tileSize * sizeFactor), 3 * tileSize * sizeFactor + 2, 28, (this.hBoard * tileSize * sizeFactor) - 6);
            }
        }

        isOnBoard(mouseX, mouseY) {
            return (mouseX > 3 * tileSize * sizeFactor && mouseX < ((3 + this.wBoard) * tileSize * sizeFactor) && mouseY > 3 * tileSize * sizeFactor && mouseY < (3 + this.hBoard) * tileSize * sizeFactor);
        }
    }

    class Player {
        constructor({
            name,
            pieces,
        }) {
            this.name = name;
            this.pieces = new Image();
            this.pieces.src = pieces;
            this.base;
        }

        addBase(base) {
            this.base = base;
        }
    }

    class Piece {
        constructor({
            position,
            player,
        }) {
            this.position = position;
            this.player = player;
        }

        draw() {
            ctx.drawImage(
                this.player.pieces,
                0,
                0,
                tileSize,
                tileSize * 2,
                this.position.x,
                this.position.y,
                tileSize * sizeFactor,
                tileSize * sizeFactor * 2,
            )
        }
    }

    class GhostPiece {
        constructor({
            position,
            player,
        }) {
            this.position = position;
            this.player = player;
        }

        draw() {
            ctx.globalAlpha = Math.abs(fadeTick) + 0.2;
            ctx.drawImage(
                this.player.pieces,
                0,
                0,
                tileSize,
                tileSize * 2,
                this.position.x,
                this.position.y,
                tileSize * sizeFactor,
                tileSize * sizeFactor * 2,
            )
            ctx.globalAlpha = 1;
        }
    }

    let winner;
    let gameBackground;
    let gameBoard;
    let player1;
    let player2;
    let baseBlue;
    let baseRed;
    let currentGhostPiece;
    let timerController;

    function animate() {

        window.requestAnimationFrame(animate);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        gameBackground.draw();
        gameBoard.draw();
        baseBlue.draw();
        baseRed.draw();
        timerDisplay.innerHTML = timeLeft;
        fadeTick = (fadeTick >= 0.5) ? +(fadeTick = -0.5) : (fadeTick = fadeTick + 0.015);

        if (!isRunning) {
            window.clearInterval(timerController);
            return;
        }

        if (timeLeft <= 0) {
            isRunning = false;
            gameOver(currentPlayer, {
                firstElement: null,
                winSecuence: null,
            });
        }
    };

    function unpause() {
        isRunning = true;
        animate();
    }

    function pause() {
        isRunning = false;
    }

    canvas.addEventListener('mousedown', (e) => {
        if (!isRunning) {
            return;
        }
        let mouseX = e.layerX - e.target.offsetLeft;
        let mouseY = e.layerY - e.target.offsetTop;

        if (baseBlue.tookPiece(mouseX, mouseY) && currentPlayer == player1) {
            currentPiece = baseBlue.piece;
            currentMouseMove = new MouseMovement({ initialPosition: { mouseX, mouseY }, initialPiecePosition: { x: currentPiece.position.x, y: currentPiece.position.y } });
        }

        if (baseRed.tookPiece(mouseX, mouseY) && currentPlayer == player2) {
            currentPiece = baseRed.piece;
            currentMouseMove = new MouseMovement({ initialPosition: { mouseX, mouseY }, initialPiecePosition: { x: currentPiece.position.x, y: currentPiece.position.y } });
        }
    })

    canvas.addEventListener('mousemove', (e) => {
        if (!isRunning || !currentMouseMove) {
            return;
        }

        let mouseX = e.layerX - e.target.offsetLeft;
        let mouseY = e.layerY - e.target.offsetTop;

        let offset = currentMouseMove.calculateOffset(mouseX, mouseY);
        currentPiece.position = offset;


        let centerOfPieceX = currentPiece.position.x + ((tileSize * sizeFactor) / 2);
        let centerOfPieceY = currentPiece.position.y + (tileSize * sizeFactor);

        if (gameBoard.isOnBoard(centerOfPieceX, centerOfPieceY)) {
            let hitColumn = Math.floor((centerOfPieceX - (3 * tileSize * sizeFactor)) / (tileSize * sizeFactor));
            if (gameBoard.pieces[hitColumn].length < gameBoard.hBoard) {
                currentGhostPiece = new GhostPiece({ player: currentPlayer, position: { x: gameBoard.boardXStart + (hitColumn * tileSize * sizeFactor), y: ((1 + gameBoard.hBoard) * tileSize * sizeFactor) - (gameBoard.pieces[hitColumn].length * tileSize * sizeFactor) } })
            } else { currentGhostPiece = null };
        } else { currentGhostPiece = null };

    });

    canvas.addEventListener('mouseup', (e) => {
        if (!isRunning || !currentMouseMove) {
            return;
        }

        let centerOfPieceX = currentPiece.position.x + ((tileSize * sizeFactor) / 2);
        let centerOfPieceY = currentPiece.position.y + (tileSize * sizeFactor);

        if (gameBoard.isOnBoard(centerOfPieceX, centerOfPieceY)) {
            let hitColumn = Math.floor((centerOfPieceX - (3 * tileSize * sizeFactor)) / gameBoard.wBoard);
            currentPlayer.base.getNewPiece();
            gameBoard.addPiece({ player: currentPlayer, position: { x: centerOfPieceX - gameBoard.boardXStart, y: centerOfPieceY - gameBoard.boardYStart } });
        } else {
            currentPlayer.base.getNewPiece();
        }
        currentMouseMove = null;
        currentPiece = null;
    });
}