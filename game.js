let inPlay = false;
let canClick = false;
let haveExtraLife = false;
let hadExtraLife = false;
let isBonusEnabled = false;
let bonusTimer;
let canGetBonus;

const blue = document.querySelector('.blue');
const red = document.querySelector('.red');
const green = document.querySelector('.green');
const yellow = document.querySelector('.yellow');
const page = document.querySelector('.noclick');

const wrongSound = document.getElementById('wrongSound');
const bonusSound = document.getElementById('bonusSound');
const revertSound = document.getElementById('revertSound');

const bonus = document.getElementById('bonusId');
const hint = document.getElementById('hint');

const textStart = 'Click on the button to start the game!';
const textRemember = 'Remember the sequence!';
const textRepeat = 'Now repeat the sequence!';
const textWrong = 'Wrong tile! Start a new game to try again!';

let score = 0;
let scoreBest = 0;

const maxLeftOffset = 95;
const minLeftOffset = 12;

const timeBonusLife = 10000;
const timeNextSequence = 700;
const timeNextTileStart = 250;
const timeFlashLifeStart = 800;
let timeNextTile = 250;
let timeFlashLife = 800;

const tiles = [blue, red, green, yellow];

let sequence = [getRandomTile()];
let sequenceToGuess = [...sequence];

function playAudio(source) {
  new Audio(source).play();
}

function getRandomTile() {
  const random = tiles[parseInt(Math.random() * tiles.length)];
  return random;
}

function bonusStart(min, max) {
  bonus.style.left = Math.floor(Math.random() * (max - min + 1) + min) + '%';
}

const runBonusTimer = () => {
  bonusTimer = setTimeout(() => {
    bonus.classList.remove('bonusOn');
  }, timeBonusLife);
};

function bonusAnimation() {
  if (!haveExtraLife && canGetBonus && isBonusEnabled) {
    bonusStart(minLeftOffset, maxLeftOffset);
    clearTimeout(bonusTimer);
    bonus.classList.add('bonusOn');
    runBonusTimer();
  }
}

function onBonusClick() {
  haveExtraLife = true;
  bonusSound.play();
  bonus.classList.remove('bonusOn');
}

function getRandomBool() {
  if (!canGetBonus) {
    canGetBonus = Math.random() < 0.9;
  } else if (canGetBonus && hadExtraLife) {
    canGetBonus = false;
    hadExtraLife = false;
  }
}

const flash = tile => new Promise(resolve => {
  const currentNote = tile.dataset.color;
  const noteSound = document.querySelector(`[data-sound='${currentNote}']`);
  noteSound.play();
  tile.className += ' active';
  setTimeout(() => {
    tile.className = tile.className.replace(' active', '');
    setTimeout(() => {
      resolve();
    }, timeNextTile); //time until next tile shows up
  }, timeFlashLife); // flash life time
});

const startFlashing = async () => {
  hint.innerHTML = textRemember;
  canClick = false;
  for (const tile of sequence) {
    await flash(tile);
  }
  getRandomBool();
  if (inPlay) {
    if (score >= 4) {
      bonusAnimation();
    }
    hint.innerHTML = textRepeat;
    page.classList.remove('noclick');
    canClick = true;
  }
};

const onTileClicked = tileClicked => {
  if (!canClick) return;
  const expectedTile = sequenceToGuess.shift();
  if (expectedTile === tileClicked) {
    if (sequenceToGuess.length === 0) {
      score++;
      if (score > scoreBest) {
        scoreBest = score;
        updateMax();
      }
      updateScore();
      page.classList.add('noclick');
      setTimeout(() => {
        sequence.push(getRandomTile());
        sequenceToGuess = [...sequence];
        startFlashing();
      }, timeNextSequence); //time before new sequence shows
    }
  } else if (!haveExtraLife) {
    wrongSound.play();
    stopGame();
    hint.innerHTML = textWrong;
    hint.style.color = 'red';
  } else {
    revertSound.play();
    page.classList.add('noclick');
    setTimeout(() => {
      sequenceToGuess = [...sequence];
      startFlashing();
    }, timeFlashLifeStart);
    haveExtraLife = false;
    hadExtraLife = true;
  }
};



function startGame() {
  inPlay = true;
  hint.style.color = 'black';
  hint.innerHTML = textStart;
  sequence = [getRandomTile()];
  sequenceToGuess = [...sequence];
  document.getElementById('startBtn').classList.add('hidden');
  document.getElementById('stopBtn').classList.remove('hidden');
  document.getElementById('rangeTiles').classList.add('hidden');
  document.getElementById('rangeSpeed').classList.add('hidden');
  document.getElementById('labelTiles').classList.add('hidden');
  document.getElementById('labelSpeed').classList.add('hidden');
  document.getElementById('speed').classList.add('hidden');
  document.getElementById('checkbox').classList.add('hidden');
  document.getElementById('labelCheckbox').classList.add('hidden');
  startFlashing();
}

function stopGame() {
  inPlay = false;
  score = 0;
  updateScore();
  sequence.splice(0);
  hint.innerHTML = textStart;
  page.classList.add('noclick');
  document.getElementById('startBtn').classList.remove('hidden');
  document.getElementById('stopBtn').classList.add('hidden');
  document.getElementById('rangeTiles').classList.remove('hidden');
  document.getElementById('rangeSpeed').classList.remove('hidden');
  document.getElementById('labelTiles').classList.remove('hidden');
  document.getElementById('labelSpeed').classList.remove('hidden');
  document.getElementById('speed').classList.remove('hidden');
  document.getElementById('checkbox').classList.remove('hidden');
  document.getElementById('labelCheckbox').classList.remove('hidden');
  bonus.classList.remove('bonusOn');
}

function tilesSlider() {
  const pink = document.querySelector('.pink');
  const orange = document.querySelector('.orange');
  const range = document.getElementById('rangeTiles').value;

  if (range >= 5 && pink.classList.contains('hidden')) {
    pink.classList.remove('hidden');
    tiles.push(pink);
  } else if (range < 5) {
    tiles.splice(4, 1);
    pink.classList.add('hidden');
  }
  if (range == 6) {
    orange.classList.remove('hidden');
    tiles.push(orange);
  } else {
    tiles.splice(5, 1);
    orange.classList.add('hidden');
  }
}

function speedSlider() {
  const rangeSpeed = document.getElementById('rangeSpeed').value;

  if (rangeSpeed > 1) timeNextTile = timeNextTileStart / rangeSpeed;
  timeFlashLife = timeFlashLifeStart / rangeSpeed;
  document.getElementById('speed').innerHTML = rangeSpeed + 'x';
}

function isChecked() {
  if (document.getElementById('checkbox').checked) {
    isBonusEnabled = true;
  }
}

function updateScore() {
  document.getElementById('currentScore').innerHTML = score;
}

function updateMax() {
  document.getElementById('bestScore').innerHTML = scoreBest;
}
