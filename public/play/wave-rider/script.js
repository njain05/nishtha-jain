const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const modal = document.getElementById('instructionModal');
const closeModalButton = document.getElementById('closeModal');
const themeSelector = document.getElementById('themeSelector');

let amplitude = 50; // Default amplitude
let frequency = 1; // Default frequency
let phaseShift = 0; // Default phase shift
let isPlaying = false;
let characterX = 50; // Start the character near the left side
let characterY = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Load high score from local storage
let obstacles = [];
let theme = 'default';

highScoreDisplay.textContent = highScore; // Display high score on page load

document.addEventListener('keydown', moveCharacter);

function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set theme-specific styles
    switch (theme) {
        case 'default':
            ctx.strokeStyle = '#c3073f';
            document.body.style.backgroundColor = '#282c34';
            document.body.style.color = 'white';
            break;
        case 'dark':
            ctx.strokeStyle = '#ffcc00';
            document.body.style.backgroundColor = '#000';
            document.body.style.color = '#ffcc00';
            break;
        case 'light':
            ctx.strokeStyle = '#007acc';
            document.body.style.backgroundColor = '#f0f0f0';
            document.body.style.color = '#007acc';
            break;
        case 'retro':
            ctx.strokeStyle = '#ff69b4';
            document.body.style.backgroundColor = '#000080';
            document.body.style.color = '#ff69b4';
            break;
    }

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let x = 0; x < canvas.width; x++) {
        const y = amplitude * Math.sin(frequency * (x + phaseShift)) + canvas.height / 2;
        ctx.lineTo(x, y);
        if (x === Math.floor(characterX)) characterY = y;  // Update character Y position based on its X
    }
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Draw the character on the wave
    drawCharacter();

    // Draw obstacles
    drawObstacles();

    if (isPlaying) {
        phaseShift -= 2; // Move the wave to simulate motion
        score++;
        scoreDisplay.textContent = score;
        requestAnimationFrame(drawWave);
    }
}

function drawCharacter() {
    ctx.beginPath();
    ctx.arc(characterX, characterY, 10, 0, Math.PI * 2); // Draw the character as a circle
    ctx.fillStyle = theme === 'dark' ? '#ffcc00' : '#00f';
    ctx.fill();
    ctx.closePath();
}

function moveCharacter(event) {
    const key = event.key;
    if (key === "ArrowRight" && characterX < canvas.width) {
        characterX += 10;
    } else if (key === "ArrowLeft" && characterX > 0) {
        characterX -= 10;
    }
}

function generateObstacle() {
    const obstacle = {
        x: Math.random() * canvas.width,
        y: 0,
        width: 10 + Math.random() * 30,
        height: 10 + Math.random() * 30,
    };
    obstacles.push(obstacle);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach((obstacle, index) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.y += 2; // Move obstacle down
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1); // Remove obstacle if it goes off screen
        }

        // Check for collision
        if (characterX < obstacle.x + obstacle.width &&
            characterX + 10 > obstacle.x &&
            characterY < obstacle.y + obstacle.height &&
            characterY + 10 > obstacle.y) {
            endGame();
        }
    });
}

function startGame() {
    isPlaying = true;
    obstacles = [];
    score = 0;
    characterX = 50; // Reset character to starting position
    drawWave();
    setInterval(generateObstacle, 2000); // Generate obstacles every 2 seconds
    setInterval(randomizeWaveParameters, 10000); // Randomize wave parameters every 10 seconds
}

function endGame() {
    isPlaying = false;
    alert(`Game Over! Your score: ${score}`);
    
    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Save high score to local storage
        highScoreDisplay.textContent = highScore; // Update displayed high score
    }
    
    startButton.textContent = "Restart Game";
}

function randomizeWaveParameters() {
    amplitude = 10 + Math.random() * 90; // Amplitude between 10 and 100
    frequency = 0.1 + Math.random() * 1.9; // Frequency between 0.1 and 2
    phaseShift = Math.random() * 2; // Phase shift between 0 and 2
}

closeModalButton.addEventListener('click', () => {
    modal.style.display = "none"; // Hide the modal
});

startButton.addEventListener('click', () => {
    if (!isPlaying) {
        startGame();
        startButton.textContent = "Pause Game";
    } else {
        isPlaying = false;
        startButton.textContent = "Start Game";
    }
});

themeSelector.addEventListener('change', (event) => {
    theme = event.target.value;
});
