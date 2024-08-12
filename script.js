document.addEventListener('DOMContentLoaded', function () {
    // Elements selection
    const wordsContainer = document.getElementById('falling-words');
    const typingInput = document.getElementById('typing-input');
    const scoreDisplay = document.getElementById('score');
    const playButton = document.getElementById('play-button');
    const settingsButton = document.getElementById('settings-button');
    const lyricsInput = document.getElementById('lyrics-input');
    const musicLinkInput = document.getElementById('music-link');
    const settingsModal = document.getElementById('settings-modal');
    const closeButton = document.querySelector('.close-button');
    const applySettingsButton = document.getElementById('apply-settings');
    const fontSelect = document.getElementById('font-select');
    const backgroundSelect = document.getElementById('background-select');
    
    // Game state variables
    let lyrics = [];
    let fallingWords = [];
    let wordIndex = 0;
    let score = 0;
    let gameInterval;
    let dropInterval = 1000; // Interval between word drops
    let audio;

    // Function to start the game
    function startGame() {
        // Retrieve user input for lyrics and music link
        const lyricsText = lyricsInput.value.trim();
        const musicLink = musicLinkInput.value.trim();
        
        if (!lyricsText || !musicLink) {
            alert("Please provide both lyrics and a music link.");
            return;
        }

        // Parse lyrics into an array of words
        lyrics = lyricsText.split(/\s+/);

        // Initialize the audio with the user's provided music link
        audio = new Audio(musicLink);

        // Reset variables for a new game
        fallingWords = [];
        wordIndex = 0;
        score = 0;
        scoreDisplay.innerText = "Score: 0";
        clearInterval(gameInterval);

        // Start the music
        audio.play();

        // Start dropping words and moving them
        gameInterval = setInterval(() => {
            dropWord();
            moveWords();
        }, dropInterval);

        // Hide the controls and show the game area
        document.querySelector('.control-container').style.display = 'none';
        typingInput.style.display = 'block';
        wordsContainer.style.display = 'block';
    }

    // Function to drop a new word
    function dropWord() {
        if (wordIndex < lyrics.length) {
            let word = document.createElement('div');
            word.className = 'word';
            word.innerText = lyrics[wordIndex];
            word.style.left = `${Math.random() * (wordsContainer.offsetWidth - 100)}px`;
            word.style.top = `-${word.offsetHeight}px`;
            wordsContainer.appendChild(word);
            fallingWords.push(word);
            wordIndex++;
        } else {
            clearInterval(gameInterval);
            // Optionally stop the music when all words have dropped
            audio.pause();
        }
    }

    // Function to move the words down
    function moveWords() {
        fallingWords.forEach((word, index) => {
            word.style.top = `${word.offsetTop + 2}px`;

            // Gradually fade out words as they fall
            let fadeOut = (wordsContainer.offsetHeight - word.offsetTop) / wordsContainer.offsetHeight;
            word.style.opacity = fadeOut;

            // Remove the word if it goes out of bounds
            if (word.offsetTop > wordsContainer.offsetHeight) {
                wordsContainer.removeChild(word);
                fallingWords.splice(index, 1);
                updateScore(-5); // Penalize for missed words
            }
        });
    }

    // Update score function
    function updateScore(value) {
        score += value;
        scoreDisplay.innerText = `Score: ${score}`;
    }

    // Check if the typed word matches any falling word
    typingInput.addEventListener('input', function () {
        const typedWord = typingInput.value.trim();
        fallingWords.forEach((word, index) => {
            if (typedWord === word.innerText) {
                wordsContainer.removeChild(word);
                fallingWords.splice(index, 1);
                typingInput.value = '';  // Clear the input
                updateScore(10); // Reward for correct words
                increaseDifficulty(); // Increase difficulty after each correct word
            }
        });
    });

    // Function to gradually increase the difficulty
    function increaseDifficulty() {
        if (dropInterval > 500) {
            dropInterval -= 50; // Increase speed by dropping words more frequently
            clearInterval(gameInterval);
            gameInterval = setInterval(() => {
                dropWord();
                moveWords();
            }, dropInterval);
        }
    }

    // Open settings modal
    settingsButton.addEventListener('click', function () {
        settingsModal.style.display = 'block';
    });

    // Close settings modal
    closeButton.addEventListener('click', function () {
        settingsModal.style.display = 'none';
    });

    // Apply settings and close modal
    applySettingsButton.addEventListener('click', function () {
        // Apply font selection
        document.body.style.fontFamily = fontSelect.value;

        // Apply background selection
        document.body.className = backgroundSelect.value;

        // Close the modal
        settingsModal.style.display = 'none';
    });

    // Start the game when the play button is clicked
    playButton.addEventListener('click', startGame);

    // Hide the game area initially
    typingInput.style.display = 'none';
    wordsContainer.style.display = 'none';
});

