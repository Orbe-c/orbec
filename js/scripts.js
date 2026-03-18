// Preloader
window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    preloader.classList.add('fade-out');
    setTimeout(function () {
        preloader.style.display = 'none';
    }, 500);
});

//reproduccion carrusel youtube:
// Variables para los reproductores de YouTube
var players = {};
var carrusel;

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
    

    // Cargar video al hacer clic en thumbnail
    $('.video-wrapper').on('click', function() {
        const wrapper = $(this);
        const videoId = wrapper.data('video-id');
        
        if (!wrapper.hasClass('playing')) {
            // Crear iframe
            const iframe = $('<iframe>', {
                src: `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`,
                frameborder: 0,
                allowfullscreen: true,
                allow: 'autoplay'
            });
            
            wrapper.addClass('playing');
            wrapper.append(iframe);
            
            // Pausar autoplay del carrusel
            carrusel.slick('slickPause');
        }
    });

    // Pausar videos al cambiar de slide
carrusel.on('beforeChange', function () {

    $('.video-wrapper').each(function () {
        const wrapper = $(this);
        if (wrapper.hasClass('playing')) {
            wrapper.find('iframe').remove();
            wrapper.removeClass('playing');
        }
    });

    carrusel.slick('slickPlay');
});


    // Carrusel de servicios
  $('#carrete-servicios').slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  fade: true,           // ← transición más suave
  cssEase: 'ease-in-out',
  dots: false,
  arrows: true,
  prevArrow: '<div class="carousel-prev">&#10094;</div>',
  nextArrow: '<div class="carousel-next">&#10095;</div>',
  waitForAnimate: false
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

// Botón volver arriba
window.addEventListener('scroll', function() {
    const btnVolverArriba = document.getElementById('btn-volver-arriba');
    
    if (window.pageYOffset > 300) {
        btnVolverArriba.classList.add('visible');
    } else {
        btnVolverArriba.classList.remove('visible');
    }
});

document.getElementById('btn-volver-arriba').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

function mostrarContenido(id, boton){
  document.querySelectorAll(".contenido-trabajo").forEach(seccion=>{
    seccion.classList.remove("visible")
  })
  document.getElementById(id).classList.add("visible")
  document.querySelectorAll(".filtro-trabajo button").forEach(btn=>{
    btn.classList.remove("activo")
  })
  boton.classList.add("activo")

  // Recargar embeds de TikTok correctamente
  if(id === "redes"){
    const oldScript = document.querySelector('script[src*="tiktok.com/embed.js"]');
    if(oldScript) oldScript.remove();
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }
}

// ---- Auto-scroll TikTok ----
(function () {
  const slides = document.querySelectorAll('.tiktok-slide');
  const dots = document.querySelectorAll('.tiktok-dot');
  let current = 0;
  let timer = null;

  function irA(index) {
    // Oculta todas
    slides.forEach((s, i) => {
      s.style.transform = i < index
        ? 'translateY(-100%)'
        : i === index
          ? 'translateY(0)'
          : 'translateY(100%)';
      s.style.zIndex = i === index ? 1 : 0;
    });
    dots.forEach(d => d.classList.remove('activo'));
    if (dots[index]) dots[index].classList.add('activo');
    current = index;
  }

  function siguiente() {
    irA((current + 1) % slides.length);
  }

  function iniciar() {
    irA(0);
    timer = setInterval(siguiente, 6000);
  }

  function detener() {
    clearInterval(timer);
  }

  // Inicia cuando se muestra la sección
  const feedEl = document.querySelector('.tiktok-feed');
  if (feedEl) {
    feedEl.addEventListener('mouseenter', detener);
    feedEl.addEventListener('mouseleave', () => {
      timer = setInterval(siguiente, 6000);
    });
    // Arranca solo cuando el tab de redes es visible
    const btnRedes = document.querySelector('[onclick*="redes"]');
    if (btnRedes) {
      btnRedes.addEventListener('click', () => {
        detener();
        iniciar();
      });
    }
    // Por si ya está visible al cargar
    if (document.getElementById('redes')?.classList.contains('visible')) {
      iniciar();
    }
  }
})();


