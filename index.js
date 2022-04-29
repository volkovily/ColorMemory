let inPlay = false;

const blue = document.querySelector('.blue')
const red = document.querySelector('.red')
const green = document.querySelector('.green')
const yellow = document.querySelector('.yellow')
const page = document.querySelector('.noclick')
const wrongSound = document.getElementById('wrongSound')

const powerup = document.getElementById('powerupId')

const hint = document.getElementById('hint')
const textStart = 'Click on the button to start the game!'
const textRemember = 'Remember the sequence!'
const textRepeat = 'Now repeat the sequence!'
const textWrong = 'Wrong tile! Start a new game to try again!'

const maxLeft = 100
const minLeft = 12
const timePowerupLife = 10000
let timeNextTile = 250
let timeFlashLife = 800
const timeNextSequence = 700

const timeNextTileStart = 250
const timeFlashLifeStart = 800

let score = 0
let scoreBest = 0

const tiles = [blue, red, green, yellow]  

function playAudio(source) {
  new Audio(source).play();
}
  
function getRandomTile() {
  random = tiles[parseInt(Math.random() * tiles.length)]
  return random
}

let sequence = [getRandomTile()]
let sequenceToGuess = [...sequence]

function powerupStart(min, max) {
  powerup.style.left = Math.floor(Math.random() * (max - min + 1) + min) +"%"
}
powerupStart(minLeft, maxLeft)


function powerupAni(){
  powerup.classList.add('powerupOn')
  setTimeout(() => {
    powerup.classList.remove('powerupOn')
  }, timePowerupLife);
}

function powerupClick() {
  console.log('test powerup') 
  }

const flash = (tile) => {
  return new Promise((resolve) => {
    currentNote = tile.dataset.color
    noteSound = document.querySelector(`[data-sound='${currentNote}']`);
    noteSound.play()
    tile.className += ' active'
    setTimeout(() => {
      tile.className = tile.className.replace(' active','')
      setTimeout(() => {
        resolve();
      }, timeNextTile) //time until next tile shows up
    }, timeFlashLife) // flash life time
  })
}

let canClick = false
const tileClicked = tileClicked => {
  if (!canClick) return;
  const expectedTile = sequenceToGuess.shift();
  if (expectedTile === tileClicked) {
    if (sequenceToGuess.length === 0) {
      score++
      if (score > scoreBest) {
        scoreBest = score;
        updateMax();
      }
      updateScore()
      page.classList.add("noclick");
      
      setTimeout(() => {
        sequence.push(getRandomTile())
        sequenceToGuess = [...sequence]
        startFlashing()
      }, timeNextSequence); //time before new sequence shows
    }
  } else {
    wrongSound.play()
    stopGame()
    hint.innerHTML = textWrong
    hint.style.color = 'red'
  }
}

const startFlashing = async () => {
  hint.innerHTML = textRemember
  canClick = false;
  for(const tile of sequence) {
    await flash(tile)
  }
  if(inPlay) {
    if (score >= 5) {
      powerupAni()
    }
  hint.innerHTML = textRepeat
  page.classList.remove("noclick");
  canClick = true
  }
}

function startGame() {
  inPlay = true;
  hint.style.color = 'black'
    hint.innerHTML = textStart
    sequence = [getRandomTile()]
    sequenceToGuess = [...sequence]
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    document.getElementById("rangeTiles").classList.add("hidden");
    document.getElementById("rangeSpeed").classList.add("hidden");
    document.getElementById("labelTiles").classList.add("hidden");
    document.getElementById("labelSpeed").classList.add("hidden");
    document.getElementById("speed").classList.add("hidden");
    document.getElementById("checkbox").classList.add("hidden");
    document.getElementById("labelCheckbox").classList.add("hidden");
    startFlashing()
  } 
  
  function stopGame() {
    inPlay = false;
    score = 0
    updateScore()
    sequence.splice(0)
    hint.innerHTML = textStart
    page.classList.add("noclick");
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
    document.getElementById("rangeTiles").classList.remove("hidden");
    document.getElementById("rangeSpeed").classList.remove("hidden");
    document.getElementById("labelTiles").classList.remove("hidden");
    document.getElementById("labelSpeed").classList.remove("hidden");
    document.getElementById("speed").classList.remove("hidden");
    document.getElementById("checkbox").classList.remove("hidden");
    document.getElementById("labelCheckbox").classList.remove("hidden");
  }

// Range functionality
function rangeSlide() {
  const pink = document.querySelector('.pink')
  const orange = document.querySelector('.orange')
  const range = document.getElementById('rangeTiles').value
    
    if (range >= 5 && pink.classList.contains("hidden")) {
        pink.classList.remove("hidden");
        tiles.push(pink)
      } else if (range < 5){
        tiles.splice(4,1)
          pink.classList.add("hidden");
      }
    if (range == 6) {
        orange.classList.remove("hidden");
        tiles.push(orange)
    } else {
      tiles.splice(5,1)
        orange.classList.add("hidden");
    }
}

function rangeSpeed() {
  const rangeSpeed = document.getElementById('rangeSpeed').value
  
  if (rangeSpeed > 1)
  timeNextTile = timeNextTileStart / rangeSpeed
  timeFlashLife = timeFlashLifeStart / rangeSpeed
  document.getElementById("speed").innerHTML = rangeSpeed + 'x'
}

function isChecked() {
if(document.getElementById('checkbox').checked){
  console.log('hi')
}
}

function updateScore() {
  document.getElementById("currentScore").innerHTML = score;
}

function updateMax() {
  document.getElementById("bestScore").innerHTML = scoreBest;
}