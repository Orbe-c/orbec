// Preloader
window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    preloader.classList.add('fade-out');
    setTimeout(function () {
        preloader.style.display = 'none';
    }, 500);
});

// Variables para los reproductores de YouTube
var players = [];
var carrusel;
var isYouTubeReady = false;

// Esta función se llama automáticamente cuando la API de YouTube está lista
function onYouTubeIframeAPIReady() {
    $('iframe[id^="player-"]').each(function (index) {
        var iframeID = $(this).attr('id');
        players[index] = new YT.Player(iframeID, {
            events: {
                onStateChange: onPlayerStateChange,
                onReady: function() {
                    isYouTubeReady = true;
                    console.log('Player ' + index + ' listo');
                }
            }
        });
    });
}

// Función que detecta cambios en el estado del video
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        carrusel.slick('slickPause');
    }
    if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        carrusel.slick('slickPlay');
    }
}

// Cuando el DOM está listo
$(document).ready(function () {

    // Cambio de logo al hacer click
const logos = [
    "imagenes/logo.png",
    "RecursosOrbec/Logos/Logo orbe-12.png"
];

let currentLogo = 0;
const logoElement = document.getElementById("logo");

if (logoElement) {
    logoElement.addEventListener("click", () => {
        logoElement.style.opacity = 0;

        setTimeout(() => {
            currentLogo = (currentLogo + 1) % logos.length;
            logoElement.src = logos[currentLogo];
            logoElement.style.opacity = 1;
        }, 150);
    });
}

    // Carrusel de proyectos (videos)
    carrusel = $('#carrete').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: false,
        pauseOnFocus: false,
        prevArrow: '<div class="carousel-prev">&#10094;</div>',
        nextArrow: '<div class="carousel-next">&#10095;</div>'
    });

    // Pausar el video cuando cambia el slide
    carrusel.on('beforeChange', function (event, slick, currentSlide) {
        if (isYouTubeReady && players[currentSlide]) {
            try {
                players[currentSlide].pauseVideo();
                console.log('Video pausado');
            } catch(e) {
                console.log('Error al pausar');
            }
        }
    });

    // Carrusel de servicios
    $('#carrete-servicios').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        dots: true,
        arrows: true,
        prevArrow: '<div class="carousel-prev">&#10094;</div>',
        nextArrow: '<div class="carousel-next">&#10095;</div>',
        appendDots: $('#nuestros-servicios')
    });

    // Pausar el carrusel cuando la pestaña no está visible
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            carrusel.slick('slickPause');
        } else {
            carrusel.slick('slickPlay');
        }
    });
});

// Efecto de snap al carrusel cuando haces scroll
let isSnapping = false;
let lastScrollTop = 0;

window.addEventListener('scroll', function () {
    if (isSnapping) return;

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrollingDown = currentScrollTop > lastScrollTop;
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;

    if (!isScrollingDown) return;

    const carruselServicios = document.getElementById('carrete-servicios');
    const rect = carruselServicios.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight * 0.15 && rect.top > -windowHeight * 0.15) {
        isSnapping = true;
        carruselServicios.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        setTimeout(() => {
            isSnapping = false;
        }, 1000);
    }
});



