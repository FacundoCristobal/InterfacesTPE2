"use strict";


const slider = document.getElementsByClassName("sliderContainer")[0];
const slider2 = document.getElementsByClassName("sliderContainer")[1];
const cards = document.querySelectorAll('.card');
const maxRotation = 3;

let rect;

cards.forEach(card => {
    card.addEventListener('mouseover', (e) => {
        rect = card.getBoundingClientRect();
    });
    card.addEventListener('mousemove', e => {

        let centerX = (rect.width / 2) + rect.x;
        let centerY = (rect.height / 2) + rect.y;
        let mouseX = e.x - centerX;
        let mouseY = e.y - centerY;



        let rotationX = (mouseX * maxRotation) / (rect.width / 2);
        let rotationY = (mouseY * maxRotation) / (rect.height / 2);
        card.style.transform = 'rotateX(' + -rotationY + 'deg) rotateY(' + rotationX + 'deg)';
    });
    card.addEventListener('mouseout', e => {
        card.style.transform = '';
    });
})



slider.addEventListener("mousedown", (e) => {
    mouseDownHandler(e);
});

let pos = { top: 0, left: 0, x: 0, y: 0 };

window.setTimeout(() => {
    loader.classList.add('invisible');
}, 3000);

const mouseDownHandler = function(e) {
    slider.style.cursor = "grabbing";
    slider.style.userSelect = "none";
    pos = {
        // The current scroll
        left: slider.scrollLeft,
        top: slider.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
};

const mouseMoveHandler = function(e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    slider.scrollTop = pos.top - dy;
    slider.scrollLeft = pos.left - dx;
};

const mouseUpHandler = function() {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);

    slider.style.cursor = "grab";
    slider.style.removeProperty("user-select");
};

slider2.addEventListener("mousedown", (e) => {
    mouseDownHandler2(e);
});

let pos2 = { top: 0, left: 0, x: 0, y: 0 };

const mouseDownHandler2 = function(e) {
    slider2.style.cursor = "grabbing";
    slider2.style.userSelect = "none";
    pos2 = {
        // The current scroll
        left: slider2.scrollLeft,
        top: slider2.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    document.addEventListener("mousemove", mouseMoveHandler2);
    document.addEventListener("mouseup", mouseUpHandler2);
};

const mouseMoveHandler2 = function(e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos2.x;
    const dy = e.clientY - pos2.y;

    // Scroll the element
    slider2.scrollTop = pos2.top - dy;
    slider2.scrollLeft = pos2.left - dx;
};

const mouseUpHandler2 = function() {
    document.removeEventListener("mousemove", mouseMoveHandler2);
    document.removeEventListener("mouseup", mouseUpHandler2);

    slider2.style.cursor = "grab";
    slider2.style.removeProperty("user-select");
};