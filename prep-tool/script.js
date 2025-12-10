const fileInput = document.getElementById('file-input');
const fileCount = document.getElementById('file-count');
const uploadSection = document.getElementById('upload-section');
const processSection = document.getElementById('process-section');
const completeSection = document.getElementById('complete-section');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const animeNameInput = document.getElementById('anime-name');
const saveBtn = document.getElementById('save-btn');
const skipBtn = document.getElementById('skip-current');
const currentImageSpan = document.getElementById('current-image');
const totalImagesSpan = document.getElementById('total-images');
const processedCountSpan = document.getElementById('processed-count');
const pairsCountSpan = document.getElementById('pairs-count');
const downloadBtn = document.getElementById('download-btn');
const restartBtn = document.getElementById('restart-btn');

let images = [];
let currentIndex = 0;
let currentImage = null;
let processedImages = [];
let cropSelection = null;
let isDrawing = false;
let startX, startY;

// File upload
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        loadImages(files);
    }
});

async function loadImages(files) {
    images = [];
    for (const file of files) {
        const img = await loadImage(file);
        images.push({ file, img, name: file.name });
    }
    
    fileCount.textContent = `${images.length} images loaded`;
    setTimeout(() => {
        uploadSection.classList.add('hidden');
        processSection.classList.remove('hidden');
        totalImagesSpan.textContent = images.length;
        showCurrentImage();
    }, 1000);
}

function loadImage(file) {
    return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = (e) => {
            img.onload = () => resolve(img);
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    });
}

function showCurrentImage() {
    if (currentIndex >= images.length) {
        showComplete();
        return;
    }
    
    currentImage = images[currentIndex].img;
    currentImageSpan.textContent = currentIndex + 1;
    
    // Resize canvas to fit image
    const maxWidth = 1000;
    const maxHeight = 600;
    let width = currentImage.width;
    let height = currentImage.height;
    
    if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
    }
    
    if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    drawImage();
    animeNameInput.value = '';
    animeNameInput.focus();
    cropSelection = null;
}

function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    
    if (cropSelection) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
            cropSelection.x,
            cropSelection.y,
            cropSelection.width,
            cropSelection.height
        );
        ctx.setLineDash([]);
    }
}

// Canvas mouse events for cropping
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDrawing = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    cropSelection = {
        x: Math.min(startX, currentX),
        y: Math.min(startY, currentY),
        width: Math.abs(currentX - startX),
        height: Math.abs(currentY - startY)
    };
    
    drawImage();
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Save button
saveBtn.addEventListener('click', () => {
    const animeName = animeNameInput.value.trim();
    
    if (!animeName) {
        alert('Please enter anime name');
        return;
    }
    
    if (!cropSelection || cropSelection.width < 10 || cropSelection.height < 10) {
        alert('Please select crop area for zoomed image');
        return;
    }
    
    saveImagePair(animeName);
});

// Skip button
skipBtn.addEventListener('click', () => {
    currentIndex++;
    showCurrentImage();
});

function saveImagePair(animeName) {
    // Save full image
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = currentImage.width;
    fullCanvas.height = currentImage.height;
    const fullCtx = fullCanvas.getContext('2d');
    fullCtx.drawImage(currentImage, 0, 0);
    
    // Save cropped/zoomed image
    const scaleX = currentImage.width / canvas.width;
    const scaleY = currentImage.height / canvas.height;
    
    const cropX = cropSelection.x * scaleX;
    const cropY = cropSelection.y * scaleY;
    const cropWidth = cropSelection.width * scaleX;
    const cropHeight = cropSelection.height * scaleY;
    
    const zoomedCanvas = document.createElement('canvas');
    zoomedCanvas.width = currentImage.width;
    zoomedCanvas.height = currentImage.height;
    const zoomedCtx = zoomedCanvas.getContext('2d');
    
    // Draw cropped area scaled up to fill canvas
    zoomedCtx.drawImage(
        currentImage,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, zoomedCanvas.width, zoomedCanvas.height
    );
    
    // Store both images
    processedImages.push({
        name: animeName,
        full: fullCanvas.toDataURL('image/png'),
        zoomed: zoomedCanvas.toDataURL('image/png')
    });
    
    currentIndex++;
    showCurrentImage();
}

function showComplete() {
    processSection.classList.add('hidden');
    completeSection.classList.remove('hidden');
    processedCountSpan.textContent = images.length;
    pairsCountSpan.textContent = processedImages.length;
}

// Download button
downloadBtn.addEventListener('click', async () => {
    const zip = new JSZip();
    const folder = zip.folder('prepared-images');
    
    processedImages.forEach((item, index) => {
        // Sanitize name and ensure it's filesystem safe
        const sanitizedName = item.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        const pairNum = (index + 1).toString().padStart(3, '0');
        
        // Remove data:image/png;base64, prefix
        const fullData = item.full.split(',')[1];
        const zoomedData = item.zoomed.split(',')[1];
        
        // Ensure proper .png extension
        folder.file(`${pairNum}-${sanitizedName}-full.png`, fullData, { base64: true });
        folder.file(`${pairNum}-${sanitizedName}-zoomed.png`, zoomedData, { base64: true });
    });
    
    // Generate metadata file
    const metadata = processedImages.map((item, index) => {
        const sanitizedName = item.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        const pairNum = (index + 1).toString().padStart(3, '0');
        return {
            anime: item.name,
            full: `${pairNum}-${sanitizedName}-full.png`,
            zoomed: `${pairNum}-${sanitizedName}-zoomed.png`
        };
    });
    
    folder.file('metadata.json', JSON.stringify(metadata, null, 2));
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anime-quiz-images.zip';
    a.click();
    URL.revokeObjectURL(url);
});

// Restart button
restartBtn.addEventListener('click', () => {
    images = [];
    currentIndex = 0;
    processedImages = [];
    cropSelection = null;
    fileInput.value = '';
    
    completeSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
    fileCount.textContent = '';
});
