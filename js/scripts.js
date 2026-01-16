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
    
    // Esperar a que Slick termine de cargar
    setTimeout(function() {
        $('iframe[id^="player-"]').each(function(index) {
            var iframeID = $(this).attr('id');
            players[index] = new YT.Player(iframeID, {
                playerVars: {
                    'controls': 1,
                    'rel': 0,
                    'modestbranding': 1
                },
                events: {
                    'onStateChange': onPlayerStateChange,
                    'onReady': function(event) {
                        console.log('Player ' + index + ' listo');
                    }
                }
            });
        });
    }, 1500);
}

function onPlayerStateChange(event) {
    // Si un video empieza a reproducirse, pausar el carrusel
    if (event.data == YT.PlayerState.PLAYING) {
        $('#carrete').slick('slickPause');
        console.log('Video reproduciéndose - carrusel pausado');
    } 
    // Solo reanudar cuando el video TERMINA
    else if (event.data == YT.PlayerState.ENDED) {
        $('#carrete').slick('slickPlay');
        console.log('Video terminado - carrusel reanudado');
    }
}

$(document).ready(function () {
    // Carrusel de proyectos (videos) - SLIDE CADA 5 SEGUNDOS
    var carrusel = $('#carrete').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000, // 5 segundos
        prevArrow: '<div class="carousel-prev">&#10094;</div>',
        nextArrow: '<div class="carousel-next">&#10095;</div>'
    });

    // PAUSAR VIDEO cuando cambia el slide (manualmente con flechas o automático)
    carrusel.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        console.log('Cambiando slide de ' + currentSlide + ' a ' + nextSlide);
        
        // Pausar el video del slide actual
        if (isYouTubeReady && players[currentSlide]) {
            try {
                players[currentSlide].pauseVideo();
                console.log('Video ' + currentSlide + ' pausado');
            } catch(e) {
                console.log('Error al pausar video ' + currentSlide + ':', e);
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
