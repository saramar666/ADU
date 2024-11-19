let currentFontSize = 1.5;
let currentLineHeight = 1.5;
const textElement = document.getElementById("textToRead");
const audioButton = document.getElementById("audioButton");
const contrastButton = document.getElementById("contrastButton");
const textToRead = document.getElementById('textToRead'); // passei
const speedSlider = document.getElementById('speedSlider'); //passei
const speedValue = document.getElementById('speedValue'); //passei
//let isPlaying = false;
let isHighContrast = false;
//let speechSynthesisInstance;

//passei tudo
const speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let currentText = '';
let currentPosition = 0;

function changeTextSize(change) {
    currentFontSize += change;
    textElement.style.fontSize = currentFontSize + "rem";
}

function changeTextSpacing(change) {
    currentLineHeight += change;
    textElement.style.lineHeight = currentLineHeight;
}


function createUtterance(text, startOffset = 0) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = parseFloat(speedSlider.value);
    
    // Set the starting position
    if (startOffset > 0) {
        utterance.text = text.substring(startOffset);
    }

    utterance.onend = () => {
        if (currentUtterance === utterance) {
            audioButton.textContent = 'Read Aloud';
            audioButton.setAttribute('aria-label', 'Read text aloud');
            currentUtterance = null;
            currentPosition = 0;
        }
    };

    utterance.onstart = () => {
        audioButton.innerHTML = "<img src='Images/pause-lg.svg'>";
        audioButton.setAttribute('aria-label', 'Pause reading');
    };

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
    
    /*Update button to show pause state
    audioButton.innerHTML = "<img src='Images/pause-lg.svg'>";
    audioButton.setAttribute('aria-label', 'Pause reading');*/
}

function resetAudioButton() {
    audioButton.innerHTML = "<img src='Images/play-lg.svg'>";
    audioButton.setAttribute('aria-label', 'Read text aloud');
    currentUtterance = null;
}


// Audio and changes the buttons icons
audioButton.addEventListener('click', () => {
    togglePopup(); 
    const isInitialState = audioButton.innerHTML.includes('play-lg.svg');
    
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        // If speaking, pause it and reset button
        speechSynthesis.pause();
        resetAudioButton();
    } else if (speechSynthesis.paused) {
        // If paused, resume and show pause button
        speechSynthesis.resume();
        audioButton.innerHTML = "<img src='Images/pause-lg.svg'>";
        audioButton.setAttribute('aria-label', 'Pause reading');
    } else {
        // If not speaking at all, start new speech
        playText();
    }
    
    // Always show popup if clicking from initial state (play button)
    if (isInitialState) {
        const popup = document.getElementById("myPopup");
        popup.style.display = "block";
    }
});

// Use 'input' event for real-time updates while sliding
speedSlider.addEventListener('input', updateSpeed);

// Initialize speed display
updateSpeed();

function restartAudio() {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Create a new utterance starting from the beginning
    currentUtterance = createUtterance(currentText, 0);
    currentUtterance.startTime = Date.now();
    
    // Start speaking from the beginning
    speechSynthesis.speak(currentUtterance);
}
document.getElementById('restartAudioButton').addEventListener('click', restartAudio);

function toggleContrast() {
    if (isHighContrast) {
        document.body.classList.remove("high-contrast");
        contrastButton.innerHTML = "<img src='Images/sun-lg.svg'>";
    } else {
        document.body.classList.add("high-contrast");
        contrastButton.innerHTML = "<img src='Images/moon-lg.svg'>";
    }
    isHighContrast = !isHighContrast;
}

function togglePopup() {
    const popup = document.getElementById("myPopup");
    //console.log(popup.style.display);
    popup.style.display = popup.style.display === "block" ? "none" : "block";

     //If we're hiding the popup and audio is playing, don't stop it
    if (popup.style.display === "none" && speechSynthesis.speaking) {
        //return;
    }
}





// Close the popup if clicked outside
/*document.addEventListener("click", function(event) {
    const popup = document.getElementById("myPopup");
    const audioButton = document.getElementById("audioContainer");

    if (!audioButton.contains(event.target) && popup.style.display === "block"){
        console.log("HELLO");
        togglePopup();
    }
});*/
//audioButton.addEventListener("click", toggleAudioDropdown);

  
 // Close the dropdown menu if the user clicks outside of it
  window.addEventListener("click", function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;

        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
  }
  )
