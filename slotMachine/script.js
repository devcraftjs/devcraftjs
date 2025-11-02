// ---------- CONFIG ----------
const symbols = ['🍒','🍋','🍊','🍉','⭐','7️⃣'];
const players = [
  { name: "Player 1", score: 0 },
  { name: "Player 2", score: 0 }
];
let currentPlayerIndex = 0;
const spinAnimationSteps = 10;
const spinAnimationDelay = 100;

// ---------- DOM ELEMENTS ----------
const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3')
];
const scoreboardElems = [
  document.getElementById('player1'),
  document.getElementById('player2')
];
const currentPlayerElem = document.getElementById('currentPlayer');
const devPanel = document.getElementById('devPanel');

// ---------- HELPER FUNCTIONS ----------
function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateScoreboard() {
  scoreboardElems.forEach((elem, i) => {
    elem.textContent = `${players[i].name} Score: ${players[i].score}`;
  });
  currentPlayerElem.textContent = `Current Player: ${currentPlayerIndex + 1}`;
}

function switchPlayer(auto = true) {
  if (auto) currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateScoreboard();
}

function checkWin(reelValues) {
  return reelValues.every(val => val === reelValues[0]);
}

// ---------- SPIN FUNCTIONS ----------
function spin() {
  animateReels(() => {
    const result = reels.map(() => randomSymbol());
    setReels(result);
    resolveSpin(result);
  });
}

function forceSpin() {
  const forcedValues = [
    document.getElementById('forceReel1').value,
    document.getElementById('forceReel2').value,
    document.getElementById('forceReel3').value
  ];
  const result = forcedValues.map(val => val || randomSymbol());
  animateReels(() => {
    setReels(result);
    resolveSpin(result);
  });
}

function animateReels(callback) {
  for (let i = 0; i < spinAnimationSteps; i++) {
    setTimeout(() => {
      reels.forEach(reel => {
        reel.textContent = randomSymbol();
      });
    }, i * spinAnimationDelay);
  }
  setTimeout(callback, spinAnimationSteps * spinAnimationDelay + 50);
}

function setReels(values) {
  reels.forEach((reel, i) => {
    reel.textContent = values[i];
  });
}

function resolveSpin(result) {
  if (checkWin(result)) {
    alert(`${players[currentPlayerIndex].name} wins!`);
    players[currentPlayerIndex].score += 10;
  } else {
    players[currentPlayerIndex].score += 1;
  }
  updateScoreboard();
  switchPlayer();
}

// ---------- DEV PANEL FUNCTIONS ----------
function setScores() {
  const s1 = parseInt(document.getElementById('score1').value);
  const s2 = parseInt(document.getElementById('score2').value);
  if (!isNaN(s1)) players[0].score = s1;
  if (!isNaN(s2)) players[1].score = s2;
  updateScoreboard();
}

function switchPlayerManual() {
  switchPlayer(false);
}

// ---------- DEV PANEL TOGGLE (Ctrl + K) ----------
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const password = prompt("Enter Dev Panel password:");
    if (password === "Devpanel") {
      devPanel.style.display = devPanel.style.display === 'none' ? 'block' : 'none';
    } else {
      alert("Incorrect password.");
    }
  }
});

// ---------- INITIALIZATION ----------
updateScoreboard();
