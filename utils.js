'use strict';

export const STATUSES = {
    HIDDEN: 'hidden',
    MARKED: 'marked',
    NUMBER: 'number',
    MINE: 'mine'
}

export function createTable(boardSize, numberOfMines) {
    const board = [];
    const minesCoords = getMinesCoords(boardSize, numberOfMines);

    for (let x = 0; x < boardSize; x++) {
        const row = [];

        for (let y = 0; y < boardSize; y++) {
            const div = document.createElement('div');
            div.dataset.status = STATUSES.HIDDEN;

            const cell = {
                x,
                y,
                div,
                mine: minesCoords.some(mine => matchCells(mine, { x, y })),
                get status() {
                    return this.div.dataset.status;
                },
                set status(value) {
                    this.div.dataset.status = value;
                }
            }

            row.push(cell);
        }

        board.push(row);
    }

    return board;
}

export function markCell(cell) {
    if (cell.status !== STATUSES.MARKED && cell.status !== STATUSES.HIDDEN) {
        return false;
    }

    if (cell.status === STATUSES.MARKED) {
        cell.status = STATUSES.HIDDEN;
    } else {
        cell.status = STATUSES.MARKED;
    }
}

export function revealCell(board, cell) {
    if (cell.status !== STATUSES.HIDDEN) return;

    if (cell.mine) {
        cell.status = STATUSES.MINE;
        return;
    }

    cell.status = STATUSES.NUMBER;

    const adjacentCells = getAdjacentCells(board, cell);
    const adjacentMines = adjacentCells.filter(cell => cell.mine);

    if (!adjacentMines.length) {
        adjacentCells.forEach(cell => revealCell(board, cell))
    } else {
        cell.div.textContent = adjacentMines.length;
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(cell => {
            return (cell.status === STATUSES.NUMBER ||
                (cell.mine && (
                    cell.status === STATUSES.MARKED ||
                    cell.status === STATUSES.HIDDEN
                ))
            )
        })
    })
}

function getMinesCoords(boardSize, numberOfMines) {
    const mines = [];

    while (mines.length !== numberOfMines) {
        const mine = {
            x: getRandomNumber(boardSize),
            y: getRandomNumber(boardSize),
        }

        if (!mines.some(m => matchCells(m, mine))) {
            mines.push(mine);
        }
    }

    return mines;
}

function matchCells(a, b) {
    return a.x === b.x && a.y === b.y;
}

function getRandomNumber(size) {
    return Math.floor(Math.random() * size);
}

function getAdjacentCells(board, { x, y }) {
    const neighbors = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const neighbor = board[x + xOffset]?.[y + yOffset];
            neighbor && neighbors.push(neighbor);
        }
    }

    return neighbors;
}