const gameObjects = {
  blue: document.querySelector('.blue'),
  red: document.querySelector('.red'),
  green: document.querySelector('.green'),
  yellow: document.querySelector('.yellow'),
  pink: document.querySelector('.pink'),
  orange: document.querySelector('.orange'),
  page: document.querySelector('.noclick'),
  bonus: document.getElementById('bonusId'),
  hint: document.getElementById('hint'),
};

const interaction = {
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  settingsParts: document.querySelectorAll('.settings'),
  settingsSpeed: document.querySelectorAll('.settingsSpeed'),
  item: [],
};

const visuals = {
  wrongSound: document.getElementById('wrongSound'),
  bonusSound: document.getElementById('bonusSound'),
  revertSound: document.getElementById('revertSound'),
  textStart: 'Click on the button to start the game!',
  textRemember: 'Remember the sequence!',
  textRepeat: 'Now repeat the sequence!',
  textWrong: 'Wrong tile! Start a new game to try again!',
  textBonus: 'You got an extra life!',
};

const timers = {
  timeBonusLife: 10000,
  timeNextSequence: 700,
  timeNextTileStart: 250,
  timeFlashLifeStart: 800,
  timeNextTile: 250,
  timeFlashLife: 800,
  bonusTimer: 0,
};

const options = {
  inPlay: false,
  canClick: false,
  haveExtraLife: false,
  hadExtraLife: false,
  isBonusEnabled: false,
  canGetBonus: true,
  speedMode: false,
  randomBoolean: false,
  score: 0,
  scoreBest: 0,
  maxBonusOffset: 95,
  minBonusOffset: 12,
  getBonusChance: 0.3,
  speedModifier: 0.8,
};

class Elements {
  constructor() {
    this.tiles = [
      gameObjects.blue,
      gameObjects.red,
      gameObjects.green,
      gameObjects.yellow,
    ];
    this.sequence = this.tiles;
    this.sequenceToGuess = this.sequence;
  }
}

const elements = new Elements();

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
  options.randomBoolean = Math.random() < options.getBonusChance;
  return options.randomBoolean;
}

function bonusStart(min, max) {
  gameObjects.bonus.style.left =
    Math.floor(Math.random() * (max - min + 1) + min) + '%';
}

const runBonusTimer = () => {
  timers.bonusTimer = setTimeout(() => {
    gameObjects.bonus.classList.remove('bonusOn');
  }, timers.timeBonusLife);
};

function bonusAnimation() {
  if (!options.haveExtraLife && options.canGetBonus && options.isBonusEnabled) {
    bonusStart(options.minBonusOffset, options.maxBonusOffset);
    clearTimeout(timers.bonusTimer);
    gameObjects.bonus.classList.add('bonusOn');
    runBonusTimer();
  }
}

function onBonusClick() {
  options.haveExtraLife = true;
  visuals.bonusSound.play();
  gameObjects.bonus.classList.remove('bonusOn');
  gameObjects.hint.innerHTML = visuals.textBonus;
}

function AdjustBonusChance() {
  options.canGetBonus = options.randomBoolean;
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
  gameObjects.hint.innerHTML = visuals.textRemember;
  options.canClick = false;
  for (const tile of elements.sequence) {
    await flash(tile);
  }
  AdjustBonusChance();
  if (options.inPlay) {
    if (options.score >= 4) {
      bonusAnimation();
    }
    gameObjects.hint.innerHTML = visuals.textRepeat;
    gameObjects.page.classList.remove('noclick');
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
      gameObjects.page.classList.add('noclick');
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
  gameObjects.hint.innerHTML = visuals.textWrong;
  gameObjects.hint.style.color = 'red';
}

function continueGame() {
  visuals.revertSound.play();
  gameObjects.page.classList.add('noclick');
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
  gameObjects.hint.style.color = 'black';
  gameObjects.hint.innerHTML = visuals.textStart;
  interaction.stopBtn.classList.remove('hidden');
  interaction.startBtn.classList.add('hidden');
  for (interaction.item of interaction.settingsParts) {
    interaction.item.classList.add('hidden');
  }
}

function stopGame() {
  options.inPlay = false;
  options.score = 0;
  options.haveExtraLife = false;
  updateScore();
  elements.sequence.splice(0);
  gameObjects.hint.innerHTML = visuals.textStart;
  gameObjects.bonus.classList.remove('bonusOn');
  gameObjects.page.classList.add('noclick');
  interaction.stopBtn.classList.add('hidden');
  interaction.startBtn.classList.remove('hidden');
  for (interaction.item of interaction.settingsParts) {
    interaction.item.classList.remove('hidden');
  }
}

function tilesSlider() {
  const range = document.getElementById('rangeTiles').value;
  const rangeValuePink = 5;
  const rangeValueOrange = 6;
  if (
    range >= rangeValuePink &&
    gameObjects.pink.classList.contains('hidden')
  ) {
    gameObjects.pink.classList.remove('hidden');
    elements.tiles.push(gameObjects.pink);
  } else if (range < rangeValuePink) {
    elements.tiles.splice(4, 1);
    gameObjects.pink.classList.add('hidden');
  }
  if (range == rangeValueOrange) {
    gameObjects.orange.classList.remove('hidden');
    elements.tiles.push(gameObjects.orange);
  } else {
    elements.tiles.splice(5, 1);
    gameObjects.orange.classList.add('hidden');
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
    for (interaction.item of interaction.settingsSpeed) {
      interaction.item.classList.add('hidden');
    }
    timers.timeNextTile = timers.timeNextTileStart;
    timers.timeFlashLife = timers.timeFlashLifeStart;
  } else {
    options.speedMode = false;
    for (interaction.item of interaction.settingsSpeed) {
      interaction.item.classList.remove('hidden');
    }
  }
}

function updateScore() {
  document.getElementById('currentScore').innerHTML = options.score;
}

function updateMax() {
  document.getElementById('bestScore').innerHTML = options.scoreBest;
}
