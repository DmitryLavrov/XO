document.addEventListener('DOMContentLoaded', () => {
  const sizeOptions = document.querySelectorAll('.size-option'); // Опции выбора размера поля
  const boardElement = document.getElementById('board'); // Элемент игрового поля
  const resetButton = document.getElementById('reset'); // Кнопка сброса игры
  const message = document.getElementById('message'); // Сообщение о результате игры
  const currentPlayerDisplay = document.getElementById('current-player'); // Отображение текущего игрока
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

    if (checkWin()) {
      gameActive = false; // Игра завершена
      message.textContent = `Игрок ${currentPlayer} выиграл!`; // Сообщение о победе
      return;
    }

    if (board.every((cell) => cell)) {
      gameActive = false; // Игра завершена ничьей
      message.textContent = 'Ничья!';
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Переключение текущего игрока
    currentPlayerDisplay.textContent = currentPlayer; // Обновление отображения текущего игрока
  }

  // Проверка выигрышных комбинаций
  function checkWin() {
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return board[index] === currentPlayer;
      });
    });
  }

  // Сброс игры
  function resetGame() {
    gameActive = true; // Активируем игру
    currentPlayer = 'X'; // Сброс текущего игрока
    message.textContent = ''; // Очистка сообщения
    currentPlayerDisplay.textContent = currentPlayer; // Обновление отображения текущего игрока
    createBoard(boardSize); // Создание игрового поля
  }

  // Добавление обработчиков кликов для выбора размера поля
  sizeOptions.forEach((option) => {
    option.addEventListener('click', () => {
      createBoard(parseInt(option.getAttribute('data-size'))); // Создание поля с выбранным размером
      document.getElementById('size-selection').style.display = 'none'; // Скрытие опций выбора размера
      boardElement.style.display = 'grid'; // Отображение игрового поля
      resetButton.style.display = 'block'; // Отображение кнопки сброса
      document.getElementById('turn').style.display = 'block'; // Отображение текущего игрока
    });
  });

  resetButton.addEventListener('click', resetGame); // Добавление обработчика клика для сброса игры
});
