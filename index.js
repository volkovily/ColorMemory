function rangeSlide() {
    const pink = document.getElementById('pink')
    const yellow = document.getElementById('yellow')
    const range = document.getElementById('myRange').value
    
    if (range >= 5 ) {
        pink.classList.remove("hidden");
    } else {
        pink.classList.add("hidden");
    }

    if (range >= 6) {
        yellow.classList.remove("hidden");
    } else {
        yellow.classList.add("hidden");
    }
}