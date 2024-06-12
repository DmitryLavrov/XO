document.addEventListener('DOMContentLoaded', () => {
  const sizeOptions = document.querySelectorAll('.size-option');
  const boardElement = document.getElementById('board');
  const resetButton = document.getElementById('reset');
  const message = document.getElementById('message');
  const currentPlayerDisplay = document.getElementById('current-player');
  let currentPlayer = 'X';
  let board;
  let gameActive = true;
  let boardSize;
  let winningCombinations;

  function createBoard(size) {
    boardSize = size;
    board = Array(size * size).fill(null);
    boardElement.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    boardElement.style.gridTemplateRows = `repeat(${size}, 100px)`;
    boardElement.innerHTML = '';
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-index', i);
      cell.addEventListener('click', handleCellClick);
      boardElement.appendChild(cell);
    }
    winningCombinations = generateWinningCombinations(size);
  }

  function generateWinningCombinations(size) {
    const combinations = [];

    // Rows
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(i * size + j);
      }
      combinations.push(row);
    }

    // Columns
    for (let i = 0; i < size; i++) {
      const column = [];
      for (let j = 0; j < size; j++) {
        column.push(i + j * size);
      }
      combinations.push(column);
    }

    // Diagonals
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < size; i++) {
      diagonal1.push(i * size + i);
      diagonal2.push((i + 1) * (size - 1));
    }
    combinations.push(diagonal1, diagonal2);

    return combinations;
  }

  function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    if (board[cellIndex] || !gameActive) {
      return;
    }

    board[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
      gameActive = false;
      message.textContent = `Игрок ${currentPlayer} выиграл!`;
      return;
    }

    if (board.every((cell) => cell)) {
      gameActive = false;
      message.textContent = 'Ничья!';
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = currentPlayer;
  }

  function checkWin() {
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return board[index] === currentPlayer;
      });
    });
  }

  function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    message.textContent = '';
    currentPlayerDisplay.textContent = currentPlayer;
    createBoard(boardSize);
  }

  sizeOptions.forEach((option) => {
    option.addEventListener('click', () => {
      createBoard(parseInt(option.getAttribute('data-size')));
      document.getElementById('size-selection').style.display = 'none';
      boardElement.style.display = 'grid';
      resetButton.style.display = 'block';
      document.getElementById('turn').style.display = 'block';
    });
  });

  resetButton.addEventListener('click', resetGame);
});
