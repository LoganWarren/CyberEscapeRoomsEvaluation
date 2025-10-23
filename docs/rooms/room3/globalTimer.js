// Access the timer and progress bar elements
let timerElement = document.getElementById('timer');
let progressBarElement = document.getElementById('progress-bar');

// Retrieve or initialize elapsed time
let elapsedTime = parseInt(localStorage.getItem('elapsedTime') || '0', 10);
const totalDuration = 300; // Example: Total duration for full progress (5 minutes)

// Function to format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// Function to update the timer and progress bar
function updateTimer() {
    elapsedTime += 1;
    localStorage.setItem('elapsedTime', elapsedTime); // Save updated time to local storage

    // Update the timer display
    if (timerElement) {
        timerElement.textContent = `Time Elapsed: ${formatTime(elapsedTime)}`;
    }

    // Update the progress bar width
    if (progressBarElement) {
        const progressPercentage = Math.min((elapsedTime / totalDuration) * 100, 100);
        progressBarElement.style.width = `${progressPercentage}%`;
    }
}

// Ensure the timer starts only once across all pages
if (!localStorage.getItem('timerRunning')) {
    localStorage.setItem('timerRunning', 'true'); // Mark the timer as running
    setInterval(updateTimer, 1000); // Update every 1 second
}

// Display initial time and progress when the page loads
if (timerElement) {
    timerElement.textContent = `Time Elapsed: ${formatTime(elapsedTime)}`;
}
if (progressBarElement) {
    const initialProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
    progressBarElement.style.width = `${initialProgress}%`;
}
