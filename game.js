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
    this.sequence = this.tiles;
    this.sequenceToGuess = this.sequence;
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
    this.labelCheckboxBonus = document.getElementById('labelCheckboxBonus');
    this.labelCheckboxSpeed = document.getElementById('labelCheckboxSpeed');
    this.labelSpeed = document.getElementById('labelSpeed');
    this.speedIndicator = document.getElementById('speed');
    this.checkboxBonus = document.getElementById('checkboxBonuses');
    this.checkboxSpeed = document.getElementById('checkboxSpeed');
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
    this.textBonus = 'You got an extra life!';
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
  speedMode: false,
  score: 0,
  scoreBest: 0,
  maxBonusOffset: 95,
  minBonusOffset: 12,
  getBonusChance: 0.3,
  speedModifier: 0.8,
};

let randomBoolean = false;

const visuals = new Visuals();
const elements = new Elements();
const interaction = new Interaction();
const timers = new Timers();

function getRandomTile() {
  const random =
    elements.tiles[parseInt(Math.random() * elements.tiles.length)];
  return random;
}

function createSequence() {
  elements.sequence = [getRandomTile()];
  elements.sequenceToGuess = [...elements.sequence];
}

function playAudio(source) {
  new Audio(source).play();
}

function getRandomBool() {
  randomBoolean = Math.random() < options.getBonusChance;
  return randomBoolean;
}

function bonusStart(min, max) {
  elements.bonus.style.left =
    Math.floor(Math.random() * (max - min + 1) + min) + '%';
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
  elements.hint.innerHTML = visuals.textBonus;
}

function AdjustBonusChance() {
  options.canGetBonus = randomBoolean;
  if (!options.canGetBonus) {
    getRandomBool();
  } else if (options.canGetBonus && options.hadExtraLife) {
    options.canGetBonus = false;
    options.hadExtraLife = false;
  }
}

function speedUpGame() {
  if (options.speedMode) {
    timers.timeNextTile *= options.speedModifier;
    timers.timeFlashLife *= options.speedModifier;
  }
}

const flash = (tile) =>
  new Promise((resolve) => {
    const currentNote = tile.dataset.color;
    const noteSound = document.querySelector(`[data-sound='${currentNote}']`);
    noteSound.play();
    tile.classList.add('active');
    setTimeout(() => {
      tile.classList.remove('active');
      setTimeout(() => {
        resolve();
      }, timers.timeNextTile);
    }, timers.timeFlashLife);
  });

const startFlashing = async () => {
  elements.hint.innerHTML = visuals.textRemember;
  options.canClick = false;
  for (const tile of elements.sequence) {
    await flash(tile);
  }
  AdjustBonusChance();
  if (options.inPlay) {
    if (options.score >= 4) {
      bonusAnimation();
    }
    elements.hint.innerHTML = visuals.textRepeat;
    elements.page.classList.remove('noclick');
    options.canClick = true;
  }
};

const onTileClicked = (tileClicked) => {
  const expectedTile = elements.sequenceToGuess.shift();
  if (expectedTile === tileClicked) {
    if (elements.sequenceToGuess.length === 0) {
      options.score++;
      updateScore();
      speedUpGame();
      elements.page.classList.add('noclick');
      if (options.score > options.scoreBest) {
        options.scoreBest = options.score;
        updateMax();
      }
      setTimeout(() => {
        elements.sequence.push(getRandomTile());
        elements.sequenceToGuess = [...elements.sequence];
        startFlashing();
      }, timers.timeNextSequence);
    }
  } else if (!options.haveExtraLife) {
    endGame();
  } else {
    continueGame();
  }
};

function endGame() {
  visuals.wrongSound.play();
  stopGame();
  elements.hint.innerHTML = visuals.textWrong;
  elements.hint.style.color = 'red';
}

function continueGame() {
  visuals.revertSound.play();
  elements.page.classList.add('noclick');
  options.haveExtraLife = false;
  options.hadExtraLife = true;
  setTimeout(() => {
    elements.sequenceToGuess = [...elements.sequence];
    startFlashing();
  }, timers.timeFlashLifeStart);
}

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
  interaction.labelCheckboxBonus.classList.add('hidden');
  interaction.checkboxBonus.classList.add('hidden');
  interaction.labelCheckboxSpeed.classList.add('hidden');
  interaction.checkboxSpeed.classList.add('hidden');
  interaction.speedIndicator.classList.add('hidden');
}

function stopGame() {
  options.inPlay = false;
  options.score = 0;
  options.haveExtraLife = false;
  updateScore();
  elements.sequence.splice(0);
  elements.hint.innerHTML = visuals.textStart;
  elements.bonus.classList.remove('bonusOn');
  elements.page.classList.add('noclick');
  interaction.stopBtn.classList.add('hidden');
  interaction.startBtn.classList.remove('hidden');
  interaction.rangeTiles.classList.remove('hidden');
  interaction.rangeSpeed.classList.remove('hidden');
  interaction.labelTiles.classList.remove('hidden');
  interaction.labelSpeed.classList.remove('hidden');
  interaction.labelCheckboxBonus.classList.remove('hidden');
  interaction.checkboxBonus.classList.remove('hidden');
  interaction.labelCheckboxSpeed.classList.remove('hidden');
  interaction.checkboxSpeed.classList.remove('hidden');
  interaction.speedIndicator.classList.remove('hidden');
}

function tilesSlider() {
  const range = document.getElementById('rangeTiles').value;
  const rangeValuePink = 5;
  const rangeValueOrange = 6;
  if (range >= rangeValuePink && elements.pink.classList.contains('hidden')) {
    elements.pink.classList.remove('hidden');
    elements.tiles.push(elements.pink);
  } else if (range < rangeValuePink) {
    elements.tiles.splice(4, 1);
    elements.pink.classList.add('hidden');
  }
  if (range == rangeValueOrange) {
    elements.orange.classList.remove('hidden');
    elements.tiles.push(elements.orange);
  } else {
    elements.tiles.splice(5, 1);
    elements.orange.classList.add('hidden');
  }
}

function speedSlider() {
  const rangeSpeed = document.getElementById('rangeSpeed').value;
  const startSpeed = 0;
  if (rangeSpeed > startSpeed) {
    timers.timeNextTile = timers.timeNextTileStart / rangeSpeed;
    timers.timeFlashLife = timers.timeFlashLifeStart / rangeSpeed;
    document.getElementById('speed').innerHTML = rangeSpeed + 'x';
  }
}

function isBonusesChecked() {
  if (document.getElementById('checkboxBonuses').checked) {
    options.isBonusEnabled = true;
  }
}

function isSpeedChecked() {
  if (document.getElementById('checkboxSpeed').checked) {
    options.speedMode = true;
    interaction.speedIndicator.classList.add('hidden');
    interaction.labelSpeed.classList.add('hidden');
    interaction.rangeSpeed.classList.add('hidden');
    timers.timeNextTile = timers.timeNextTileStart;
    timers.timeFlashLife = timers.timeFlashLifeStart;
  } else {
    options.speedMode = false;
    interaction.speedIndicator.classList.remove('hidden');
    interaction.labelSpeed.classList.remove('hidden');
    interaction.rangeSpeed.classList.remove('hidden');
  }
}

function updateScore() {
  document.getElementById('currentScore').innerHTML = options.score;
}

function updateMax() {
  document.getElementById('bestScore').innerHTML = options.scoreBest;
}
