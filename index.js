let inPlay = false;

const blue = document.querySelector('.blue')
const red = document.querySelector('.red')
const green = document.querySelector('.green')
const yellow = document.querySelector('.yellow')
const page = document.querySelector('.noclick')

const tiles = [blue, red, green, yellow]

const hint = document.getElementById('hint')
const textRemember = 'Remember the sequence!'
const textRepeat = 'Now repeat the sequence!'
const textWrong = 'Wrong tile! Start a new game to try again!'


function playAudio(sound) {
  new Audio(sound).play();
}


function getRandomTile() {
  random = tiles[parseInt(Math.random() * tiles.length)]
  return random
}

let sequence = [getRandomTile()]
let sequenceToGuess = [...sequence]


const flash = (tile) => {
  return new Promise((resolve, reject) => {
    playAudio('assets/2.ogg')
    tile.className += ' active'
    console.log('tick')
    setTimeout(() => {
      tile.className = tile.className.replace(' active','')
      setTimeout(() => {
        resolve();
      }, 250) //time until next tile shows up
    }, 800) // flash live time
  })
}

let canClick = false
const tileClicked = tileClicked => {
  if (!canClick) return;
  const expectedTile = sequenceToGuess.shift();
  if (expectedTile === tileClicked) {
    if (sequenceToGuess.length === 0) {
      setTimeout(() => {
        sequence.push(getRandomTile())
        sequenceToGuess = [...sequence]
        startFlashing()
      }, 700); //time before new sequence shows
    }

  } else {
    playAudio('assets/wrong.ogg')
    hint.innerHTML = textWrong
    stopGame()
  }
}

const startFlashing = async () => {
  hint.innerHTML = textRemember
  page.classList.add("noclick");
  canClick = false;
  for(const tile of sequence) {
    await flash(tile)
  }
  hint.innerHTML = textRepeat
  page.classList.remove("noclick");
  canClick = true
}


function startGame() {
    sequence = [getRandomTile()]
    sequenceToGuess = [...sequence]
    inPlay = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    document.getElementById("myRange").classList.add("hidden");
    startFlashing()
  } 
  
  function stopGame() {
    sequence.splice(1)
    inPlay = false;
    page.classList.add("noclick");
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
    document.getElementById("myRange").classList.remove("hidden");
  }



// Range functionality
function rangeSlide() {
  const pink = document.querySelector('.pink')
  const orange = document.querySelector('.orange')
    const range = document.getElementById('myRange').value
    
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
    } else if (range < 6){
      tiles.splice(5,1)
        orange.classList.add("hidden");
    }
}
