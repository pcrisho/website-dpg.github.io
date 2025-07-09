let indiceActual = 0;
const carrusel = document.getElementById("carrusel");
const totalSlides = document.querySelectorAll(".carrusel-item").length;

function moverCarrusel(direccion) {
  indiceActual += direccion;

  if (indiceActual < 0) {
    indiceActual = totalSlides - 1;
  } else if (indiceActual >= totalSlides) {
    indiceActual = 0;
  }

  carrusel.style.transform = `translateX(-${indiceActual * 100}%)`;
}

// Carrusel automático cada 5 segundos
setInterval(function() {
  moverCarrusel(1);
}, 10000);