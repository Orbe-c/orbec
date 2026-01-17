
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.classList.add('fade-out');
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});


let players = [];


function onYouTubeIframeAPIReady() {
    console.log('✓ YouTube API lista');

    $('iframe[id^="player-"]').each(function (index) {
        const iframeID = this.id;

        console.log('Creando player:', iframeID);

        players[index] = new YT.Player(iframeID, {
            events: {
                onReady: function () {
                    console.log('✓ Player listo:', iframeID);
                },
                onStateChange: onPlayerStateChange
            }
        });
    });
}


function onPlayerStateChange(event) {
    const carrusel = $('#carrete');
    if (!carrusel.hasClass('slick-initialized')) return;

    if (event.data === YT.PlayerState.PLAYING) {
        carrusel.slick('slickPause');
        console.log('▶ Video PLAY → carrusel PAUSADO');
    }

    if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
    ) {
        carrusel.slick('slickPlay');
        console.log('⏯ Video STOP → carrusel PLAY');
    }
}

$(document).ready(function () {
    console.log('Inicializando Slick...');

    /* ===== CARRUSEL DE VIDEOS ===== */
    const carrusel = $('#carrete').slick({
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

    console.log('✓ Carrusel de videos listo');

    /* ===== PAUSAR VIDEO AL CAMBIAR SLIDE ===== */
    $('#carrete').on('beforeChange', function (event, slick, currentSlide) {
        if (players[currentSlide]) {
            try {
                players[currentSlide].pauseVideo();
                console.log('⏸ Video pausado:', currentSlide);
            } catch (e) {
                console.warn('No se pudo pausar el video:', e);
            }
        }
    });

    /* ===== CARRUSEL DE SERVICIOS ===== */
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
            $('#carrete').slick('slickPause');
        } else {
            $('#carrete').slick('slickPlay');
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
