import { currentImageData, flattenedImages, getRandomImage } from "./data.js";
import { toggleVisibility, updateResult, clearMapHighlight } from "./ui.js";

export let knowsAnswer = false;
let confirmationMode = false;

let mapCheck = "Null";
const maps = ["Mill", "Metro", "Skyway", "Commons", "Canal"];

const element_dot = document.querySelector("#dot");

let distanceX = 0;
let distanceY = 0;
let cords = {};

// Sets up all event listeners for game interaction
export const setupEventListeners = () => {
    // Submit button - check if coordinates are correct
    document.querySelector("#btn-submit").addEventListener("click", function() {
        confirmationMode = false;
        submitted(cords.x, cords.y, currentImageData, mapCheck);
    });

    // Continue/Next button - load next image
    document.querySelector("#btn-continue").addEventListener("click", function() {
        handlesContinue();
    });

    // Get map button - show correct map and highlight it
    document.querySelector("#btn-map").addEventListener("click", function() {
        confirmationMode = false;
        highlightCorrectMap();
    });

    // Get answer button - show correct answer spot
    document.querySelector("#btn-answer").addEventListener("click", function() {
        confirmationMode = false;
        showCorrectAnswer();
    });

    // Clear button - hide the map and dot
    document.querySelector("#btn-clear").addEventListener("click", function() {
        confirmationMode = false;
        toggleVisibility(false, "clickable-image", "dot");
        mapCheck = "Clear";
        clearMapHighlight();
    });

    setUpMapButtons();

    // Listen for clicks on the map image to place guesses
    document.querySelector("#clickable-image").addEventListener("click", function(event) {
        confirmationMode = false;
        placeDot();
    });
    
    // Add window resize listener to adjust dot position
    window.addEventListener('resize', updateDotPosition);
}

// Sets up map selection buttons
const setUpMapButtons = () => {
    maps.forEach((mapName) => {
        document.querySelector(`#btn-${mapName.toLowerCase()}`).addEventListener("click", function () {
            confirmationMode = false;
            document.querySelector("#clickable-image").src = `assets/Minimaps/${mapName}_Minimap_Overlay.png`;
            mapCheck = mapName;
            clearMapHighlight();
            toggleVisibility(true, "clickable-image", "dot");
        });
    });
}

// Checks if submitted guess is correct
const submitted = (x, y, currentImageData, mapCheck) => {
    distanceX = Math.abs(x - currentImageData.imageData.cords.x);
    distanceY = Math.abs(y - currentImageData.imageData.cords.y);

    if (mapCheck == currentImageData.map){
        if (distanceX < 10 && distanceY < 15){
            updateResult('You got it right!', 'green');
            knowsAnswer = true;
        }
        else {
            updateResult('Not quite right', 'red');
        }
    }
    else{
        updateResult('Wrong map', 'red');
    }
}

// Handles the continue button functionality
const handlesContinue = () => {
    // If confirmation is requested and user presses continue again
    if (confirmationMode) {
        confirmationMode = false;
        
        if (flattenedImages.length == 0) {
            updateResult("That's the last image! Hope you had fun.", 'default');
            return;
        }

        getRandomImage();
        knowsAnswer = false;
        toggleVisibility(false, "clickable-image", "dot");
        mapCheck = "Clear";
        clearMapHighlight();
        updateResult("Where is this image?", 'default');
        return;
    }
    
    // First click when they don't know the answer
    if (!knowsAnswer) {
        updateResult("You don't know the answer. Press NEXT again to continue anyway.", 'default');
        confirmationMode = true;
        return;
    }
    
    // Normal continue when they know the answer
    if (flattenedImages.length == 0) {
        updateResult("That's the last image! Hope you had fun.", 'default');
        return;
    }

    getRandomImage();
    knowsAnswer = false;
    toggleVisibility(false, "clickable-image", "dot");
    mapCheck = "Clear";
    clearMapHighlight();
    updateResult("Where is this image?", 'default');
}

// Highlights the correct map button and shows that map
const highlightCorrectMap = () => {
    clearMapHighlight();

    // Highlight the correct map button
    const mapButtonId = `btn-${currentImageData.map.toLowerCase()}`;
    document.getElementById(mapButtonId).classList.add("correct-map");
    
    // Show the map
    document.querySelector("#clickable-image").src = `assets/Minimaps/${currentImageData.map}_Minimap_Overlay.png`;
    mapCheck = currentImageData.map;
    toggleVisibility(true, "clickable-image");
}

// Shows the correct answer location on the map
const showCorrectAnswer = () => {    
    // Store the coordinates for later reference
    cords.x = currentImageData.imageData.cords.x;
    cords.y = currentImageData.imageData.cords.y;
    
    // Update dot position 
    updateDotPosition();
    
    // Show relevant elements
    toggleVisibility(true, "clickable-image", "dot");
    
    knowsAnswer = true;
}

// Places the dot on the map at the clicked location
const placeDot = () => {
    const img = event.target;
    const rect = img.getBoundingClientRect();
    
    // Calculate click position relative to image
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Calculate scaled coordinates (adapt to square container)
    const scaleFactor = 720 / rect.width;
    cords.x = Math.round(clickX * scaleFactor);
    cords.y = Math.round(clickY * scaleFactor);
    
    if (!element_dot) {
        console.error("Element not found!");
        return;
    }
    
    // Update dot position
    updateDotPosition();
    
    // Show the dot
    element_dot.style.visibility = 'visible';
}

// Updates dot position when screen size changes
const updateDotPosition = () => {
    if (!element_dot || !cords.x || !cords.y) return;
    
    // Get the current image container dimensions
    const container = document.querySelector('.quiz-image');
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    
    // For square container, calculate positions based on container width
    const scaleFactor = containerWidth / 720;
    
    // Position using absolute pixel values with proper scaling
    element_dot.style.left = `${cords.x * scaleFactor}px`;
    element_dot.style.top = `${cords.y * scaleFactor}px`;
}