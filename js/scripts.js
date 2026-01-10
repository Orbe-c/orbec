  <script>
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
            // Crear reproductores para cada iframe
            $('iframe[id^="player-"]').each(function(index) {
                var iframeID = $(this).attr('id');
                players[index] = new YT.Player(iframeID, {
                    events: {
                        'onStateChange': onPlayerStateChange
                    }
                });
            });
        }

        function onPlayerStateChange(event) {
            // Si un video empieza a reproducirse, pausar el carrusel
            if (event.data == YT.PlayerState.PLAYING) {
                $('#carrete').slick('slickPause');
            } 
        }

        $(document).ready(function () {
            // Carrusel de proyectos (videos)
            var carrusel = $('#carrete').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 6000,
                prevArrow: '<div class="carousel-prev">&#10094;</div>',
                nextArrow: '<div class="carousel-next">&#10095;</div>'
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

            // si carrusel cambia, pausar el video anterior
carrusel.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    if (isYouTubeReady && players[currentSlide] && players[currentSlide].pauseVideo) {
        players[currentSlide].pauseVideo();
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
            
            // Solo aplicar snap si estás bajando, no subiendo
            if (!isScrollingDown) return;
            
            const carrusel = document.getElementById('carrete-servicios');
            const rect = carrusel.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Solo se ancla si está muy cerca del tope (rango del 15%)
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
    </script>