let inPlay = false;
const blue = document.querySelector('.blue')
const red = document.querySelector('.red')
const green = document.querySelector('.green')
const yellow = document.querySelector('.yellow')

function playAudio(sound) {
  new Audio(sound).play();
}

const tiles = [blue, red, green, yellow]
console.log(tiles)

function getRandomTile() {
  return tiles[parseInt(Math.random() * tiles.length)]
}

const sequence = [
 getRandomTile(),
 getRandomTile(),
 getRandomTile(),
 getRandomTile()
]

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


const main = async () => {
  for(let tile of sequence) {
    await flash(tile)
  }

}

function startGame() {
    inPlay = true;
    // tileс = document.getElementsByClassName('tile')
    // tileс.classList.remove("noclick");
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    document.getElementById("myRange").classList.add("hidden");
    main()
  } 
  
  function stopGame() {
    inPlay = false;
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
        console.log(tiles)
      } else if (range < 5){
        tiles.splice(4,1)
          pink.classList.add("hidden");
          console.log(tiles)
      }


    if (range == 6) {
        orange.classList.remove("hidden");
        tiles.push(orange)
        console.log(tiles)
    } else if (range < 6){
      tiles.splice(5,1)
        orange.classList.add("hidden");
    }
}

