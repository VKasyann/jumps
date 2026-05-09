import elements from './elements.js';

const sequenceList = document.getElementById('sequenceList');
const generateBtn = document.getElementById('generateBtn');
const sequenceLengthInput = document.getElementById('sequenceLength');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const helpButton = document.getElementById('helpButton');
const helpContent = document.getElementById('helpContent');
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.querySelector('.close-modal');

let selectedDifficulty = "1"; // Default difficulty

// 1. Difficulty Multi-select Toggle
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active'); // Now toggles instead of set/reset
    });
});

// Helper to get all active levels
function getSelectedDifficulties() {
    return Array.from(document.querySelectorAll('.difficulty-btn.active'))
        .map(btn => parseInt(btn.getAttribute('data-value'), 10));
}

// 2. Combo Generation Logic
function generateSequence() {
    const length = parseInt(sequenceLengthInput.value);
    const allowedDiffs = getSelectedDifficulties();

    if (isNaN(length) || length <= 0) {
        sequenceList.innerHTML = '<li class="trick-item"><strong>Set a number of elements first!</strong></li>';
        return;
    }

    if (allowedDiffs.length === 0) {
        sequenceList.innerHTML = '<li class="trick-item"><strong>Choose at least one difficulty first!</strong></li>';
        return;
    }

    if (allowedDiffs.length === 0) {
        alert("Please select at least one difficulty level!");
        return;
    }

    const combo = [];
    // Filter the master list by all selected difficulties
    const pool = elements.filter(el => allowedDiffs.includes(parseInt(el.difficulty, 10)));

    if (pool.length === 0) {
        alert("No tricks found for these difficulties!");
        return;
    }

    let currentStance = "";

    for (let i = 0; i < length; i++) {
        let possibleNextTricks;

        if (i === 0) {
            // First trick: pick any random one from the allowed pool
            possibleNextTricks = pool;
        } else {
            // Must match the previous landing AND be in the allowed difficulty pool
            possibleNextTricks = pool.filter(el => el.start === currentStance);
        }

        // Safety: If no moves match the stance within these difficulties
        if (possibleNextTricks.length === 0) {
            // Options: Stop the combo, or pick a random one from pool to "force" a transition
            console.warn(`Combo broke at stance: ${currentStance}. Picking random restart.`);
            possibleNextTricks = pool;
        }

        const selected = possibleNextTricks[Math.floor(Math.random() * possibleNextTricks.length)];
        combo.push(selected);
        currentStance = selected.landing;
    }

    renderSequence(combo);
}

// 3. Render to UI
function renderSequence(combo) {
    sequenceList.innerHTML = '';

    combo.forEach((trick, index) => {
        const li = document.createElement('li');
        li.className = 'trick-item';
        // Note: We add a data-index to find the trick in the combo array later
        li.innerHTML = `
            <div class="trick-main">
                <span class="trick-index">${index + 1}.</span>
                <div class="trick-details">
                    <strong>${trick.trickName}</strong>
                    <p class="stance-flow">${trick.start} ➔ ${trick.landing}</p>
                </div>
                <button class="view-details-btn" data-index="${index}">Info & Video</button>
            </div>
        `;
        sequenceList.appendChild(li);
    });

    // Handle Modal Opening
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const trick = combo[index]; // Get the specific trick from the generated combo
            openModal(trick);
        });
    });
}

function openModal(trick) {
    // 1. Fill Text Content
    document.getElementById('modalTrickName').textContent = trick.trickName;
    document.getElementById('modalOtherName').textContent = trick.otherName || '';
    document.getElementById('modalDescription').textContent = trick.description || 'No description available.';
    document.getElementById('modalTricker').textContent = trick.tricker || 'Unknown';

    // 2. Load Video (only now does the browser fetch the file)
    if (trick.video) {
        modalVideo.src = trick.video;
        modalVideo.parentElement.style.display = 'block';
    } else {
        modalVideo.parentElement.style.display = 'none';
    }

    // 3. Show Modal
    modal.classList.remove('hidden');
}

// Close Modal Logic
closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    modalVideo.pause();
    modalVideo.src = ""; // Clear source to stop downloading
});

// Close if clicking outside the box
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.classList.add('hidden');
        modalVideo.pause();
        modalVideo.src = "";
    }
});

// 4. Help Toggle
helpButton.addEventListener('click', () => {
    helpContent.classList.toggle('hidden');
});

generateBtn.addEventListener('click', generateSequence);