const board = document.getElementById('gameBoard');
const gameOverMessage = document.getElementById('gameOverMessage');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');
const boardSize = 20;
const tileSize = board.clientWidth / boardSize;
let snake, direction, food, gameLoop, newDirection, score;

document.addEventListener('keydown', changeDirection);
restartButton.addEventListener('click', restartGame);
startGame();

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    newDirection = { x: 0, y: 0 };
    food = generateFood();
    score = 0;
    updateScore();
    gameOverMessage.classList.remove('show');
    gameOverMessage.classList.add('hidden');
    gameLoop = setInterval(updateGame, 100);
}

function updateGame() {
    direction = newDirection;
    moveSnake();
    if (checkCollision()) {
        clearInterval(gameLoop);
        gameOverMessage.classList.remove('hidden');
        gameOverMessage.classList.add('show');
        return;
    }
    if (checkFoodCollision()) {
        snake.push({ ...snake[snake.length - 1] });
        food = generateFood();
        score++;
        updateScore();
    }
    drawBoard();
}

function drawBoard() {
    board.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${segment.x * tileSize}px`;
        snakeElement.style.top = `${segment.y * tileSize}px`;
        snakeElement.classList.add('snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x * tileSize}px`;
    foodElement.style.top = `${food.y * tileSize}px`;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(newHead);
    snake.pop();
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) newDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) newDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) newDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) newDirection = { x: 1, y: 0 };
            break;
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function generateFood() {
    let newFood;
    while (!newFood || snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        newFood = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    }
    return newFood;
}

function updateScore() {
    scoreElement.textContent = `Pontuação: ${score}`;
}

function restartGame() {
    clearInterval(gameLoop);
    startGame();
}
