window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    preloader.classList.add('fade-out');
    setTimeout(function() {
        preloader.style.display = 'none';
    }, 500);
});

// Variables para los reproductores de YouTube
var players = [];
var isYouTubeReady = false;

// Esta función se llama automáticamente cuando la API de YouTube está lista
function onYouTubeIframeAPIReady() {
    isYouTubeReady = true;
    console.log('YouTube API iniciando...');
    
    // Esperar a que Slick termine de cargar
    setTimeout(function() {
        $('iframe[id^="player-"]').each(function(index) {
            var iframeID = $(this).attr('id');
            console.log('Creando player: ' + iframeID);
            players[index] = new YT.Player(iframeID, {
                events: {
                    'onStateChange': onPlayerStateChange,
                    'onReady': function(event) {
                        console.log('✓ Player ' + index + ' listo');
                    }
                }
            });
        });
    }, 2000);
}

function onPlayerStateChange(event) {
    // Si un video empieza a reproducirse, pausar el carrusel
    if (event.data == YT.PlayerState.PLAYING) {
        $('#carrete').slick('slickPause');
        console.log('▶ Video reproduciéndose - carrusel pausado');
    } 
    // Reanudar cuando el video se pausa o termina
    else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        $('#carrete').slick('slickPlay');
        console.log('⏸ Video pausado/terminado - carrusel reanudado');
    }
}

$(document).ready(function () {
    console.log('Iniciando carruseles...');
    
    // Carrusel de proyectos (videos) - SLIDE CADA 5 SEGUNDOS
    var carrusel = $('#carrete').slick({
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

    console.log('✓ Carrusel de videos iniciado');

    // PAUSAR VIDEO cuando cambia el slide
    carrusel.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        console.log('→ Cambiando slide: ' + currentSlide + ' → ' + nextSlide);
        
        if (isYouTubeReady && players[currentSlide]) {
            try {
                players[currentSlide].pauseVideo();
                console.log('⏸ Video ' + currentSlide + ' pausado');
            } catch(e) {
                console.log('Error pausando video:', e);
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
    document.addEventListener("visibilitychange", function () {
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
