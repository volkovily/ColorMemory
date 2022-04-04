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