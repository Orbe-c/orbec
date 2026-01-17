window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

let players = [];
let isYouTubeReady = false;

// YouTube llama esto automáticamente
function onYouTubeIframeAPIReady() {
    isYouTubeReady = true;
    console.log('✓ YouTube API lista');
}


function isAnyVideoPlaying() {
    return players.some(player => {
        try {
            return player && player.getPlayerState() === YT.PlayerState.PLAYING;
        } catch (e) {
            return false;
        }
    });
}

function onPlayerStateChange(event) {
    if (!$('#carrete').hasClass('slick-initialized')) return;

    if (event.data === YT.PlayerState.PLAYING) {
        $('#carrete').slick('slickPause');
        console.log('▶ Video PLAY → carrusel PAUSADO');
    }

    if (
        (event.data === YT.PlayerState.PAUSED ||
         event.data === YT.PlayerState.ENDED) &&
        !isAnyVideoPlaying()
    ) {
        $('#carrete').slick('slickPlay');
        console.log('⏯ Ningún video activo → carrusel PLAY');
    }
}


$(document).ready(function () {
    console.log('Iniciando carruseles...');

    /* ===== CARRUSEL DE VIDEOS ===== */
    const carrusel = $('#carrete');

    carrusel.on('init', function () {
        console.log('✓ Slick listo → creando players YouTube');

        if (!isYouTubeReady) {
            console.warn('⚠ YouTube API aún no lista');
            return;
        }

        $('iframe[id^="player-"]').each(function (index) {
            const iframeID = this.id;

            players[index] = new YT.Player(iframeID, {
                events: {
                    onReady: () => {
                        console.log('✓ Player listo:', iframeID);
                    },
                    onStateChange: onPlayerStateChange
                }
            });
        });
    });

    carrusel.slick({
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

    /* ===== PAUSAR VIDEO AL CAMBIAR SLIDE ===== */
    carrusel.on('beforeChange', function (event, slick, currentSlide) {
        if (players[currentSlide]) {
            try {
                players[currentSlide].pauseVideo();
                console.log('⏸ Video pausado:', currentSlide);
            } catch (e) {
                console.warn('No se pudo pausar video:', e);
            }
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

    /* ===== PAUSAR CARRUSEL SI LA PESTAÑA NO ESTÁ VISIBLE ===== */
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            carrusel.slick('slickPause');
        } else if (!isAnyVideoPlaying()) {
            carrusel.slick('slickPlay');
        }
    });
});


let isSnapping = false;
let lastScrollTop = 0;

window.addEventListener('scroll', function () {
    if (isSnapping) return;

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isScrollingDown = currentScrollTop > lastScrollTop;
    lastScrollTop = Math.max(currentScrollTop, 0);

    if (!isScrollingDown) return;

    const carrusel = document.getElementById('carrete-servicios');
    if (!carrusel) return;

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
