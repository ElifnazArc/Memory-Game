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


// JavaScript to update score and difficulty
let scoreValue = 0;
let difficultySelect = document.getElementById('difficulty');

function updateDifficulty() {
    let selectedDifficulty = difficultySelect.value;
    console.log('Selected Difficulty:', selectedDifficulty);
    // You can add logic here to update the difficulty settings as needed
}

function updateScore() {
    scoreValue++;
    document.getElementById('score').textContent = scoreValue;
}

// Example: Call updateScore to increment the score
updateScore();


// Function to initialize and start the game
function startGame() {
    const cards = Array.from({length: 18}, (_, index) => String.fromCharCode(65 + index % 9));

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

        if (matchedPairs.length === 18) {
            alert('Congratulations! You found all the pairs!');
            startGame();
        }
    } else {
        card1.innerHTML = '';
        card2.innerHTML = '';
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
}

let flippedCards = [];
let matchedPairs = [];


startGame();



