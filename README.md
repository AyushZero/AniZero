# Anime Quiz

A minimalist anime guessing game where images start zoomed in and players can use powerups to help identify the anime.

## 🎮 Play the Game

Open `index.html` in your browser to start playing!

### How to Play
- Each quiz has 5 anime to guess
- Start with **2000 points** per question
- Two powerups available:
  - **First Letters (-1000 points)**: Shows first letter of each word
  - **Zoom Out (-500 points)**: Reveals the full image
- **Skip** button to move to next question (0 points)
- Maximum score: **10,000 points**

## 🛠️ Creating New Quizzes

### Option 1: Use the Prep Tool (Recommended)

1. Open `prep-tool/index.html` in your browser
2. Upload your anime screenshots
3. For each image:
   - Enter the anime name
   - Click and drag to select the crop area for the zoomed version
   - Click "Save & Next"
4. Download the prepared images
5. Extract and copy image pairs to the `images/` folder
6. Use Option 2 to update the quiz

### Option 2: Auto-Update Quiz Data

1. Place your prepared images in the `images/` folder
   - Name format: `001-anime-name-full.png` and `001-anime-name-zoomed.png`
2. Open `update-quiz.html` in your browser
3. Select the images folder
4. Copy the generated code
5. Replace the `quizData` array in `script.js`

### Option 3: Manual Update

Edit the `quizData` array in `script.js`:

```javascript
const quizData = [
    { zoomed: '001-anime-zoomed.png', full: '001-anime-full.png', answer: 'anime name' },
    // Add more entries...
];
```

## 📁 Project Structure

```
Anii-Zero/
├── index.html              # Main quiz page
├── styles.css              # Styling
├── script.js              # Quiz logic
├── images/                # Quiz images folder
│   ├── 001-anime-full.png
│   ├── 001-anime-zoomed.png
│   └── ...
├── prep-tool/             # Image preparation tool
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── update-quiz.html       # Auto quiz updater
└── README.md
```

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub
2. Go to Settings > Pages
3. Select your branch
4. Your site will be live at `https://username.github.io/repo-name/`

### Netlify / Vercel
Simply drag and drop the folder or connect your Git repository

## 🎨 Customization

### Change Image Size
Edit `styles.css`:
```css
.image-container {
    width: 768px;  /* Adjust width */
    height: 432px; /* Adjust height */
}
```

### Change Zoom Level
Edit `styles.css`:
```css
#anime-image {
    transform: scale(3); /* Change zoom (1-5) */
}
```

### Change Point Values
Edit `script.js`:
```javascript
let questionPoints = 2000;  // Starting points
// In hint button: points -= 1000;
// In zoom button: points -= 500;
```

## 📝 License

Free to use and modify!

## 🤝 Contributing

Feel free to fork and improve the project!
