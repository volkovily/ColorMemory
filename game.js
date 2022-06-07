class Elements {
  constructor() {
    this.blue = document.querySelector('.blue');
    this.red = document.querySelector('.red');
    this.green = document.querySelector('.green');
    this.yellow = document.querySelector('.yellow');
    this.pink = document.querySelector('.pink');
    this.orange = document.querySelector('.orange');
    this.page = document.querySelector('.noclick');
    this.bonus = document.getElementById('bonusId');
    this.hint = document.getElementById('hint');
    this.tiles = [this.blue, this.red, this.green, this.yellow];
  }
}

class Interaction {
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

class Visuals {
  constructor() {
    this.wrongSound = document.getElementById('wrongSound');
    this.bonusSound = document.getElementById('bonusSound');
    this.revertSound = document.getElementById('revertSound');
    this.textStart = 'Click on the button to start the game!';
    this.textRemember = 'Remember the sequence!';
    this.textRepeat = 'Now repeat the sequence!';
    this.textWrong = 'Wrong tile! Start a new game to try again!';
  }
}

class Timers {
  constructor() {
    this.timeBonusLife = 10000;
    this.timeNextSequence = 700;
    this.timeNextTileStart = 250;
    this.timeFlashLifeStart = 800;
    this.timeNextTile = 250;
    this.timeFlashLife = 800;
    this.bonusTimer = 0;
  }
}

const options = {
  inPlay: false,
  canClick: false,
  haveExtraLife: false,
  hadExtraLife: false,
  isBonusEnabled: false,
  canGetBonus: true,
  score: 0,
  scoreBest: 0,
  maxBonusOffset: 95,
  minBonusOffset: 12,
};



const visuals = new Visuals();
const elements = new Elements();
const interaction = new Interaction();
const timers = new Timers();

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
  elements.bonus.style.left = Math.floor(Math.random() * (max - min + 1) + min) + '%';
}

const runBonusTimer = () => {
  timers.bonusTimer = setTimeout(() => {
    elements.bonus.classList.remove('bonusOn');
  }, timers.timeBonusLife);
};

function bonusAnimation() {
  if (!options.haveExtraLife && options.canGetBonus && options.isBonusEnabled) {
    bonusStart(options.minBonusOffset, options.maxBonusOffset);
    clearTimeout(timers.bonusTimer);
    elements.bonus.classList.add('bonusOn');
    runBonusTimer();
  }
}

function onBonusClick() {
  options.haveExtraLife = true;
  visuals.bonusSound.play();
  elements.bonus.classList.remove('bonusOn');
}

function getRandomBool() {
  if (!options.canGetBonus) {
    options.canGetBonus = Math.random() < 0.9;
  } else if (options.canGetBonus && options.hadExtraLife) {
    options.canGetBonus = false;
    options.hadExtraLife = false;
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
    }, timers.timeNextTile);
  }, timers.timeFlashLife);
});

const startFlashing = async () => {
  elements.hint.innerHTML = visuals.textRemember;
  options.canClick = false;
  for (const tile of sequence) {
    await flash(tile);
  }
  getRandomBool();
  if (options.inPlay) {
    if (options.score >= 4) {
      bonusAnimation();
    }
    elements.hint.innerHTML = visuals.textRepeat;
    elements.page.classList.remove('noclick');
    options.canClick = true;
  }
};

const onTileClicked = tileClicked => {
  if (!options.canClick) return;
  const expectedTile = sequenceToGuess.shift();
  if (expectedTile === tileClicked) {
    if (sequenceToGuess.length === 0) {
      options.score++;
      if (options.score > options.scoreBest) {
        options.scoreBest = options.score;
        updateMax();
      }
      updateScore();
      elements.page.classList.add('noclick');
      setTimeout(() => {
        sequence.push(getRandomTile());
        sequenceToGuess = [...sequence];
        startFlashing();
      }, timers.timeNextSequence);
    }
  } else if (!options.haveExtraLife) {
    visuals.wrongSound.play();
    stopGame();
    elements.hint.innerHTML = visuals.textWrong;
    elements.hint.style.color = 'red';
  } else {
    visuals.revertSound.play();
    elements.page.classList.add('noclick');
    setTimeout(() => {
      sequenceToGuess = [...sequence];
      startFlashing();
    }, timers.timeFlashLifeStart);
    options.haveExtraLife = false;
    options.hadExtraLife = true;
  }
};

function startGame() {
  createSequence();
  startFlashing();
  options.inPlay = true;
  elements.hint.style.color = 'black';
  elements.hint.innerHTML = visuals.textStart;
  interaction.stopBtn.classList.remove('hidden');
  interaction.startBtn.classList.add('hidden');
  interaction.rangeTiles.classList.add('hidden');
  interaction.rangeSpeed.classList.add('hidden');
  interaction.labelTiles.classList.add('hidden');
  interaction.labelSpeed.classList.add('hidden');
  interaction.labelCheckbox.classList.add('hidden');
  interaction.speedIndicator.classList.add('hidden');
  interaction.checkbox.classList.add('hidden');
}

function stopGame() {
  options.inPlay = false;
  options.score = 0;
  updateScore();
  sequence.splice(0);
  elements.hint.innerHTML = visuals.textStart;
  elements.bonus.classList.remove('bonusOn');
  elements.page.classList.add('noclick');
  interaction.stopBtn.classList.add('hidden');
  interaction.startBtn.classList.remove('hidden');
  interaction.rangeTiles.classList.remove('hidden');
  interaction.rangeSpeed.classList.remove('hidden');
  interaction.labelTiles.classList.remove('hidden');
  interaction.labelSpeed.classList.remove('hidden');
  interaction.labelCheckbox.classList.remove('hidden');
  interaction.speedIndicator.classList.remove('hidden');
  interaction.checkbox.classList.remove('hidden');
}

function tilesSlider() {
  const range = document.getElementById('rangeTiles').value;

  if (range >= 5 && pink.classList.contains('hidden')) {
    elements.pink.classList.remove('hidden');
    elements.tiles.push(pink);
  } else if (range < 5) {
    elements.tiles.splice(4, 1);
    elements.pink.classList.add('hidden');
  }
  if (range == 6) {
    elements.orange.classList.remove('hidden');
    elements.tiles.push(orange);
  } else {
    elements.tiles.splice(5, 1);
    elements.orange.classList.add('hidden');
  }
}

function speedSlider() {
  const rangeSpeed = document.getElementById('rangeSpeed').value;

  if (rangeSpeed > 1) {
  timers.timeNextTile = timers.timeNextTileStart / rangeSpeed;
  timers.timeFlashLife = timers.timeFlashLifeStart / rangeSpeed;
  document.getElementById('speed').innerHTML = rangeSpeed + 'x';
  }
}

function isChecked() {
  if (document.getElementById('checkbox').checked) {
    options.isBonusEnabled = true;
  }
}

function updateScore() {
  document.getElementById('currentScore').innerHTML = options.score;
}

function updateMax() {
  document.getElementById('bestScore').innerHTML = options.scoreBest;
}
