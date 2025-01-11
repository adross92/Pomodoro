// Remove these constants as we don't need them anymore
const BREAK_TIME = 5 * 60;       // 5 minutes in seconds
const airhorn = new Audio('https://www.myinstants.com/media/sounds/air-horn-sound-effect.mp3');
airhorn.volume = 0.8;
airhorn.load();

let WORK_TIME = 25 * 60;  // Default to 25 minutes
let timeLeft;
let timerId = null;
let isWorkTime = true;
let isRunning = false;

// Get DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const customMinutes = document.getElementById('custom-minutes');
const setCustomButton = document.getElementById('set-custom');

function toggleTimer() {
    if (isRunning) {
        pauseTimer();
        startButton.textContent = 'Start';
    } else {
        startTimer();
        startButton.textContent = 'Pause';
    }
    isRunning = !isRunning;
}

function playSound() {
    airhorn.currentTime = 0;  // Reset the sound to start
    airhorn.play()
        .catch(error => {
            console.log('Error playing sound:', error);
            alert('Sound failed to play - make sure your browser allows sound autoplay!');
        });
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Just show the time in the title
    document.title = displayTime;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    statusText.textContent = '"You may delay, but time will not." – Benjamin Franklin';
    updateDisplay();
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            isRunning = false;
            startButton.textContent = 'Start';
            playSound();
            document.title = isWorkTime ? '⏰ Time is up!' : '⏰ Break is over!';
            alert(isWorkTime ? 'Time is up!' : 'Break is over!');
            switchMode();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    statusText.textContent = 'Work Time';
    updateDisplay();
}

function setCustomTime() {
    const minutes = parseInt(customMinutes.value);
    if (isNaN(minutes) || minutes < 1) {
        alert('Please enter a valid number of minutes (minimum 1)');
        return;
    }
    WORK_TIME = minutes * 60;
    resetTimer();
    customMinutes.value = ''; // Clear the input
}

function updateTimer() {
    // Format the time for display
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update both the timer display and the page title
    document.getElementById('timer').textContent = displayTime;
    document.title = `${displayTime} - Pomodoro Timer`;
}

// Update event listeners
startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);
setCustomButton.addEventListener('click', setCustomTime);
customMinutes.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setCustomTime();
    }
});

// Initialize
timeLeft = WORK_TIME;
updateDisplay(); 

// Also update the initial text when the page loads
statusText.textContent = '"You may delay, but time will not." – Benjamin Franklin'; 