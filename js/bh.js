let currentEditingEntry = null;
let currentEditingEntryId = null;
let userHasInteracted = false;

function AddData() {
    const bossSelect = document.getElementById('bossSelect').value;
    const timeOfDeath = document.getElementById('timeOfDeath').value || '';
    const location = document.getElementById('Location').value || '';

    if (!timeOfDeath) {
        alert("Time of Death is required.");
        return;
    }

    const now = new Date();
    const [inputHours, inputMinutes] = timeOfDeath.split(':').map(Number);
    if (isNaN(inputHours) || isNaN(inputMinutes)) {
        alert("Invalid time format. Please enter time as HH:MM.");
        return;
    }
    const inputTime = new Date();
    inputTime.setHours(inputHours, inputMinutes, 0, 0);

    if (inputTime > now) {
        alert("Time of Death cannot be in the future.");
        return;
    }

    const respawnTimes = {
        'Anggolt': 3,
        'Kiaron': 4,
        'Grish': 6,
        'Inferno': 8
    };

    const respawnTime = respawnTimes[bossSelect];
    if (!respawnTime) return;

    const deathDate = new Date();
    deathDate.setHours(inputHours, inputMinutes, 0, 0);

    let respawnDate = new Date(deathDate.getTime() + respawnTime * 60 * 60 * 1000);
    const formattedTimeOfDeath = deathDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (currentEditingEntry) {
        // Update existing entry
        UpdateData(bossSelect, timeOfDeath, location, respawnDate.toISOString(), currentEditingEntryId);
    } else {
        // Create new entry
        const entryId = Date.now().toString();
        const newEntry = document.createElement('div');
        newEntry.className = 'boss-entry';
        newEntry.setAttribute('data-boss', bossSelect);
        newEntry.setAttribute('data-entry-id', entryId);
        newEntry.innerHTML = `
            <div class="icons">
                <div class="icon-wrapper">
                    <img src="images/clock.png" alt="Clock Icon" class="icon-img">
                    <span class="timeOfDeath">Died at ${formattedTimeOfDeath}</span>
                </div>
                <div class="icon-wrapper">
                    <img src="images/hourglass.png" alt="Glass Clock Icon" class="icon-img">
                    <span class="timetilRespawn" data-respawn-time="${respawnDate.toISOString()}"> <span class="countdown"></span></span>
                </div>
                <div class="icon-wrapper">
                    <img src="images/location.png" alt="Location Icon" class="icon-img">
                    <span class="location">${location}</span>
                </div>
            </div>
            <div class="actions">
                <div class="action-wrapper">
                    <img src="images/pen.png" alt="Edit Icon" class="action-icon">
                </div>
                <div class="action-wrapper">
                    <img src="images/remove.png" alt="Remove Icon" class="action-icon">
                </div>
            </div>
        `;

        let entriesContainer;
        switch (bossSelect) {
            case 'Anggolt':
                entriesContainer = document.getElementById('anggolt-entries');
                break;
            case 'Kiaron':
                entriesContainer = document.getElementById('kiaron-entries');
                break;
            case 'Grish':
                entriesContainer = document.getElementById('grish-entries');
                break;
            case 'Inferno':
                entriesContainer = document.getElementById('inferno-entries');
                break;
            default:
                return;
        }

        entriesContainer.appendChild(newEntry);

        saveDataToLocalStorage(bossSelect, timeOfDeath, location, respawnDate.toISOString(), entryId);
        startCountdownTimer(newEntry.querySelector('.countdown'));

        newEntry.querySelector('.action-wrapper img[alt="Remove Icon"]').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this entry?')) {
                removeEntry(newEntry, entryId);
            }
        });

        newEntry.querySelector('.action-wrapper img[alt="Edit Icon"]').addEventListener('click', () => {
            editEntry(newEntry, bossSelect, timeOfDeath, location, entryId);
        });

        // Reset form
        document.getElementById('bossForm').reset();
    }
}

