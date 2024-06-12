document.addEventListener('DOMContentLoaded', () => {
  const sizeOptions = document.querySelectorAll('.size-option'); // Опции выбора размера поля
  const boardElement = document.getElementById('board'); // Элемент игрового поля
  const resetButton = document.getElementById('reset'); // Кнопка сброса игры
  const message = document.getElementById('message'); // Сообщение о результате игры
  const currentPlayerDisplay = document.getElementById('current-player'); // Отображение текущего игрока
  const clickSound = document.getElementById('click-sound'); // Звук клика
  const winSound = document.getElementById('win-sound'); // Звук победы
  const drawSound = document.getElementById('draw-sound'); // Звук ничьей
  let currentPlayer = 'X'; // Текущий игрок
  let board; // Массив для хранения состояния игрового поля
  let gameActive = true; // Статус активности игры
  let boardSize; // Размер игрового поля
  let winningCombinations; // Массив с выигрышными комбинациями

  // Создание игрового поля
  function createBoard(size) {
    boardSize = size;
    board = Array(size * size).fill(null); // Инициализация игрового поля пустыми значениями
    boardElement.style.gridTemplateColumns = `repeat(${size}, 100px)`; // Настройка колонок
    boardElement.style.gridTemplateRows = `repeat(${size}, 100px)`; // Настройка строк
    boardElement.innerHTML = ''; // Очистка игрового поля
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell'); // Добавление класса для ячейки
      cell.setAttribute('data-index', i); // Установка индекса ячейки
      cell.addEventListener('click', handleCellClick); // Добавление обработчика клика по ячейке
      boardElement.appendChild(cell); // Добавление ячейки на игровое поле
    }
    winningCombinations = generateWinningCombinations(size); // Генерация выигрышных комбинаций
    saveGameState(); // Сохранение состояния игры
  }

  // Генерация выигрышных комбинаций
  function generateWinningCombinations(size) {
    const combinations = [];

    // Горизонтальные линии
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(i * size + j);
      }
      combinations.push(row);
    }

    // Вертикальные линии
    for (let i = 0; i < size; i++) {
      const column = [];
      for (let j = 0; j < size; j++) {
        column.push(i + j * size);
      }
      combinations.push(column);
    }

    // Диагонали
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < size; i++) {
      diagonal1.push(i * size + i);
      diagonal2.push((i + 1) * (size - 1));
    }
    combinations.push(diagonal1, diagonal2);

    return combinations;
  }

  // Обработка клика по ячейке
  function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    if (board[cellIndex] || !gameActive) {
      return; // Если ячейка уже занята или игра неактивна, ничего не делаем
    }

    board[cellIndex] = currentPlayer; // Обновление состояния игрового поля
    cell.textContent = currentPlayer; // Отображение текущего игрока в ячейке
    cell.classList.add(currentPlayer.toLowerCase()); // Добавление класса для стилизации
    clickSound.play(); // Проигрывание звука клика

    if (checkWin()) {
      gameActive = false; // Игра завершена
      message.textContent = `Игрок ${currentPlayer} выиграл!`; // Сообщение о победе
      highlightWinningCombination(); // Подсветка выигрышной комбинации
      winSound.play(); // Проигрывание звука победы
      return;
    }

    if (board.every((cell) => cell)) {
      gameActive = false; // Игра завершена ничьей
      message.textContent = 'Ничья!';
      drawSound.play(); // Проигрывание звука ничьей
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Переключение текущего игрока
    currentPlayerDisplay.textContent = currentPlayer; // Обновление отображения текущего игрока
    saveGameState(); // Сохранение состояния игры
  }

  // Проверка выигрышных комбинаций
  function checkWin() {
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return board[index] === currentPlayer;
      });
    });
  }

  // Подсветка выигрышной комбинации
  function highlightWinningCombination() {
    winningCombinations.forEach((combination) => {
      if (combination.every((index) => board[index] === currentPlayer)) {
        combination.forEach((index) => {
          document.querySelector(`.cell[data-index='${index}']`).classList.add('highlight');
        });
      }
    });
  }

  // Сброс игры
  function resetGame() {
    gameActive = true; // Активируем игру
    currentPlayer = 'X'; // Сброс текущего игрока
    message.textContent = ''; // Очистка сообщения
    currentPlayerDisplay.textContent = currentPlayer; // Обновление отображения текущего игрока
    createBoard(boardSize); // Создание игрового поля
    localStorage.removeItem('ticTacToeState'); // Удаление сохраненного состояния
  }

  // Сохранение состояния игры
  function saveGameState() {
    const gameState = {
      board: board,
      currentPlayer: currentPlayer,
      gameActive: gameActive,
      boardSize: boardSize,
    };
    localStorage.setItem('ticTacToeState', JSON.stringify(gameState));
  }

  // Загрузка состояния игры
  function loadGameState() {
    const gameState = JSON.parse(localStorage.getItem('ticTacToeState'));
    if (gameState) {
      board = gameState.board;
      currentPlayer = gameState.currentPlayer;
      gameActive = gameState.gameActive;
      boardSize = gameState.boardSize;
      createBoard(boardSize);
      board.forEach((player, index) => {
        if (player) {
          const cell = document.querySelector(`.cell[data-index='${index}']`);
          cell.textContent = player;
          cell.classList.add(player.toLowerCase());
        }
      });
      currentPlayerDisplay.textContent = currentPlayer;
    }
  }

  sizeOptions.forEach((option) => {
    option.addEventListener('click', () => {
      createBoard(parseInt(option.getAttribute('data-size'))); // Создание игрового поля выбранного размера
      document.getElementById('size-selection').style.display = 'none'; // Скрытие выбора размера
      boardElement.style.display = 'grid'; // Показ игрового поля
      resetButton.style.display = 'block'; // Показ кнопки сброса
      document.getElementById('turn').style.display = 'block'; // Показ информации о текущем ходе
    });
  });

  resetButton.addEventListener('click', resetGame); // Добавление обработчика для кнопки сброса игры

  loadGameState(); // Загрузка состояния игры при загрузке страницы
});
