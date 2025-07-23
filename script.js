// Game state variables
let player1Score = 0;
let player2Score = 0;
let gamesPlayed = 0;
let draws = 0;
let isRolling = false;

// DOM elements
const img1 = document.querySelector(".img1");
const img2 = document.querySelector(".img2");
const resultText = document.querySelector("#result");
const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const score1Element = document.getElementById("score1");
const score2Element = document.getElementById("score2");
const gamesPlayedElement = document.getElementById("gamesPlayed");
const drawsElement = document.getElementById("draws");
const player1Element = document.querySelector(".player1");
const player2Element = document.querySelector(".player2");



// Initialize the game
function initGame() {
    updateScoreDisplay();
    updateStatsDisplay();
    resultText.textContent = "🎲 Roll the Dice 🎲";
}

// Roll dice animation
function rollDice() {
    if (isRolling) return; // Prevent multiple rolls
    
    isRolling = true;
    rollBtn.disabled = true;
    rollBtn.style.opacity = "0.6";
    
    // Add rolling animation
    img1.classList.add("rolling");
    img2.classList.add("rolling");
    
    // Clear previous winner highlights
    player1Element.classList.remove("winner");
    player2Element.classList.remove("winner");
    
    // Show rolling text
    resultText.textContent = "🎲 Rolling... 🎲";
    
    // Animate dice changes during roll
    let rollCount = 0;
    const rollAnimation = setInterval(() => {
        const tempRoll1 = Math.floor(Math.random() * 6) + 1;
        const tempRoll2 = Math.floor(Math.random() * 6) + 1;
        img1.src = `./images/dice${tempRoll1}.png`;
        img2.src = `./images/dice${tempRoll2}.png`;
        rollCount++;
        
        if (rollCount >= 10) { // Stop animation after 10 iterations
            clearInterval(rollAnimation);
            finishRoll();
        }
    }, 100);
}

// Finish the roll and determine winner
function finishRoll() {
    // Generate final random numbers
    const randomNumber1 = Math.floor(Math.random() * 6) + 1;
    const randomNumber2 = Math.floor(Math.random() * 6) + 1;
    
    // Set final dice images
    img1.src = `./images/dice${randomNumber1}.png`;
    img2.src = `./images/dice${randomNumber2}.png`;
    
    // Remove rolling animation
    setTimeout(() => {
        img1.classList.remove("rolling");
        img2.classList.remove("rolling");
    }, 100);
    
    // Determine winner and update scores
    gamesPlayed++;
    
    if (randomNumber1 > randomNumber2) {
        player1Score++;
        resultText.textContent = "🏆 Player 1 Wins! 🏆";
        player1Element.classList.add("winner");
        createConfetti();
    } else if (randomNumber2 > randomNumber1) {
        player2Score++;
        resultText.textContent = "🏆 Player 2 Wins! 🏆";
        player2Element.classList.add("winner");
        createConfetti();
    } else {
        draws++;
        resultText.textContent = "🤝 It's a Draw! 🤝";
    }
    
    // Update displays
    updateScoreDisplay();
    updateStatsDisplay();
    
    // Re-enable roll button
    setTimeout(() => {
        isRolling = false;
        rollBtn.disabled = false;
        rollBtn.style.opacity = "1";
    }, 1500);
}

// Update score display
function updateScoreDisplay() {
    score1Element.textContent = player1Score;
    score2Element.textContent = player2Score;
}

// Update stats display
function updateStatsDisplay() {
    gamesPlayedElement.textContent = gamesPlayed;
    drawsElement.textContent = draws;
}

// Reset game
function resetGame() {
    player1Score = 0;
    player2Score = 0;
    gamesPlayed = 0;
    draws = 0;
    
    // Reset dice to initial state
    img1.src = "./images/dice1.png";
    img2.src = "./images/dice1.png";
    
    // Clear winner highlights
    player1Element.classList.remove("winner");
    player2Element.classList.remove("winner");
    
    // Update displays
    updateScoreDisplay();
    updateStatsDisplay();
    resultText.textContent = "🎲 Roll the Dice 🎲";
    
    // Add reset animation
    [img1, img2].forEach(img => {
        img.style.transform = "scale(0.8)";
        setTimeout(() => {
            img.style.transform = "scale(1)";
        }, 200);
    });
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.animation = 'confettiFall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 10);
    }
}

// Add confetti animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isRolling) {
        event.preventDefault();
        rollDice();
    } else if (event.code === 'KeyR') {
        resetGame();
    }
});

// Event listeners
rollBtn.addEventListener('click', rollDice);
resetBtn.addEventListener('click', resetGame);

// Add click events to dice for fun
img1.addEventListener('click', () => {
    if (!isRolling) {
        img1.style.transform = 'rotateY(360deg)';
        setTimeout(() => {
            img1.style.transform = 'rotateY(0deg)';
        }, 600);
    }
});

img2.addEventListener('click', () => {
    if (!isRolling) {
        img2.style.transform = 'rotateY(360deg)';
        setTimeout(() => {
            img2.style.transform = 'rotateY(0deg)';
        }, 600);
    }
});

// Initialize game on page load
document.addEventListener('DOMContentLoaded', initGame);

// Auto-save game state to localStorage
function saveGameState() {
    const gameState = {
        player1Score,
        player2Score,
        gamesPlayed,
        draws
    };
    localStorage.setItem('diceGameState', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const savedState = localStorage.getItem('diceGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        player1Score = gameState.player1Score || 0;
        player2Score = gameState.player2Score || 0;
        gamesPlayed = gameState.gamesPlayed || 0;
        draws = gameState.draws || 0;
        updateScoreDisplay();
        updateStatsDisplay();
    }
}

// Load saved state on page load
loadGameState();

// Save state after each game
const originalFinishRoll = finishRoll;
finishRoll = function() {
    originalFinishRoll.call(this);
    saveGameState();
};