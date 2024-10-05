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
// Criar uma lista de jogadores
let players = [];

// Adiciona função para salvar pontuação
const saveScoreButton = document.getElementById('saveScoreButton');
const scoreList = document.getElementById('scoreList');

// Quando o botão "Salvar pontuação" for clicado
saveScoreButton.addEventListener('click', function () {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        // Adiciona o jogador e sua pontuação ao ranking
        players.push({ name: playerName, points: score });
        updateRanking();
        document.getElementById('playerName').value = ''; // Limpa o campo de nome
    }
});

// Função para atualizar o ranking
function updateRanking() {
    // Limpa a lista de ranking
    scoreList.innerHTML = '';

    // Ordena os jogadores com base nos pontos (maior para menor)
    const sortedPlayers = players.sort((a, b) => b.points - a.points);

    // Renderiza os jogadores ordenados no HTML
    sortedPlayers.forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${player.name} - ${player.points} pontos`;
        scoreList.appendChild(li);
    });
}
// Carregar sons
const eatSound = new Audio('comer.mp3'); // Som ao comer comida
const gameOverSound = new Audio('gameover.mp3'); // Som de fim de jogo

// Função para tocar som quando come a comida
function playEatSound() {
    eatSound.play();
}

// Função para tocar som de fim de jogo
function playGameOverSound() {
    gameOverSound.play();
}

// Modifique a função updateGame para tocar o som ao comer comida
function updateGame() {
    direction = newDirection;
    moveSnake();

    if (checkCollision()) {
        clearInterval(gameLoop);
        playGameOverSound();  // Tocar som de fim de jogo
        gameOverMessage.classList.remove('hidden');
        gameOverMessage.classList.add('show');
        return;
    }

    if (checkFoodCollision()) {
        snake.push({ ...snake[snake.length - 1] });
        food = generateFood();
        score++;
        updateScore();
        playEatSound(); // Tocar som de comer
    }

    drawBoard();
}
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('keydown', changeDirection); // Mantém o controle por teclado para desktop
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleGesture();
}

function handleGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Determina se o gesto foi na horizontal ou vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Gesto horizontal
        if (diffX > 0) {
            // Deslizou para a direita
            if (direction.x === 0) newDirection = { x: 1, y: 0 };
        } else {
            // Deslizou para a esquerda
            if (direction.x === 0) newDirection = { x: -1, y: 0 };
        }
    } else {
        // Gesto vertical
        if (diffY > 0) {
            // Deslizou para baixo
            if (direction.y === 0) newDirection = { x: 0, y: 1 };
        } else {
            // Deslizou para cima
            if (direction.y === 0) newDirection = { x: 0, y: -1 };
        }
    }
}
