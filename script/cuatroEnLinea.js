"use strict";

const canvas = document.querySelector('#juego');
const ctx = canvas.getContext('2d');

let isRunning = true;

const tileSize = 32;
const sizeFactor = 1;
let nEnLinea = 4;

canvas.width = (nEnLinea + 3 + 6) * tileSize * sizeFactor;
canvas.height = (nEnLinea + 2 + 6) * tileSize * sizeFactor;

let currentPlayer;

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
}

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

class PlayerBase {
    constructor({
        position,
        player,
    }) {
        this.position = position;
        this.player = player;
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
    }
}

class Board {
    constructor({
        position,
        wBoard = 7,
        hBoard = 6,
    }) {
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
            (currentPlayer == player1) ? currentPlayer = player2: currentPlayer = player1;
            this.checkWinCondition();
        }
    }

    checkWinCondition() {
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
                    alert('gano ' + piece.player.name);
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
                    alert('gano ' + piece.player.name);
                    return;
                }
                let toTopRight = 1;
                let nextColX = col + 1;
                let nextPosX = pos + 1;
                while (this.pieces[nextColX] && this.pieces[nextColX][nextPosX] && this.pieces[nextColX][nextPosX].player == piece.player && toTopRight < nEnLinea) {
                    nextColX++;
                    nextPosX++;
                    toTopRight++;
                    console.log(toTopRight);
                }
                if (toTopRight == nEnLinea) {
                    isRunning = false;
                    alert('gano ' + piece.player.name);
                    return;
                }
                let toTopLeft = 1;
                let nextColY = col - 1;
                let nextPosY = pos + 1;
                while (this.pieces[nextColY] && this.pieces[nextColY][nextPosY] && this.pieces[nextColY][nextPosY].player == piece.player && toTopLeft < nEnLinea) {
                    nextColY--
                    nextPosY++;
                    toTopLeft++;
                    console.log(toTopLeft);
                }
                if (toTopLeft == nEnLinea) {
                    isRunning = false;
                    alert('gano ' + piece.player.name);
                    return;
                }
            })
        }
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

let gameBackground = new Background({ wBoard: nEnLinea + 3, hBoard: nEnLinea + 2 });
let gameBoard = new Board({ position: { x: tileSize * sizeFactor * 3, y: tileSize * sizeFactor * 3 }, wBoard: nEnLinea + 3, hBoard: nEnLinea + 2 });
let player1 = new Player({ name: 'pedro', pieces: PlayerPiece.jugador1 });
let player2 = new Player({ name: 'juan', pieces: PlayerPiece.jugador2 });
let baseBlue = new PlayerBase({ position: { x: 0, y: 0 }, player: player1 });
let baseRed = new PlayerBase({ position: { x: (nEnLinea + 6) * tileSize * sizeFactor, y: 0 }, player: player2 });
currentPlayer = player1;

function animate() {

    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    gameBackground.draw();
    gameBoard.draw();
    baseBlue.draw();
    baseRed.draw();
    if (!isRunning) {
        return;
    }
};

function unpause() {
    isRunning = true;
    animate();
}

function pause() {
    isRunning = false;
}

animate();

canvas.addEventListener('mousedown', (e) => {
    if (!isRunning) {
        return;
    }
    let mouseX = e.layerX - e.target.offsetLeft;
    let mouseY = e.layerY - e.target.offsetTop;

    if (mouseX > gameBoard.boardXStart && mouseX < gameBoard.boardXEnd && mouseY > gameBoard.boardYStart && mouseY < gameBoard.boardYEnd) {
        gameBoard.addPiece({ player: currentPlayer, position: { x: mouseX - gameBoard.boardXStart, y: mouseY - gameBoard.boardYStart } });

    }
})