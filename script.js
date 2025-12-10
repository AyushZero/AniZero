const image = document.getElementById('anime-image');
const input = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const hintBtn = document.getElementById('hint-btn');
const zoomBtn = document.getElementById('zoom-btn');
const skipBtn = document.getElementById('skip-btn');
const pointsDisplay = document.getElementById('points');
const feedback = document.getElementById('feedback');
const questionNumber = document.getElementById('question-number');

// Quiz data - pairs of images (zoomed and full versions)
const quizData = [
    { zoomed: '001-naruto-zoomed.png', full: '001-naruto-full.png', answer: 'naruto' },
    { zoomed: '002-boruto-zoomed.png', full: '002-boruto-full.png', answer: 'boruto' },
    { zoomed: '003-noragami-zoomed.png', full: '003-noragami-full.png', answer: 'noragami' },
    { zoomed: '004-kaguya-zoomed.png', full: '004-kaguya-full.png', answer: 'kaguya' },
    { zoomed: '005-bleach-zoomed.png', full: '005-bleach-full.png', answer: 'bleach' }
];

let currentQuestion = 0;
let totalPoints = 0;
let questionPoints = 2000;
let hintUsed = false;
let zoomUsed = false;

// Initialize quiz
function initQuestion() {
    if (currentQuestion >= quizData.length) {
        showFinalScore();
        return;
    }

    const current = quizData[currentQuestion];
    image.src = `./images/${current.zoomed}`;
    
    questionPoints = 2000;
    hintUsed = false;
    questionPoints = 2000;
    hintUsed = false;xtContent = `question ${currentQuestion + 1}/5`;
    pointsDisplay.textContent = `${questionPoints} points`;
    feedback.textContent = '';
    input.value = '';
    input.disabled = false;
    submitBtn.disabled = false;
    hintBtn.disabled = false;
    zoomBtn.disabled = false;
    skipBtn.disabled = false;
}

// Hint button
hintBtn.addEventListener('click', () => {
    if (hintUsed) return;
    
    hintUsed = true;
    questionPoints -= 1000;
    pointsDisplay.textContent = `${questionPoints} points`;
    hintBtn.disabled = true;
    
    const answer = quizData[currentQuestion].answer;
    const firstLetters = answer.split(' ').map(word => word[0]).join(' ');
    feedback.textContent = `first letters: ${firstLetters}`;
});

// Zoom out button
zoomBtn.addEventListener('click', () => {
    if (zoomUsed) return;
    
    zoomUsed = true;
    questionPoints -= 500;
    pointsDisplay.textContent = `${questionPoints} points`;
    zoomBtn.disabled = true;
    
    const current = quizData[currentQuestion];
    image.src = `./images/${current.full}`;
});

// Submit answer
function checkAnswer() {
    const userAnswer = input.value.trim().toLowerCase();
    
    if (!userAnswer) return;
    
    const correctAnswer = quizData[currentQuestion].answer.toLowerCase();
    
    if (userAnswer === correctAnswer) {
        feedback.textContent = `correct! +${questionPoints} points`;
        input.disabled = true;
        submitBtn.disabled = true;
        hintBtn.disabled = true;
        zoomBtn.disabled = true;
        skipBtn.disabled = true;
        
        totalPoints += questionPoints;
        
        const current = quizData[currentQuestion];
        image.src = `./images/${current.full}`;
        
        setTimeout(() => {
            currentQuestion++;
            initQuestion();
        }, 2000);
    } else {
        feedback.textContent = 'wrong, try again';
    }
}

// Skip button
skipBtn.addEventListener('click', () => {
    const current = quizData[currentQuestion];
    feedback.textContent = `skipped! answer: ${current.answer}`;
    input.disabled = true;
    submitBtn.disabled = true;
    hintBtn.disabled = true;
    zoomBtn.disabled = true;
    skipBtn.disabled = true;
    
    image.src = `./images/${current.full}`;
    
    setTimeout(() => {
        currentQuestion++;
        initQuestion();
    }, 2500);
});

function showFinalScore() {
    questionNumber.textContent = 'quiz complete!';
    pointsDisplay.textContent = `final score: ${totalPoints}/10000`;
    feedback.textContent = '';
    
    // Hide quiz controls
    input.style.display = 'none';
    submitBtn.style.display = 'none';
    hintBtn.style.display = 'none';
    zoomBtn.style.display = 'none';
    skipBtn.style.display = 'none';
    document.querySelector('.powerups').style.display = 'none';
    
    // Show results grid
    const container = document.querySelector('.image-container');
    container.innerHTML = '';
    container.style.width = '100%';
    container.style.height = 'auto';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    container.style.gap = '20px';
    container.style.padding = '20px';
    
    quizData.forEach((item) => {
        const resultItem = document.createElement('div');
        resultItem.style.textAlign = 'center';
        
        const img = document.createElement('img');
        img.src = `./images/${item.full}`;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.border = '2px solid #fff';
        
        const answer = document.createElement('div');
        answer.textContent = item.answer;
        answer.style.marginTop = '10px';
        answer.style.fontSize = '16px';
        
        resultItem.appendChild(img);
        resultItem.appendChild(answer);
        container.appendChild(resultItem);
    });
}

submitBtn.addEventListener('click', checkAnswer);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

// Start quiz
initQuestion();
