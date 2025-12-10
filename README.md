# 🎌 Anime Quiz Website

An interactive anime character guessing game with a unique zoom-out mechanic. Each wrong guess gradually zooms out the image, making it easier to identify the character.

## ✨ Features

- **Progressive Zoom-Out Mechanic**: Images start fully zoomed in (5x) and gradually zoom out with each incorrect guess
- **Smart Scoring System**: Earn more points for guessing correctly with fewer tries
- **Hints System**: Get progressive hints as you make more attempts
- **Easy to Update**: Simply add images to a folder and update a JSON file
- **Responsive Design**: Works on desktop and mobile devices
- **Reusable**: Perfect for daily/weekly quiz updates

## 🚀 Quick Start

### 1. Add Your Images

Place 5 anime character images in the `images/` folder:
- image1.jpg
- image2.jpg
- image3.jpg
- image4.jpg
- image5.jpg

### 2. Update the Quiz Data

Edit `images.json` to match your images:

```json
[
    {
        "filename": "image1.jpg",
        "answers": ["Character Name", "Alternative Name"],
        "hints": [
            "First hint (shows after 1st wrong guess)",
            "Second hint (shows after 2nd wrong guess)"
        ]
    }
]
```

### 3. Open the Website

Simply open `index.html` in your web browser!

For deployment, you can use:
- **GitHub Pages**: Free and easy
- **Netlify**: Drag and drop deployment
- **Vercel**: Simple deployment with git integration

## 📝 How It Works

1. **Start Zoomed In**: Each image starts at 5x zoom (very close up)
2. **Make a Guess**: Type your answer and submit
3. **Zoom Out on Wrong Answer**: Each incorrect guess zooms out one level
4. **5 Tries Maximum**: You have 5 attempts per image
5. **Progressive Hints**: Get hints after each wrong answer
6. **Score Points**: Correct answers earn points (more points for fewer tries)

### Zoom Levels
- Try 1: 5x zoom (very close)
- Try 2: 4x zoom
- Try 3: 3x zoom
- Try 4: 2x zoom
- Try 5: 1x zoom (full image)

### Scoring
- First try: 10 points
- Second try: 8 points
- Third try: 6 points
- Fourth try: 4 points
- Fifth try: 2 points

## 🔧 Customization

### Change Number of Images

You can have any number of images. Just:
1. Add images to the `images/` folder
2. Add corresponding entries to `images.json`
3. The quiz will automatically adapt!

### Change Zoom Levels

Edit `styles.css` to adjust zoom levels:

```css
.zoom-5 { transform: scale(5); } /* Most zoomed in */
.zoom-4 { transform: scale(4); }
.zoom-3 { transform: scale(3); }
.zoom-2 { transform: scale(2); }
.zoom-1 { transform: scale(1); } /* Full image */
```

### Change Max Tries

Edit `script.js`:

```javascript
const config = {
    maxTries: 5,  // Change this number
    pointsPerCorrect: 10,
    imagesFolder: './images/'
};
```

### Change Colors/Style

Edit `styles.css` to customize the look:
- Background gradient
- Button colors
- Font styles
- Spacing and sizing

## 📂 File Structure

```
Anii-Zero/
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── script.js           # Quiz logic and zoom mechanic
├── images.json         # Quiz data (images and answers)
├── images/             # Folder for anime images
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
└── README.md           # This file
```

## 🌐 Deployment

### GitHub Pages

1. Create a GitHub repository
2. Upload all files
3. Go to Settings > Pages
4. Select main branch
5. Your site will be live at `https://username.github.io/repository-name/`

### Netlify

1. Drag and drop your folder to Netlify
2. Your site is live instantly!

### Daily Updates

To update the quiz daily:
1. Replace images in the `images/` folder
2. Update `images.json` with new answers and hints
3. Commit and push (if using Git deployment)
4. Or re-upload files (if using drag-and-drop)

## 🎮 Usage Tips

- **Multiple Accepted Answers**: Add variations of names users might type
- **Good Hints**: Start vague, get more specific
- **Image Selection**: Choose images where zoom makes it harder (close-ups of faces, distinctive features)
- **Testing**: Test with friends to ensure difficulty is balanced

## 🛠️ Troubleshooting

**Images not showing?**
- Check image paths in `images.json`
- Ensure images are in the `images/` folder
- Check browser console for errors

**Quiz not loading?**
- Make sure `images.json` is valid JSON
- Check browser console for JavaScript errors

**Zoom not working?**
- Clear browser cache
- Check that CSS file is loaded properly

## 📄 License

Free to use and modify for your projects!

## 🤝 Contributing

Feel free to fork and improve! Some ideas:
- Timer mode
- Multiplayer support
- Leaderboard system
- Different categories (anime, manga, games)
- Sound effects

---

Enjoy your anime quiz! 🎌✨
