// Shuffle function to randomize card placement
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function createTimer() {
    const timerDisplay = document.createElement('div');
    timerDisplay.classList.add('timer');
    document.body.appendChild(timerDisplay);
}

let flippedCards = [];
let matchedPairs = [];
let timer;
let timerValue;
let score = 0;

// Function to reset the game state
function resetGameState() {
    flippedCards = [];
    matchedPairs = [];
    score = 0;
    updateScoreDisplay();
}

// Function to initialize and start the game
function startGame(difficulty) {
    resetGameState();
    createTimer();

    let uniqueCardsCount;
    switch (difficulty) {
        case 'easy':
            uniqueCardsCount = 9;
            break;
        case 'medium':
            uniqueCardsCount = 12;
            break;
        case 'hard':
            uniqueCardsCount = 15;
            break;
        default:
            uniqueCardsCount = 9;
    }

    const cards = Array.from({length: uniqueCardsCount}, (_, index) => String.fromCharCode(65 + index));
    const cardPairs = shuffle([...cards, ...cards]);

    const memoryGame = document.getElementById('memory-game');
    memoryGame.innerHTML = '';

    cardPairs.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.cardValue = value;
        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card);
    });

    startTimer(2 * 60); // 2 minutes timer
}

// Function to start the timer
function startTimer(duration) {
    if (timer) clearInterval(timer);

    timerValue = duration;
    updateTimerDisplay();

    timer = setInterval(function () {
        timerValue--;
        updateTimerDisplay();

        if (timerValue <= 0) {
            clearInterval(timer);
            alert('Time is up! Game Over!');
            resetGameState();
            startGame(document.getElementById('difficulty').value);
        }
    }, 1000);
}

// Function to update the timer display
function updateTimerDisplay() {
    const timerDisplay = document.querySelector('.timer');
    if (!timerDisplay) return;

    const minutes = Math.floor(timerValue / 60);
    const seconds = timerValue % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to update the score display
function updateScoreDisplay() {
    const scoreTable = document.querySelector('.score-table');
    scoreTable.textContent = `Score: ${score}`;
}

// Function to handle card flipping
function flipCard() {
    if (flippedCards.length < 2) {
        this.innerHTML = this.dataset.cardValue;
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}

// Function to check if the flipped cards are a match
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.cardValue === card2.dataset.cardValue) {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        matchedPairs.push(card1.dataset.cardValue);

        score += 10;
        updateScoreDisplay();

        const difficulty = document.getElementById('difficulty').value;
        let requiredMatches = { 'easy': 9, 'medium': 12, 'hard': 15 }[difficulty];

        if (matchedPairs.length === requiredMatches) {
            alert(`Congratulations! You found all the pairs! Your final score: ${score}`);
            resetGameState();
            startGame(difficulty);
        }
    } else {
        score -= 5;
        updateScoreDisplay();

        card1.innerHTML = '';
        card2.innerHTML = '';
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
}

document.getElementById('difficulty').addEventListener('change', function () {
    startGame(this.value);
});

// Initial game start
startGame('easy');
