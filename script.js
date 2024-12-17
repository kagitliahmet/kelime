let translations = [];
let currentWord = null;
let remainingWords = [];
let wrongWords = [];

// DOM Elements
const questionEl = document.getElementById("question");
const exampleSentence = document.getElementById("exampleSentence");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submitBtn");
const feedbackEl = document.getElementById("feedback");
const progressEl = document.getElementById("progress");
const wrongWordsEl = document.getElementById("wrongWords");
const csvFileInput = document.getElementById("csvFileInput");

// Function to parse CSV file
function loadCSVFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const contents = e.target.result;
        const rows = contents.split("\n");

        // Parse CSV rows into translations array
        translations = rows.map(row => {
            const cols = row.split(",");
            return {
                en: cols[0],   // First column is English word
                tr: cols[1],   // Second column is Turkish translation
                example: cols[2]  // Third column is example sentence
            };
        }).filter(item => item.en && item.tr && item.example); // Filter out empty rows
        
        remainingWords = [...translations];
        startGame();
    };

    reader.readAsText(file);
}

// Function to start the game
function startGame() {
    if (remainingWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingWords.length);
        currentWord = remainingWords[randomIndex];
        questionEl.textContent = `Translate: "${currentWord.en}"`;
        exampleSentence.textContent = `Example: ${currentWord.example}`; // Display the example sentence
        answerInput.value = "";
        feedbackEl.textContent = ""; // Clear previous feedback
        updateProgress();
    } else {
        endGame();
    }
}

// Function to check the user's answer
function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    if (userAnswer.toLowerCase() === currentWord.tr.toLowerCase()) {
        feedbackEl.textContent = "✔️"; // Show check mark for correct answer
        feedbackEl.style.color = "green";
        
        // Hide the check mark after 0.5 seconds
        setTimeout(function() {
            feedbackEl.textContent = "";
        }, 500);
        
        remainingWords = remainingWords.filter(word => word !== currentWord);
    } else {
        feedbackEl.textContent = "❌"; // Show cross mark for wrong answer
        feedbackEl.style.color = "red";
        
        // Hide the cross mark after 0.5 seconds
        setTimeout(function() {
            feedbackEl.textContent = "";
        }, 500);

        wrongWords.push(currentWord.en);
    }
    startGame();
}

// Function to update progress
function updateProgress() {
    progressEl.textContent = `Words remaining: ${remainingWords.length}`;
}

// Function to end the game
function endGame() {
    questionEl.textContent = "Practice complete!";
    submitBtn.disabled = true;
    answerInput.disabled = true;

    if (wrongWords.length > 0) {
        wrongWordsEl.innerHTML = `<h3>Make more practice with:</h3> ${wrongWords.join(", ")}`;
    } else {
        wrongWordsEl.innerHTML = "<h3>Perfect! No mistakes made.</h3>";
    }
}

// Event listener for CSV file input
csvFileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        loadCSVFile(file);
    }
});

// Event listener for submit button
submitBtn.addEventListener("click", checkAnswer);

// Event listener to trigger the submit button when "Enter" is pressed
answerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the form from submitting (if inside a form)
        submitBtn.click(); // Trigger the submit button click
    }
});