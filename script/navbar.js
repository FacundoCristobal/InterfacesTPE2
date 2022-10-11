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
    if (e.target.checked) {
        menu.classList.add("visible");
        sideMenu.classList.add("sideMenuVisible");
        menuBackground.classList.add("visibleBackground");
    } else {
        menu.classList.remove("visible");
        menuBackground.classList.remove("visibleBackground");
        setTimeout(() => {
            sideMenu.classList.remove("sideMenuVisible");
        }, 300);
    }
});