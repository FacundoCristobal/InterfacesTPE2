window.addEventListener("scroll", scrollPromo);

const imagenesPromo = document.querySelectorAll(".promo-img img")
const textosPromo = document.querySelectorAll(".promo-text")

function scrollPromo() {

    let primeraImagen;
    let primerTexto;

    textosPromo.forEach( (el, index) => {
        let posText = el.getBoundingClientRect().y - (window.innerHeight/4);

        el.classList.remove("promo-text-actual");

        if (posText < 0){
            primeraImagen = imagenesPromo[index];
            el.classList.add("promo-text-actual");
        }
        
    })

    imagenesPromo.forEach( el => {
        el.classList.remove("imagen-actual");
    })

    if(primeraImagen) {
        primeraImagen.classList.add("imagen-actual");
    }
}