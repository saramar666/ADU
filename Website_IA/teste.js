// Get DOM elements
const playButton = document.getElementById('playButton');
const speedSlider = document.getElementById('speedSlider'); //passei
const speedValue = document.getElementById('speedValue'); //passei
const textToRead = document.getElementById('textToRead'); //passei

// Initialize speech synthesis
const speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let currentText = '';
let currentPosition = 0;

function createUtterance(text, startOffset = 0) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = parseFloat(speedSlider.value);
    
    // Set the starting position
    if (startOffset > 0) {
        utterance.text = text.substring(startOffset);
    }

    

    return utterance;
}

function updateSpeed() {
    const speed = parseFloat(speedSlider.value);
    speedValue.textContent = `${speed.toFixed(1)}x`;
    
    if (speechSynthesis.speaking) {
        // Store current position and text
        currentPosition = getCurrentPosition();
        currentText = textToRead.textContent;
        
        // Cancel current speech
        speechSynthesis.cancel();
        
        // Create new utterance from current position
        currentUtterance = createUtterance(currentText, currentPosition);
        
        // Resume speaking with new rate
        speechSynthesis.speak(currentUtterance);
    }
}

function getCurrentPosition() {
    if (!currentUtterance || !speechSynthesis.speaking) return 0;
    
    const elapsedTime = (Date.now() - currentUtterance.startTime) / 1000;
    const wordsPerSecond = currentUtterance.rate * 4; // Approximate words per second
    const wordsSpoken = Math.floor(elapsedTime * wordsPerSecond);
    
    // Convert approximate words to characters
    return Math.min(wordsSpoken * 5, currentText.length); // Assume average word length of 5
}

function playText() {
    currentText = textToRead.textContent;
    
    // Stop any ongoing speech
    speechSynthesis.cancel();
    
    // Create new utterance
    currentUtterance = createUtterance(currentText);
    currentUtterance.startTime = Date.now();
    
    // Start speaking
    speechSynthesis.speak(currentUtterance);
}

// Event Listeners
playButton.addEventListener('click', () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        playButton.textContent = 'Resume';
        playButton.setAttribute('aria-label', 'Resume reading');
    } else if (speechSynthesis.paused) {
        speechSynthesis.resume();
        playButton.textContent = 'Pause';
        playButton.setAttribute('aria-label', 'Pause reading');
    } else {
        playText();
    }
});

// Use 'input' event for real-time updates while sliding
speedSlider.addEventListener('input', updateSpeed);

// Initialize speed display
updateSpeed();