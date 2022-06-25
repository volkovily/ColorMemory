const gameElements = {
  blue: document.querySelector('.blue'),
  red: document.querySelector('.red'),
  green: document.querySelector('.green'),
  yellow: document.querySelector('.yellow'),
  pink: document.querySelector('.pink'),
  orange: document.querySelector('.orange'),
  page: document.querySelector('.noclick'),
  bonus: document.getElementById('bonusId'),
  hint: document.getElementById('hint'),
  wrongSound: document.getElementById('wrongSound'),
  bonusSound: document.getElementById('bonusSound'),
  revertSound: document.getElementById('revertSound'),
};

const сontrollers = {
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  settingsParts: document.querySelectorAll('.settings'),
  settingsSpeed: document.querySelectorAll('.settingsSpeed'),
  item: [],
};

const hints = {
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

class ArrayOfTiles {
  constructor() {
    this.tiles = [
      gameElements.blue,
      gameElements.red,
      gameElements.green,
      gameElements.yellow,
    ];
    this.sequence = this.tiles;
    this.sequenceToGuess = this.sequence;
  }
}

const tilesArray = new ArrayOfTiles();

function getRandomTile() {
  const random =
    tilesArray.tiles[parseInt(Math.random() * tilesArray.tiles.length)];
  return random;
}

function createSequence() {
  tilesArray.sequence = [getRandomTile()];
  tilesArray.sequenceToGuess = [...tilesArray.sequence];
}

function playAudio(source) {
  new Audio(source).play();
}

function getRandomBool() {
  options.randomBoolean = Math.random() < options.getBonusChance;
  return options.randomBoolean;
}

function spawnBonus(min, max) {
  gameElements.bonus.style.left =
    Math.floor(Math.random() * (max - min + 1) + min) + '%';
}

const runBonusTimer = () => {
  timers.bonusTimer = setTimeout(() => {
    gameElements.bonus.classList.remove('bonusOn');
  }, timers.timeBonusLife);
};

function bonusAnimation() {
  if (!options.haveExtraLife && options.canGetBonus && options.isBonusEnabled) {
    spawnBonus(options.minBonusOffset, options.maxBonusOffset);
    clearTimeout(timers.bonusTimer);
    gameElements.bonus.classList.add('bonusOn');
    runBonusTimer();
  }
}

function onBonusClick() {
  options.haveExtraLife = true;
  gameElements.bonusSound.play();
  gameElements.bonus.classList.remove('bonusOn');
  gameElements.hint.innerHTML = hints.textBonus;
}

function adjustBonusChance() {
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
  gameElements.hint.innerHTML = hints.textRemember;
  options.canClick = false;
  for (const tile of tilesArray.sequence) {
    await flash(tile);
  }
  adjustBonusChance();
  if (options.inPlay) {
    if (options.score >= 4) {
      bonusAnimation();
    }
    gameElements.hint.innerHTML = hints.textRepeat;
    gameElements.page.classList.remove('noclick');
    options.canClick = true;
  }
};

const onTileClicked = (tileClicked) => {
  const expectedTile = tilesArray.sequenceToGuess.shift();
  if (expectedTile === tileClicked) {
    if (tilesArray.sequenceToGuess.length === 0) {
      options.score++;
      updateScore();
      speedUpGame();
      gameElements.page.classList.add('noclick');
      if (options.score > options.scoreBest) {
        options.scoreBest = options.score;
        updateMax();
      }
      setTimeout(() => {
        tilesArray.sequence.push(getRandomTile());
        tilesArray.sequenceToGuess = [...tilesArray.sequence];
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
  gameElements.wrongSound.play();
  resetGame();
  gameElements.hint.innerHTML = hints.textWrong;
  gameElements.hint.style.color = 'red';
}

function continueGame() {
  gameElements.revertSound.play();
  gameElements.page.classList.add('noclick');
  options.haveExtraLife = false;
  options.hadExtraLife = true;
  setTimeout(() => {
    tilesArray.sequenceToGuess = [...tilesArray.sequence];
    startFlashing();
  }, timers.timeFlashLifeStart);
}

function startGame() {
  createSequence();
  startFlashing();
  options.inPlay = true;
  gameElements.hint.style.color = 'black';
  gameElements.hint.innerHTML = hints.textStart;
  сontrollers.stopBtn.classList.remove('hidden');
  сontrollers.startBtn.classList.add('hidden');
  for (сontrollers.item of сontrollers.settingsParts) {
    сontrollers.item.classList.add('hidden');
  }
}

function resetGame() {
  options.inPlay = false;
  options.score = 0;
  options.haveExtraLife = false;
  updateScore();
  tilesArray.sequence.splice(0);
  gameElements.hint.innerHTML = hints.textStart;
  gameElements.bonus.classList.remove('bonusOn');
  gameElements.page.classList.add('noclick');
  сontrollers.stopBtn.classList.add('hidden');
  сontrollers.startBtn.classList.remove('hidden');
  for (сontrollers.item of сontrollers.settingsParts) {
    сontrollers.item.classList.remove('hidden');
  }
}

function tilesSlider() {
  const range = document.getElementById('rangeTiles').value;
  const pinkID = 5;
  const orangeID = 6;
  if (range >= pinkID && gameElements.pink.classList.contains('hidden')) {
    gameElements.pink.classList.remove('hidden');
    tilesArray.tiles.push(gameElements.pink);
  } else if (range < pinkID) {
    tilesArray.tiles.splice(4, 1);
    gameElements.pink.classList.add('hidden');
  }
  if (range == orangeID) {
    gameElements.orange.classList.remove('hidden');
    tilesArray.tiles.push(gameElements.orange);
  } else {
    tilesArray.tiles.splice(5, 1);
    gameElements.orange.classList.add('hidden');
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
    for (сontrollers.item of сontrollers.settingsSpeed) {
      сontrollers.item.classList.add('hidden');
    }
    timers.timeNextTile = timers.timeNextTileStart;
    timers.timeFlashLife = timers.timeFlashLifeStart;
  } else {
    options.speedMode = false;
    for (сontrollers.item of сontrollers.settingsSpeed) {
      сontrollers.item.classList.remove('hidden');
    }
  }
}

function updateScore() {
  document.getElementById('currentScore').innerHTML = options.score;
}

function updateMax() {
  document.getElementById('bestScore').innerHTML = options.scoreBest;
}
