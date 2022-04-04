let inPlay = false;

function startGame() {
    inPlay = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
  } 
  
  function stopGame() {
    inPlay = false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
  }


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

function playAudio(sound) {
    new Audio(sound).play();
  }