const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper .arrow");
const firstCardWidth = carousel.querySelector(".carousel__card").offsetWidth
const carouselChildrens = [...carousel.children];

let isDragging = false, startX, startScrollLeft, timeoutID;

// Obtiene el número de cards que pueden entrar en la vista del carrusel
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Inserta copias de algunas cards del inicio del carrusel para un scrolling infinito
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Inserta copias de algunas cards del final del carrusel para un scrolling infinito
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Lista de eventos para los botones realicen desplazamiento por el carrusel por la derecha e izquierda
arrowBtns.forEach( btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id ===  "left" ? - firstCardWidth : firstCardWidth; //right
    })
});

const draggStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging")
    // Guarda el cursor inicial y la posición del scroll del carrusel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft
}

const dragging = (e) => {
    if(!isDragging) return; // Si isDragging es falso, retornará hacia aquí
    // Actualiza la posición del scroll del carrusel en base al movimiento del cursor
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging")   
}

const autoPlay = () => {
    if(window.innerWidth < 800) return; //Retornar si la ventana es más pequeña que 800
    // Recorre  el carrusel después de 2500ms
    timeoutID = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500)
}
autoPlay();

const InfinityScroll = () => {
    // Si el carrusel está en el inicio, scrollea al final
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - ( 2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // Si el carrusel está en el final, scrollea al inicio
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Limpia el timeoupt y lo empieza nuevamente si el mouse no está dentro del carrusel
    clearTimeout(timeoutID);
    if(!wrapper.matches(":hover")) autoPlay();
}

carousel.addEventListener("mousedown" , draggStart);
carousel.addEventListener("mousemove" , dragging);
document.addEventListener("mouseup" , dragStop);
carousel.addEventListener("scroll" , InfinityScroll);
wrapper.addEventListener("mouseenter" , () => clearTimeout(timeoutID));
wrapper.addEventListener("mouseleave" , autoPlay);