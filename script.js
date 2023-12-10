// JS PART

// Shuffle function to randomize card placement
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

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

// Function to initialize and start the game
function startGame(difficulty) {
    createTimer();

    let uniqueCardsCount;
    switch (difficulty) {
        case 'easy':
            uniqueCardsCount = 9; // 9 unique cards for easy level
            break;
        case 'medium':
            uniqueCardsCount = 13; // 13 unique cards for medium level
            break;
        case 'hard':
            uniqueCardsCount = 18; // 18 unique cards for hard level
            break;
        default:
            uniqueCardsCount = 9; // Default to easy level
    }

    const cards = Array.from({length: uniqueCardsCount}, (_, index) => String.fromCharCode(65 + index));

    // Duplicate the cards to create matching pairs
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

    // Start the timer when the game begins
    startTimer(2 * 60); // 2 minutes
}

// Function to start the timer
function startTimer(duration) {
    timerValue = duration;
    updateTimerDisplay();

    timer = setInterval(function () {
        timerValue--;
        updateTimerDisplay();

        if (timerValue <= 0) {
            clearInterval(timer);
            alert('Time is up! Game Over!');
            score = 0; // Reset score
            updateScoreDisplay(); // Update score display
            startGame(document.getElementById('difficulty').value);
        }
    }, 1000);
}

// Function to update the timer display
function updateTimerDisplay() {
    const timerDisplay = document.querySelector('.timer');
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

        // Update score for a correct match
        score += 10;
        updateScoreDisplay();


        const diff = document.getElementById('difficulty').value

        switch (diff) {
            case "easy":
                if (matchedPairs.length === 9) {
                    alert(`Congratulations! You found all the pairs! Your final score: ${score}`);
                }
                break;
            case "medium":
                if (matchedPairs.length === 13) {
                    alert(`Congratulations! You found all the pairs! Your final score: ${score}`);
                }
                break;
            case "hard":
                if (matchedPairs.length === 18) {
                    alert(`Congratulations! You found all the pairs! Your final score: ${score}`);
                }
                break
        }


    } else {
        // Deduct points for an incorrect match
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