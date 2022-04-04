function rangeSlide() {
    let range = document.getElementById('myRange').value;
    if (range == 5) {
        console.log('it is 5')
        range.className = range.className
        .replace('hidden', '')
        .trim()
    }
}