function UpdateData() {
    const bossSelect = document.getElementById('bossSelect').value;
    const timeOfDeath = document.getElementById('timeOfDeath').value || '';
    const location = document.getElementById('Location').value || '';

    if (!timeOfDeath) {
        console.error("timeOfDeath is undefined or null");
        alert("Time of Death is missing or incorrect.");
        return;
    }

    const now = new Date();
    const [inputHours, inputMinutes] = timeOfDeath.split(':').map(Number);
    if (isNaN(inputHours) || isNaN(inputMinutes)) {
        alert("Invalid time format. Please enter time as HH:MM.");
        return;
    }
    const inputTime = new Date();
    inputTime.setHours(inputHours, inputMinutes, 0, 0);

    if (inputTime > now) {
        alert("Time of Death cannot be in the future.");
        return;
    }

    const respawnTimes = {
        'Anggolt': 3,
        'Kiaron': 4,
        'Grish': 6,
        'Inferno': 8
    };

    const respawnTime = respawnTimes[bossSelect];
    if (!respawnTime) return;

    const deathDate = new Date();
    deathDate.setHours(inputHours, inputMinutes, 0, 0);

    const respawnDate = new Date(deathDate.getTime() + respawnTime * 60 * 60 * 1000);
    const formattedTimeOfDeath = deathDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Update the current entry with new values
    currentEditingEntry.querySelector('.timeOfDeath').textContent = `Died at ${formattedTimeOfDeath}`;
    currentEditingEntry.querySelector('.timetilRespawn').setAttribute('data-respawn-time', respawnDate.toISOString());
    currentEditingEntry.querySelector('.location').textContent = location;

    saveDataToLocalStorage(bossSelect, timeOfDeath, location, respawnDate.toISOString(), currentEditingEntryId);

    // Reset form and button states
    document.getElementById('bossForm').reset();
    document.getElementById('Submit').style.display = 'block';
    document.getElementById('updateBtn').style.display = 'none';
    currentEditingEntry = null;
    currentEditingEntryId = null;
}

function editEntry(entryElement, bossSelect, timeOfDeath, location, entryId) {
    currentEditingEntry = entryElement;
    currentEditingEntryId = entryId;

    document.getElementById('bossSelect').value = bossSelect;
    document.getElementById('timeOfDeath').value = timeOfDeath;
    document.getElementById('Location').value = location;

    document.getElementById('Submit').style.display = 'none';
    document.getElementById('updateBtn').style.display = 'block';
}

function saveDataToLocalStorage(bossSelect, timeOfDeath, location, respawnDate, entryId) {
    const data = {
        bossSelect,
        timeOfDeath,
        location,
        respawnDate,
        entryId
    };

    let storedData = JSON.parse(localStorage.getItem('bossData')) || [];

    if (currentEditingEntryId) {
        storedData = storedData.filter(entry => entry.entryId !== currentEditingEntryId);
    }

    storedData.push(data);
    localStorage.setItem('bossData', JSON.stringify(storedData));
}

function removeEntry(entryElement, entryId) {
    entryElement.remove();

    let storedData = JSON.parse(localStorage.getItem('bossData')) || [];
    storedData = storedData.filter(entry => entry.entryId !== entryId);
    localStorage.setItem('bossData', JSON.stringify(storedData));
}

