document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const resetButton = document.getElementById('reset');
  const message = document.getElementById('message');
  const currentPlayerDisplay = document.getElementById('current-player');
  let currentPlayer = 'X';
  let board = Array(9).fill(null);
  let gameActive = true;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

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
    board = Array(9).fill(null);
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach((cell) => {
      cell.textContent = '';
      cell.classList.remove('x', 'o');
    });
    message.textContent = '';
    currentPlayerDisplay.textContent = currentPlayer;
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
  });

  resetButton.addEventListener('click', resetGame);
});
