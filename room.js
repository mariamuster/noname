let currentDialogue = [];
let currentIndex = 0;

function openDialog(key = "default") {
  currentDialogue = dialogues[key] || dialogues.default;
  currentIndex = 0;
  updateText();
  document.getElementById("dialogOverlay").showModal();
}

function updateText() {
  const textElement = document.getElementById("dialogText");
  textElement.textContent = currentDialogue[currentIndex];

  // Alternate alignment: even index = left, odd index = right
  if (currentIndex % 2 === 0) {
    textElement.className = "dialog-text right";
  } else {
    textElement.className = "dialog-text left";
  }
}

function showNextPassage() {
  currentIndex++;
  if (currentIndex < currentDialogue.length) {
    updateText();
  } else {
    closeDialog();
  }
}

function closeDialog() {
  document.getElementById("dialogOverlay").close();
}
