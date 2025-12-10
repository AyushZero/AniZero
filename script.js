const image = document.getElementById('anime-image');
const input = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const hintBtn = document.getElementById('hint-btn');
const zoomBtn = document.getElementById('zoom-btn');
const pointsDisplay = document.getElementById('points');
const feedback = document.getElementById('feedback');

let points = 2000;
let hintUsed = false;
let zoomUsed = false;
let correctAnswer = 'naruto'; // Change this to your anime name

// Hint button - shows first letters
hintBtn.addEventListener('click', () => {
    if (hintUsed) return;
    
    hintUsed = true;
    points -= 1000;
    pointsDisplay.textContent = points;
    hintBtn.disabled = true;
    
    const firstLetters = correctAnswer.split(' ').map(word => word[0]).join(' ');
    feedback.textContent = `first letters: ${firstLetters}`;
});

// Zoom out button
zoomBtn.addEventListener('click', () => {
    if (zoomUsed) return;
    
    zoomUsed = true;
    points -= 500;
    pointsDisplay.textContent = points;
    zoomBtn.disabled = true;
    
    image.classList.add('zoomed-out');
});

// Submit answer
function checkAnswer() {
    const userAnswer = input.value.trim().toLowerCase();
    
    if (!userAnswer) return;
    
    if (userAnswer === correctAnswer.toLowerCase()) {
        feedback.textContent = `correct! final score: ${points}`;
        input.disabled = true;
        submitBtn.disabled = true;
        hintBtn.disabled = true;
        zoomBtn.disabled = true;
        image.classList.add('zoomed-out');
    } else {
        feedback.textContent = 'wrong, try again';
        input.value = '';
    }
}

submitBtn.addEventListener('click', checkAnswer);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});
