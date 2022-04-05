let inPlay = false;
const blue = document.querySelector('.blue')
const red = document.querySelector('.red')
const green = document.querySelector('.green')
const yellow = document.querySelector('.yellow')


function playAudio(sound) {
  new Audio(sound).play();
}


const getRandomTile = () =>{
  const tiles = [blue, red, green, yellow]
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
    const pink = document.getElementById('pink')
    const orange = document.getElementById('orange')
    const range = document.getElementById('myRange').value
    
    if (range >= 5 ) {
        pink.classList.remove("hidden");
    } else {
        pink.classList.add("hidden");
    }

    if (range >= 6) {
        orange.classList.remove("hidden");
    } else {
        orange.classList.add("hidden");
    }
}

