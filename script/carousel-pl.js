"use strict";

let listOfImages = document.querySelectorAll('.carouselContainer .carousel img');

let currentImageIndex = 1;

let currentImage = listOfImages[currentImageIndex];

listOfImages.forEach((e, key) => {
    e.addEventListener('click', (e) => {
        setCurrentImage(key)
    })
})

function setCurrentImage(index) {
    currentImageIndex = index;
    currentImage = listOfImages[currentImageIndex];
    let previousImage = listOfImages[currentImageIndex - 1];
    let nextImage = listOfImages[currentImageIndex + 1];

    listOfImages.forEach(e => {
        e.classList.remove('leftImage');
        e.classList.remove('rightImage');
        e.classList.remove('currentImage');
    });
    currentImage.classList.add('currentImage');
    previousImage ? previousImage.classList.add('leftImage') : null;
    nextImage ? nextImage.classList.add('rightImage') : null;
}

setCurrentImage(currentImageIndex);