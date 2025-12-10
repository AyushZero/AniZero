// Quiz configuration
const config = {
    maxTries: 5,
    pointsPerCorrect: 10,
    imagesFolder: './images/'
};

// Quiz state
let currentImageIndex = 0;
let currentTries = 0;
let score = 0;
let quizData = [];

// DOM elements
const elements = {
    image: document.getElementById('anime-image'),
    input: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    skipBtn: document.getElementById('skip-btn'),
    feedback: document.getElementById('feedback'),
    hint: document.getElementById('hint'),
    currentImageSpan: document.getElementById('current-image'),
    totalImagesSpan: document.getElementById('total-images'),
    triesSpan: document.getElementById('tries'),
    scoreSpan: document.getElementById('score'),
    results: document.getElementById('results'),
    finalScore: document.getElementById('final-score'),
    restartBtn: document.getElementById('restart-btn'),
    quizArea: document.querySelector('.quiz-area')
};

// Load quiz data from images.json
async function loadQuizData() {
    try {
        const response = await fetch('images.json');
        quizData = await response.json();
        elements.totalImagesSpan.textContent = quizData.length;
        startQuiz();
    } catch (error) {
        console.error('Error loading quiz data:', error);
        elements.feedback.textContent = 'Error loading quiz data. Make sure images.json exists!';
        elements.feedback.className = 'feedback incorrect';
    }
}

// Start the quiz
function startQuiz() {
    currentImageIndex = 0;
    score = 0;
    updateScore();
    loadImage();
}

// Load current image
function loadImage() {
    if (currentImageIndex >= quizData.length) {
        endQuiz();
        return;
    }

    const currentData = quizData[currentImageIndex];
    elements.image.src = config.imagesFolder + currentData.filename;
    elements.currentImageSpan.textContent = currentImageIndex + 1;
    
    currentTries = 0;
    updateTries();
    setZoomLevel(5); // Start fully zoomed in
    
    elements.input.value = '';
    elements.input.disabled = false;
    elements.submitBtn.disabled = false;
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
    elements.hint.textContent = '';
    
    elements.input.focus();
}

// Set zoom level
function setZoomLevel(level) {
    elements.image.className = `zoom-${level}`;
}

// Check answer
function checkAnswer() {
    const userAnswer = elements.input.value.trim().toLowerCase();
    
    if (!userAnswer) {
        return;
    }

    const currentData = quizData[currentImageIndex];
    const correctAnswers = currentData.answers.map(a => a.toLowerCase());
    
    if (correctAnswers.some(answer => userAnswer === answer)) {
        // Correct answer!
        handleCorrectAnswer();
    } else {
        // Wrong answer
        handleWrongAnswer();
    }
}

// Handle correct answer
function handleCorrectAnswer() {
    const pointsEarned = config.pointsPerCorrect - (currentTries * 2);
    score += Math.max(pointsEarned, 2); // Minimum 2 points
    
    elements.feedback.textContent = `✓ Correct! +${Math.max(pointsEarned, 2)} points`;
    elements.feedback.className = 'feedback correct';
    
    setZoomLevel(1); // Show full image
    updateScore();
    
    elements.input.disabled = true;
    elements.submitBtn.disabled = true;
    
    setTimeout(() => {
        currentImageIndex++;
        loadImage();
    }, 2000);
}

// Handle wrong answer
function handleWrongAnswer() {
    currentTries++;
    updateTries();
    
    elements.feedback.textContent = '✗ Wrong! Try again...';
    elements.feedback.className = 'feedback incorrect';
    
    // Zoom out progressively
    const zoomLevel = Math.max(1, 5 - currentTries);
    setZoomLevel(zoomLevel);
    
    if (currentTries >= config.maxTries) {
        // Out of tries
        const currentData = quizData[currentImageIndex];
        elements.feedback.textContent = `✗ Out of tries! Answer: ${currentData.answers[0]}`;
        elements.feedback.className = 'feedback incorrect';
        elements.input.disabled = true;
        elements.submitBtn.disabled = true;
        
        setTimeout(() => {
            currentImageIndex++;
            loadImage();
        }, 3000);
    } else {
        // Show hint
        showHint();
    }
    
    elements.input.value = '';
}

// Show hint based on tries
function showHint() {
    const currentData = quizData[currentImageIndex];
    const hints = [
        '', // No hint on first try
        `Hint: ${currentData.hints[0] || 'Keep trying!'}`,
        `Hint: ${currentData.hints[1] || currentData.hints[0] || 'Getting closer!'}`,
        `Hint: The answer starts with "${currentData.answers[0][0]}"`,
        `Hint: ${currentData.answers[0].length} letters`
    ];
    
    elements.hint.textContent = hints[currentTries] || '';
}

// Skip current image
function skipImage() {
    const currentData = quizData[currentImageIndex];
    elements.feedback.textContent = `Skipped! Answer: ${currentData.answers[0]}`;
    elements.feedback.className = 'feedback incorrect';
    elements.input.disabled = true;
    elements.submitBtn.disabled = true;
    
    setZoomLevel(1); // Show full image
    
    setTimeout(() => {
        currentImageIndex++;
        loadImage();
    }, 2500);
}

// Update score display
function updateScore() {
    elements.scoreSpan.textContent = score;
}

// Update tries display
function updateTries() {
    elements.triesSpan.textContent = currentTries;
}

// End quiz
function endQuiz() {
    elements.quizArea.classList.add('hidden');
    elements.results.classList.remove('hidden');
    elements.finalScore.textContent = score;
}

// Restart quiz
function restartQuiz() {
    elements.results.classList.add('hidden');
    elements.quizArea.classList.remove('hidden');
    startQuiz();
}

// Event listeners
elements.submitBtn.addEventListener('click', checkAnswer);
elements.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
elements.skipBtn.addEventListener('click', skipImage);
elements.restartBtn.addEventListener('click', restartQuiz);

// Initialize quiz when page loads
loadQuizData();
