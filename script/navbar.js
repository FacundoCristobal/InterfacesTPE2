"use strict";

let menu = document.querySelector("#menu");
let burgerCheckbox = document.querySelector("#burgerCheckbox");
let menuBackground = document.querySelector("#background");
let sideMenu = document.querySelector("#sideMenu");

menuBackground.addEventListener("click", (e) => {
    menu.classList.remove("visible");

    menuBackground.classList.remove("visibleBackground");
    burgerCheckbox.checked = false;
    setTimeout(() => {
        sideMenu.classList.remove("sideMenuVisible");
    }, 300);
});

burgerCheckbox.addEventListener("change", (e) => {

    let listOfChildren = document.querySelectorAll('menu>*');

    if (e.target.checked) {
        menu.classList.add("visible");
        sideMenu.classList.add("sideMenuVisible");
        menuBackground.classList.add("visibleBackground");
        for (let index = 0; index < listOfChildren.length; index++) {
            listOfChildren[index].style.animation = 'appear 300ms ease-in forwards ' + (index + 1) * 200 + 'ms';
        }
    } else {
        menu.classList.remove("visible");
        menuBackground.classList.remove("visibleBackground");
        setTimeout(() => {
            sideMenu.classList.remove("sideMenuVisible");
        }, 300);
        for (let index = 0; index < listOfChildren.length; index++) {
            listOfChildren[index].style.animation = 'none';
        }
    }
});