const observerCards = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('show-card');
        }else {
            entry.target.classList.remove('show-card');
            //entry.target.classList.add('hidden-card');
        }

    });
});


const cardsPersonajes = document.querySelectorAll(".personaje-card");

const imagenesHistoria = document.querySelectorAll(".descripcion-card");

cardsPersonajes.forEach((el) => observerCards.observe(el));

const textosHistoria = document.querySelectorAll(".descripcion-card > p");

const observerHistoria = new IntersectionObserver((entries, observer) => {
    let zoom = 0.5;
    const ZOOM_SPEED = 0.05;
    entries.forEach( entry => {
        if (entry.isIntersecting) {
            document.addEventListener('wheel', (e) => {
                if (e.deltaY > 0 && zoom <= 1.1) {
                    entry.target.style.transform = `scale(${(zoom += ZOOM_SPEED)})`;
                }
            })
            observer.unobserve(entry.target);
        }
    })
}, { threshold: 0, rootMargin: "200px"})

// , { threshold: [0, .25, .5, .75, 1] }

textosHistoria.forEach((el) => {
    observerHistoria.observe(el);
})

let nombresPersonajes = document.querySelectorAll(".info-personaje h1");
console.log(nombresPersonajes[0]);

window.addEventListener("scroll", () => {
    let scrolled = window.scrollY;
    

    nombresPersonajes.forEach( el => {
        let posTitle = el.getBoundingClientRect().y;
        let animationStart = posTitle - window.innerHeight/2 - window.innerHeight/4;
        let animationEnd = animationStart + window.innerHeight/4;
        if ( animationStart < 0 && animationEnd >= 0 ) {
            let offsetX = animationEnd * (200/(window.innerHeight/4));
            const visibility = animationEnd/(window.innerHeight/4)
            el.style.transform = `translateX(${offsetX}px)`;
            el.style.opacity = 1 - visibility;
        } else if (animationStart > 0){
            el.style.opacity = 0;
        }
    })
    
})

window.addEventListener("scroll", scrollSection);

function scrollSection() {
    
}