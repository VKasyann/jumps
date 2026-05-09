import elements from "./elements.js";

const buttons = document.querySelectorAll(".difficulty-btn");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});

document.getElementById('helpButton').addEventListener('click', function() {
    const content = document.getElementById('helpContent');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        this.textContent = "Hide Description ✖️";
    } else {
        content.classList.add('hidden');
        this.textContent = "How to read moves? ℹ️";
    }
});

function getAllElements() {
  return Object.values(elements).flat();
}

function getSelectedDifficulties() {
  return Array.from(document.querySelectorAll(".difficulty-btn.active"))
    .map(btn => parseInt(btn.dataset.value, 10));
}

function getLandingPosition(description) {
  const words = description.trim().split(" ");
  return words[words.length - 1].toLowerCase(); // normalize lowercase
}

function generateSequence(startPosition, allowedDifficulties, length) {
  let sequence = [];
  let currentPos = startPosition;

  for (let i = 0; i < length; i++) {
    const candidates = elements[currentPos]?.filter(el =>
      allowedDifficulties.includes(parseInt(el.difficulty, 10))
    );

    if (!candidates || candidates.length === 0) {
      console.warn(`No moves available from "${currentPos}" at difficulty ${allowedDifficulties}`);
      break;
    }

    const choice = candidates[Math.floor(Math.random() * candidates.length)];
    sequence.push(choice);

    currentPos = getLandingPosition(choice.description);
  }

  return sequence;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const sequenceLength = parseInt(document.getElementById("sequenceLength").value, 10);
  const sequenceList = document.getElementById("sequenceList");
  sequenceList.innerHTML = "";

  const difficulties = getSelectedDifficulties();

  let allElements = getAllElements();

  let sequence = generateSequence("legs", difficulties, sequenceLength);

  console.log("Selected difficulties:", sequence);

  if (difficulties.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Choose difficulty first</strong><br>
    `;
    sequenceList.appendChild(li);
  }

  if (sequence.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Type number of elements to generate</strong><br>
    `;
    sequenceList.appendChild(li);
  }

  for (let i = 0; i < sequence.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${sequence[i].description}</strong><br>
      Start: ${sequence[i].description.split(' ')[1]} → Finish: ${sequence[i].description.split(' ')[sequence[i].description.split(' ').length - 1]}<br>
      Difficulty: ${sequence[i].difficulty}<br>
    `;
    sequenceList.appendChild(li);
  }
});
