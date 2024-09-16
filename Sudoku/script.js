class Sudoku {
    constructor() {
        this.board = Array.from({ length: 9 }, () => Array(9).fill('.'));
        this.inputElements = [];
    }

    // Helper function to check if placing num at board[row][col] is valid
    isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num || 
                board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) {
                return false;
            }
        }
        return true;
    }

    // Backtracking algorithm to solve the Sudoku puzzle
    solveSudoku(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    for (let num = 1; num <= 9; num++) {
                        const numStr = num.toString();
                        if (this.isValid(board, i, j, numStr)) {
                            board[i][j] = numStr;
                            if (this.solveSudoku(board)) {
                                return true;
                            }
                            board[i][j] = '.'; // backtrack
                        }
                    }
                    return false; // no valid number found, backtrack
                }
            }
        }
        return true; // puzzle solved
    }

    // Function to generate a completely filled valid Sudoku grid
    generateFullGrid() {
        this.board = Array.from({ length: 9 }, () => Array(9).fill('.'));
        this.solveSudoku(this.board); // Fills the board with a valid solution
    }

    // Remove random cells to create a puzzle (with a single solution)
    createPuzzle(difficulty = 40) { // difficulty defines how many cells will be removed
        this.generateFullGrid(); // First generate a full valid grid

        const removedCells = [];
        while (removedCells.length < difficulty) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (this.board[row][col] !== '.') {
                this.board[row][col] = '.';
                removedCells.push([row, col]);
            }
        }
    }
    validateInput(row, col, value) {
        const boardCopy = this.board.map(arr => [...arr]); // Create a copy of the current board
        boardCopy[row][col] = '.'; // Temporarily remove the current input

        // Check if the new value is valid for the row, column, and 3x3 grid
        return this.isValid(boardCopy, row, col, value);
    }

    renderBoard() {
        const sudokuGrid = document.getElementById('sudoku-grid');
        sudokuGrid.innerHTML = '';

        this.inputElements = [];

        for (let i = 0; i < 9; i++) {
            this.inputElements[i] = [];
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('sudoku-cell');

                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.classList.add('sudoku-input');

                if (this.board[i][j] !== '.') {
                    input.value = this.board[i][j];
                    input.disabled = true;
                }

                 // Add event listener for validation on user input
                 input.addEventListener('input', (event) => {
                    const value = event.target.value;
                    if (value >= 1 && value <= 9) {
                        if (this.validateInput(i, j, value)) {
                            input.style.border = '1px solid green'; // Valid input, show green border
                            this.board[i][j] = value; // Update board
                        } else {
                            input.style.border = '2px solid red'; // Invalid input, show red border
                        }
                    } else {
                        input.style.border = ''; // Reset if not a number between 1-9
                    }
                });
                this.inputElements[i][j] = input;
                cell.appendChild(input);
                sudokuGrid.appendChild(cell);
            }
        }
    }

    // Initialize the game
    initGame() {
        this.createPuzzle(); // Adjust difficulty by passing a number between 20 to 60 (higher means easier)
        this.renderBoard();
    }
}

// Initialize Sudoku game
const sudoku = new Sudoku();
window.onload = () => sudoku.initGame();

document.getElementById('solve-btn').addEventListener('click', () => {
    if (sudoku.solveSudoku(sudoku.board)) {
        sudoku.renderBoard();
        alert('Solution!');
        document.getElementById('solve-btn').textContent = 'Refresh';
        document.getElementById('solve-btn').removeEventListener('click', () => {});
    } else {
        alert('No solution exists!');
    }
});
