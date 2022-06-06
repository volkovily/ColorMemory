class Elements {
  constructor() {
    this.blue = document.querySelector('.blue');
    this.red = document.querySelector('.red');
    this.green = document.querySelector('.green');
    this.yellow = document.querySelector('.yellow');
    this.page = document.querySelector('.noclick');
    this.tiles = [this.blue, this.red, this.green, this.yellow];
  }
}

class Options {
  constructor() {
   this.startBtn = document.getElementById('startBtn');
   this.stopBtn = document.getElementById('stopBtn');
   this.rangeTiles = document.getElementById('rangeTiles');
   this.rangeSpeed = document.getElementById('rangeSpeed');
   this.labelTiles = document.getElementById('labelTiles');
   this.labelSpeed = document.getElementById('labelSpeed');
   this.labelCheckbox = document.getElementById('labelCheckbox');
   this.speedIndicator = document.getElementById('speed');
   this.checkbox = document.getElementById('checkbox');
  }
}
const elements = new Elements();
const options = new Options();

let inPlay = false;
let canClick = false;
let haveExtraLife = false;
let hadExtraLife = false;
let isBonusEnabled = false;
let bonusTimer;
let canGetBonus;


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

function createSequence() {
  sequence = [getRandomTile()];
  sequenceToGuess = [...sequence];
}

function playAudio(source) {
  new Audio(source).play();
}

function getRandomTile() {
  const random = elements.tiles[parseInt(Math.random() * elements.tiles.length)];
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
    elements.page.classList.remove('noclick');
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
      elements.page.classList.add('noclick');
      setTimeout(() => {
        sequence.push(getRandomTile());
        sequenceToGuess = [...sequence];
        startFlashing();
      }, timeNextSequence);
    }
  } else if (!haveExtraLife) {
    wrongSound.play();
    stopGame();
    hint.innerHTML = textWrong;
    hint.style.color = 'red';
  } else {
    revertSound.play();
    elements.page.classList.add('noclick');
    setTimeout(() => {
      sequenceToGuess = [...sequence];
      startFlashing();
    }, timeFlashLifeStart);
    haveExtraLife = false;
    hadExtraLife = true;
  }
};

function startGame() {
  createSequence();
  startFlashing();
  inPlay = true;
  hint.style.color = 'black';
  hint.innerHTML = textStart;
  options.stopBtn.classList.remove('hidden');
  options.startBtn.classList.add('hidden');
  options.rangeTiles.classList.add('hidden');
  options.rangeSpeed.classList.add('hidden');
  options.labelTiles.classList.add('hidden');
  options.labelSpeed.classList.add('hidden');
  options.labelCheckbox.classList.add('hidden');
  options.speedIndicator.classList.add('hidden');
  options.checkbox.classList.add('hidden');
}

function stopGame() {
  inPlay = false;
  score = 0;
  updateScore();
  sequence.splice(0);
  hint.innerHTML = textStart;
  bonus.classList.remove('bonusOn');
  elements.page.classList.add('noclick');
  options.stopBtn.classList.add('hidden');
  options.startBtn.classList.remove('hidden');
  options.rangeTiles.classList.remove('hidden');
  options.rangeSpeed.classList.remove('hidden');
  options.labelTiles.classList.remove('hidden');
  options.labelSpeed.classList.remove('hidden');
  options.labelCheckbox.classList.remove('hidden');
  options.speedIndicator.classList.remove('hidden');
  options.checkbox.classList.remove('hidden');
}

function tilesSlider() {
  const pink = document.querySelector('.pink');
  const orange = document.querySelector('.orange');
  const range = document.getElementById('rangeTiles').value;

  if (range >= 5 && pink.classList.contains('hidden')) {
    pink.classList.remove('hidden');
    elements.tiles.push(pink);
  } else if (range < 5) {
    elements.tiles.splice(4, 1);
    pink.classList.add('hidden');
  }
  if (range == 6) {
    orange.classList.remove('hidden');
    elements.tiles.push(orange);
  } else {
    elements.tiles.splice(5, 1);
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