function startCountdownTimer(countdownElement) {
    let countdownStarted = false;

    function updateCountdown() {
        if (countdownStarted) return;

        const respawnTimeElement = countdownElement.closest('.icon-wrapper').querySelector('.timetilRespawn');
        if (!respawnTimeElement) {
            console.error('Respawn time element not found');
            return;
        }

        const respawnTime = new Date(respawnTimeElement.getAttribute('data-respawn-time')).getTime();
        const now = new Date().getTime();
        const distance = respawnTime - now;

        if (distance < 0) {
            countdownElement.innerHTML = 'Respawned';
            countdownElement.style.color = 'red';
            
            const storedData = JSON.parse(localStorage.getItem('bossData')) || [];
            const bossData = storedData.find(entry => new Date(entry.respawnDate).getTime() === respawnTime);

            if (bossData) {
                playNotificationSound(bossData.bossSelect);
            } else {
                console.warn(`No data found for respawn time: ${new Date(respawnTime).toISOString()}`);
            }

            countdownStarted = true;
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        countdownElement.style.color = 'initial';
    }

    setInterval(updateCountdown, 1000);
}

// Detect user interaction
document.addEventListener('click', () => {
    userHasInteracted = true;
    console.warn('User has interacted.');
});

// Function to play notification sound
function playNotificationSound(bossSelect) {
    if (!userHasInteracted) {
        console.warn('User has not interacted with the page yet.');
        return;
    }

    const soundFile = getSoundFileForBoss(bossSelect);
    if (!soundFile) {
        console.error('No sound file found for:', bossSelect);
        return;
    }

    const audio = new Audio(soundFile);

    // Ensure audio plays
    audio.play().then(() => {
        console.log("Audio played successfully");
    }).catch(error => {
        console.error("Playback error:", error);
    });
}

function getSoundFileForBoss(bossSelect) {
    const soundFiles = {
        'Anggolt': 'notifications/anggolt.mp3',
        'Kiaron': 'notifications/kiaron.mp3',
        'Grish': 'notifications/grish.mp3',
        'Inferno': 'notifications/inferno.mp3'
    };

    return soundFiles[bossSelect] || null;
}

// Load data from local storage and start timers
document.addEventListener('DOMContentLoaded', function () {
    const storedData = JSON.parse(localStorage.getItem('bossData')) || [];

    storedData.forEach(entry => {
        const bossSelect = entry.bossSelect;
        const timeOfDeath = entry.timeOfDeath;
        const location = entry.location;
        const respawnDate = new Date(entry.respawnDate).toISOString();
        const entryId = entry.entryId;

        const newEntry = document.createElement('div');
        newEntry.className = 'boss-entry';
        newEntry.setAttribute('data-boss', bossSelect);
        newEntry.setAttribute('data-entry-id', entryId);
        newEntry.innerHTML = `
            <div class="icons">
                <div class="icon-wrapper">
                    <img src="images/clock.png" alt="Clock Icon" class="icon-img">
                    <span class="timeOfDeath">Died at ${timeOfDeath}</span>
                </div>
                <div class="icon-wrapper">
                    <img src="images/hourglass.png" alt="Glass Clock Icon" class="icon-img">
                    <span class="timetilRespawn" data-respawn-time="${respawnDate}"> <span class="countdown"></span></span>
                </div>
                <div class="icon-wrapper">
                    <img src="images/location.png" alt="Location Icon" class="icon-img">
                    <span class="location">${location}</span>
                </div>
            </div>
            <div class="actions">
                <div class="action-wrapper">
                    <img src="images/pen.png" alt="Edit Icon" class="action-icon">
                </div>
                <div class="action-wrapper">
                    <img src="images/remove.png" alt="Remove Icon" class="action-icon">
                </div>
            </div>
        `;

        let entriesContainer;
        switch (bossSelect) {
            case 'Anggolt':
                entriesContainer = document.getElementById('anggolt-entries');
                break;
            case 'Kiaron':
                entriesContainer = document.getElementById('kiaron-entries');
                break;
            case 'Grish':
                entriesContainer = document.getElementById('grish-entries');
                break;
            case 'Inferno':
                entriesContainer = document.getElementById('inferno-entries');
                break;
            default:
                return;
        }

        entriesContainer.appendChild(newEntry);
        startCountdownTimer(newEntry.querySelector('.countdown'));

        newEntry.querySelector('.action-wrapper img[alt="Remove Icon"]').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this entry?')) {
                removeEntry(newEntry, entryId);
            }
        });

        newEntry.querySelector('.action-wrapper img[alt="Edit Icon"]').addEventListener('click', () => {
            editEntry(newEntry, bossSelect, timeOfDeath, location, entryId);
        });
    });
});