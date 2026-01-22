function hidePreloader() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    }
}

if (document.readyState === 'complete') {
    hidePreloader();
} else {
    window.addEventListener('load', hidePreloader);
}

var players = [];
var carrusel;

function onYouTubeIframeAPIReady() {
    $('iframe[id^="player-"]').each(function (index) {
        var iframeID = $(this).attr('id');
        players[index] = new YT.Player(iframeID, {
            events: {
                onStateChange: onPlayerStateChange
            }
        });
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        carrusel.slick('slickPause');
    }
    if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        carrusel.slick('slickPlay');
    }
}

$(document).ready(function () {
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

    carrusel.on('beforeChange', function (event, slick, currentSlide) {
        if (players[currentSlide]) {
            players[currentSlide].pauseVideo();
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

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            carrusel.slick('slickPause');
        } else {
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

