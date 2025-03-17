document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const generateBtn = document.getElementById('generate-btn');
    const songTitleEl = document.getElementById('song-title');
    const animateBtn = document.getElementById('animate-btn');
    const characterSvg = document.getElementById('character-svg');
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('color-picker');
    const brushSize = document.getElementById('brush-size');
    const clearBtn = document.getElementById('clear-btn');
    const saveDrawingBtn = document.getElementById('save-drawing-btn');
    
    // Drawing variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Current song data
    let currentSongData = null;
    
    // Initialize canvas
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
    
    // Fill canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Event listeners for song generation
    generateBtn.addEventListener('click', generateTitle);
    
    // Event listeners for animation
    animateBtn.addEventListener('click', animateCharacter);
    
    // Event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    colorPicker.addEventListener('change', (e) => {
        ctx.strokeStyle = e.target.value;
    });
    
    brushSize.addEventListener('change', (e) => {
        ctx.lineWidth = e.target.value;
    });
    
    clearBtn.addEventListener('click', clearCanvas);
    
    saveDrawingBtn.addEventListener('click', saveAndAnimateDrawing);
    
    // Functions
    async function generateTitle() {
        // Add loading animation
        songTitleEl.textContent = "Generating...";
        songTitleEl.classList.add('wiggle');
        
        try {
            const response = await fetch('/generate');
            const data = await response.json();
            currentSongData = data;
            
            // Update the song title with animation
            setTimeout(() => {
                songTitleEl.classList.remove('wiggle');
                songTitleEl.textContent = data.title;
                songTitleEl.style.backgroundColor = getRandomBrightColor();
                
                // Enable animate button
                animateBtn.disabled = false;
                
                // Generate initial character
                generateCharacter(data.animal);
            }, 500);
            
        } catch (error) {
            console.error('Error generating title:', error);
            songTitleEl.textContent = "Error generating title. Try again!";
            songTitleEl.classList.remove('wiggle');
        }
    }
    
    function generateCharacter(animalData) {
        // Clear previous character
        while (characterSvg.firstChild) {
            characterSvg.removeChild(characterSvg.firstChild);
        }
        
        const animal = animalData.animal;
        const characteristics = animalData.characteristics;
        
        // Create a simple character based on the animal name
        const svgns = "http://www.w3.org/2000/svg";
        
        // Set background
        const background = document.createElementNS(svgns, "rect");
        background.setAttribute("width", "300");
        background.setAttribute("height", "300");
        background.setAttribute("fill", "#f8f9fa");
        characterSvg.appendChild(background);
        
        // Based on the animal, create a simple representation
        let character;
        const centerX = 150;
        const centerY = 150;
        
        // Body - base shape is a circle
        character = document.createElementNS(svgns, "circle");
        character.setAttribute("cx", centerX);
        character.setAttribute("cy", centerY);
        character.setAttribute("r", 80);
        character.setAttribute("fill", characteristics.color);
        character.setAttribute("stroke", "#333");
        character.setAttribute("stroke-width", "3");
        character.classList.add("character-body");
        characterSvg.appendChild(character);
        
        // Eyes
        const leftEye = document.createElementNS(svgns, "circle");
        leftEye.setAttribute("cx", centerX - 25);
        leftEye.setAttribute("cy", centerY - 20);
        leftEye.setAttribute("r", 15);
        leftEye.setAttribute("fill", "white");
        leftEye.setAttribute("stroke", "#333");
        leftEye.setAttribute("stroke-width", "2");
        characterSvg.appendChild(leftEye);
        
        const rightEye = document.createElementNS(svgns, "circle");
        rightEye.setAttribute("cx", centerX + 25);
        rightEye.setAttribute("cy", centerY - 20);
        rightEye.setAttribute("r", 15);
        rightEye.setAttribute("fill", "white");
        rightEye.setAttribute("stroke", "#333");
        rightEye.setAttribute("stroke-width", "2");
        characterSvg.appendChild(rightEye);
        
        // Pupils
        const leftPupil = document.createElementNS(svgns, "circle");
        leftPupil.setAttribute("cx", centerX - 25);
        leftPupil.setAttribute("cy", centerY - 20);
        leftPupil.setAttribute("r", 7);
        leftPupil.setAttribute("fill", "#333");
        characterSvg.appendChild(leftPupil);
        
        const rightPupil = document.createElementNS(svgns, "circle");
        rightPupil.setAttribute("cx", centerX + 25);
        rightPupil.setAttribute("cy", centerY - 20);
        rightPupil.setAttribute("r", 7);
        rightPupil.setAttribute("fill", "#333");
        characterSvg.appendChild(rightPupil);
        
        // Mouth based on mood
        let mouth;
        if (characteristics.mood === "happy" || characteristics.mood === "excited") {
            mouth = document.createElementNS(svgns, "path");
            mouth.setAttribute("d", `M${centerX - 40},${centerY + 10} Q${centerX},${centerY + 50} ${centerX + 40},${centerY + 10}`);
            mouth.setAttribute("fill", "none");
            mouth.setAttribute("stroke", "#333");
            mouth.setAttribute("stroke-width", "5");
        } else if (characteristics.mood === "surprised") {
            mouth = document.createElementNS(svgns, "circle");
            mouth.setAttribute("cx", centerX);
            mouth.setAttribute("cy", centerY + 20);
            mouth.setAttribute("r", 15);
            mouth.setAttribute("fill", "#333");
        } else {
            mouth = document.createElementNS(svgns, "path");
            mouth.setAttribute("d", `M${centerX - 30},${centerY + 20} L${centerX + 30},${centerY + 20}`);
            mouth.setAttribute("fill", "none");
            mouth.setAttribute("stroke", "#333");
            mouth.setAttribute("stroke-width", "5");
        }
        characterSvg.appendChild(mouth);
        
        // Add accessory if specified
        if (characteristics.accessory !== "nothing") {
            let accessory;
            switch (characteristics.accessory) {
                case "hat":
                    accessory = document.createElementNS(svgns, "path");
                    accessory.setAttribute("d", `M${centerX - 60},${centerY - 50} L${centerX - 10},${centerY - 100} L${centerX + 60},${centerY - 50}`);
                    accessory.setAttribute("fill", getRandomBrightColor());
                    accessory.setAttribute("stroke", "#333");
                    accessory.setAttribute("stroke-width", "3");
                    break;
                case "sunglasses":
                    accessory = document.createElementNS(svgns, "rect");
                    accessory.setAttribute("x", centerX - 60);
                    accessory.setAttribute("y", centerY - 30);
                    accessory.setAttribute("width", 120);
                    accessory.setAttribute("height", 20);
                    accessory.setAttribute("fill", "#333");
                    accessory.setAttribute("rx", 5);
                    break;
                case "bowtie":
                    accessory = document.createElementNS(svgns, "path");
                    accessory.setAttribute("d", `M${centerX - 40},${centerY + 60} L${centerX},${centerY + 40} L${centerX + 40},${centerY + 60} L${centerX},${centerY + 80} Z`);
                    accessory.setAttribute("fill", getRandomBrightColor());
                    accessory.setAttribute("stroke", "#333");
                    accessory.setAttribute("stroke-width", "2");
                    break;
                case "cape":
                    accessory = document.createElementNS(svgns, "path");
                    accessory.setAttribute("d", `M${centerX - 50},${centerY - 50} L${centerX},${centerY + 100} L${centerX + 50},${centerY - 50}`);
                    accessory.setAttribute("fill", getRandomBrightColor());
                    accessory.setAttribute("stroke", "#333");
                    accessory.setAttribute("stroke-width", "2");
                    // Put the cape behind the character
                    characterSvg.insertBefore(accessory, character);
                    break;
                case "backpack":
                    accessory = document.createElementNS(svgns, "rect");
                    accessory.setAttribute("x", centerX - 40);
                    accessory.setAttribute("y", centerY - 40);
                    accessory.setAttribute("width", 80);
                    accessory.setAttribute("height", 100);
                    accessory.setAttribute("fill", getRandomBrightColor());
                    accessory.setAttribute("stroke", "#333");
                    accessory.setAttribute("stroke-width", "2");
                    accessory.setAttribute("rx", 10);
                    // Put the backpack behind the character
                    characterSvg.insertBefore(accessory, character);
                    break;
            }
            if (accessory) characterSvg.appendChild(accessory);
        }
        
        // Add the animal name
        const label = document.createElementNS(svgns, "text");
        label.setAttribute("x", centerX);
        label.setAttribute("y", 270);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-family", "Fredoka One, cursive");
        label.setAttribute("font-size", "20");
        label.setAttribute("fill", "#333");
        label.textContent = animal;
        characterSvg.appendChild(label);
    }
    
    function animateCharacter() {
        // Remove any existing animations
        const characterBody = characterSvg.querySelector('.character-body');
        characterBody.classList.remove('animated', 'spin', 'wiggle');
        
        // Force a reflow to restart animation
        void characterBody.offsetWidth;
        
        // Add a random animation
        const animations = ['animated', 'spin', 'wiggle'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        characterBody.classList.add(randomAnimation);
    }
    
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function handleTouch(e) {
        e.preventDefault();
        
        if (e.type === 'touchstart') {
            isDrawing = true;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            lastX = touch.clientX - rect.left;
            lastY = touch.clientY - rect.top;
        } else if (e.type === 'touchmove' && isDrawing) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - rect.top;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
            
            [lastX, lastY] = [offsetX, offsetY];
        }
    }
    
    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    function saveAndAnimateDrawing() {
        // Get the canvas data
        const drawingData = canvas.toDataURL('image/png');
        
        // Create an animation of the drawing in the character container
        while (characterSvg.firstChild) {
            characterSvg.removeChild(characterSvg.firstChild);
        }
        
        // Create an image element in the SVG
        const svgns = "http://www.w3.org/2000/svg";
        
        // Set background
        const background = document.createElementNS(svgns, "rect");
        background.setAttribute("width", "300");
        background.setAttribute("height", "300");
        background.setAttribute("fill", "#f8f9fa");
        characterSvg.appendChild(background);
        
        // Create an SVG image element to hold our drawing
        const drawingImage = document.createElementNS(svgns, "image");
        drawingImage.setAttribute("href", drawingData);
        drawingImage.setAttribute("width", "280");
        drawingImage.setAttribute("height", "280");
        drawingImage.setAttribute("x", "10");
        drawingImage.setAttribute("y", "10");
        drawingImage.classList.add("character-body");
        characterSvg.appendChild(drawingImage);
        
        // Add title if we have one
        if (currentSongData) {
            const label = document.createElementNS(svgns, "text");
            label.setAttribute("x", 150);
            label.setAttribute("y", 270);
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("font-family", "Fredoka One, cursive");
            label.setAttribute("font-size", "20");
            label.setAttribute("fill", "#333");
            label.textContent = currentSongData.animal.animal || "My Character";
            characterSvg.appendChild(label);
        }
        
        // Enable animation button
        animateBtn.disabled = false;
        
        // Send drawing data to the server (optional for future persistence)
        fetch('/save_drawing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                drawing: drawingData,
                title: currentSongData ? currentSongData.title : null
            })
        }).then(response => response.json())
          .then(data => console.log('Drawing saved:', data))
          .catch(error => console.error('Error saving drawing:', error));
    }
    
    function getRandomBrightColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 100%, 65%)`;
    }
});
