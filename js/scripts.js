// Preloader
window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Variables globales para reproductores de YouTube
window.players = [];
window.isYouTubeReady = false;

// Función global para la API de YouTube
window.onYouTubeIframeAPIReady = function() {
    window.isYouTubeReady = true;
    
    // Crear reproductores para cada iframe
    $('iframe[id^="player-"]').each(function(index) {
        var iframeID = $(this).attr('id');
        window.players[index] = new YT.Player(iframeID, {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    });
};

// Manejar cambios de estado del video
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        $('#carrete').slick('slickPause');
    }
    else if (event.data == YT.PlayerState.ENDED) {
        $('#carrete').slick('slickPlay');
    }
}

// Inicialización cuando el DOM está listo
$(document).ready(function () {
    var carrusel = $('#carrete').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        prevArrow: '<div class="carousel-prev">&#10094;</div>',
        nextArrow: '<div class="carousel-next">&#10095;</div>'
    });

    carrusel.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        if (window.isYouTubeReady && window.players[currentSlide] && window.players[currentSlide].pauseVideo) {
            window.players[currentSlide].pauseVideo();
        }
    });

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

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            carrusel.slick('slickPause');
        } else {
            carrusel.slick('slickPlay');
        }
    });
});

// Efecto de snap al carrusel de servicios
let isSnapping = false;
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    if (isSnapping) return;
    
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrollingDown = currentScrollTop > lastScrollTop;
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    
    if (!isScrollingDown) return;
    
    const carrusel = document.getElementById('carrete-servicios');
    const rect = carrusel.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top < windowHeight * 0.15 && rect.top > -windowHeight * 0.15) {
        isSnapping = true;
        carrusel.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        setTimeout(() => {
            isSnapping = false;
        }, 1000);
    }
});
