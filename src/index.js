module.exports = function solveSudoku(matrix) {
    return solveSudokuRandom(matrix);
};

function solveSudokuRandom(matrix) {
    let emptyCells = findEmptyCells(matrix);
    const copy = matrix.map(r => [...r]);
    while (!isSolved(matrix, copy)) {
        for (let i = 0; i < emptyCells.length; i++) {
            let cell = emptyCells[i];
            copy[cell.row][cell.col] = Math.random() * 9 + 1;
        }
    }
    return copy;
}

function solveSudokuBrute(matrix) {
    function fillEmpty() {
        while (index < emptyCells.length) {
            let cell = emptyCells[index];
            for (let guess = 1; guess <= 9; guess++) {
                if (matrix[cell.row][cell.col] !== 0) {
                    break;
                } else if (isValid(cell.row, cell.col, guess)) {
                    matrix[cell.row][cell.col] = guess;
                    index++;
                    fillEmpty();
                } else if (guess === 9) {
                    cell = emptyCells[--index];
                    matrix[cell.row][cell.col] = 0;
                    return;
                }
            }
        }
    }

    function isValid(row, col, value) {
        for (let line = 0; line < 9; line++) {
            if (matrix[line][col] === value || matrix[row][line] === value) {
                return false;
            }
        }
        let boxRow = Math.floor(row / 3);
        let boxCol = Math.floor(col / 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (matrix[boxRow * 3 + i][boxCol * 3 + j] === value) {
                    return false;
                }
            }
        }
        return true;
    }

    let emptyCells = findEmptyCells(matrix);
    let index = 0;
    fillEmpty();
    return matrix;
}

function findEmptyCells(matrix) {
    let emptyCells = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (matrix[row][col] === 0) {
                emptyCells.push({row: row, col: col});
            }
        }
    }
    return emptyCells;
}

function isSolved(initial, sudoku) {
    for (let i = 0; i < 9; i++) {
        let [r, c] = [Math.floor(i / 3) * 3, (i % 3) * 3];
        if (
            (sudoku[i].reduce((s, v) => s.add(v), new Set()).size != 9) ||
            (sudoku.reduce((s, v) => s.add(v[i]), new Set()).size != 9) ||
            (sudoku.slice(r, r + 3).reduce((s, v) => v.slice(c, c + 3).reduce((s, v) => s.add(v), s), new Set()).size != 9)
        ) return false;
    }
    return initial.every((row, rowIndex) => {
        return row.every((num, colIndex) => {
            return num === 0 || sudoku[rowIndex][colIndex] === num;
        });
    });
}
