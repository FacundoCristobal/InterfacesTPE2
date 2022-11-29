"use strict";

window.addEventListener('scroll', (e) => {
    const sky = document.querySelector('#sky');
    const sun = document.querySelector('#sun');
    const logo = document.querySelector('#pl_logo');

    let scrolled = window.scrollY;
    let viewportHeight = window.innerHeight;
    let logoDisolveStart = viewportHeight * .4;
    let logoDisolveEnd = viewportHeight * .8;
    let skyRate = scrolled * 0.5;
    let sunRate = scrolled * .3;

    sky.style.transform = 'translate3d(0px, ' + skyRate + 'px, 0px)';
    sun.style.transform = 'translate3d(0px, ' + sunRate + 'px, 0px)';

    if (scrolled > logoDisolveStart && scrolled < logoDisolveEnd) {
        logo.style.opacity = 1 - ((scrolled - logoDisolveStart) / (logoDisolveEnd - logoDisolveStart));
    } else if (scrolled > logoDisolveEnd) {
        logo.style.opacity = 0;
    } else {
        logo.style.opacity = 1;
    }

})