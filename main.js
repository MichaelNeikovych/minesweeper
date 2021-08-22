'use strict';

import { 
    checkWin, 
    createTable, 
    markCell, 
    revealCell, 
    STATUSES 
} from './utils.js';

const boardSize = 10;
const numberOfMines = 10;

const board = createTable(boardSize, numberOfMines);
const boardRootElement = document.querySelector('.board');
boardRootElement.style.setProperty('--size', boardSize);
const minesLeftNumber = document.querySelector('[data-number-of-mines]');
const minesLeftText = document.querySelector('.mines-left');

board.forEach(row => {
    row.forEach(cell => {
        boardRootElement.append(cell.div);

        cell.div.addEventListener('click', () => {
            revealCell(board, cell);
            checkGameEnd(cell);
        })

        cell.div.addEventListener('contextmenu', e => {
            e.preventDefault();

            if ((minesLeftNumber.textContent === '0') 
                && (cell.status !== STATUSES.MARKED)) return false;

            markCell(cell);
            minesLeft();
        })
    })
})

function minesLeft() {
    const mines = board.reduce((count, row) => {
        return count += row.filter(cell => cell.status === STATUSES.MARKED) .length
    }, 0);

    const minesLeft = numberOfMines - mines;

    if (minesLeft < 0) {
        minesLeftNumber.textContent = 0;
    } else {
        minesLeftNumber.textContent = minesLeft;
    }
}

function checkGameEnd(cell) {
    const lost = cell.mine;
    const won = checkWin(board);
    console.log(lost);

    if (lost || won) {
        boardRootElement.addEventListener('click', e => e.stopImmediatePropagation(), {capture: true})
        boardRootElement.addEventListener('contextmenu', e => e.stopImmediatePropagation(), {capture: true})
    }

    if (won) {
        minesLeftText.textContent = 'Congratulations! You have won!';
    }

    if (lost) {
        minesLeftText.textContent = 'Unfortunately you have lost!';

        board.forEach(row => {
            row.forEach(cell => {
                cell.mine ? cell.status = STATUSES.MINE : false;
            })
        })
    }
}