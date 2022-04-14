let inPlay = false;
const blue = document.querySelector('.blue')
const red = document.querySelector('.red')
const green = document.querySelector('.green')
const yellow = document.querySelector('.yellow')
const page = document.querySelector('.noclick')

function playAudio(sound) {
  new Audio(sound).play();
}

const tiles = [blue, red, green, yellow]

function getRandomTile() {
  return tiles[parseInt(Math.random() * tiles.length)]
}

const sequence = [getRandomTile()]
let sequenceToGuess = [...sequence]

const flash = (tile) => {
  return new Promise((resolve, reject) => {
    tile.className += ' active'
    console.log('tick')
    setTimeout(() => {

      tile.className = tile.className.replace(' active','')
      setTimeout(() => {
        resolve();
      }, 250);
    }, 700)
  })
}

let canClick = false
const tileClicked = tileClicked => {
  if (!canClick) return;
  const expectedTile = sequenceToGuess.shift();
  if (expectedTile === tileClicked) {
    if (sequenceToGuess.length === 0) {
      //start again
      sequence.push(getRandomTile())
      sequenceToGuess = [...sequence]
      startFlashing()
    }

  } else {
    // end
    alert('wrong')
    stopGame()
  }
}

const startFlashing = async () => {
  page.classList.add("noclick");
  canClick = false;
  for(const tile of sequence) {
    await flash(tile)
  }
  page.classList.remove("noclick");
  canClick = true
}

function startGame() {
    inPlay = true;
    // tileс = document.getElementsByClassName('tile')
    // tileс.classList.remove("noclick");
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    document.getElementById("myRange").classList.add("hidden");
    startFlashing()
  } 
  
  function stopGame() {
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
    
    if (range == 5 && pink.classList.contains("hidden")) {
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

