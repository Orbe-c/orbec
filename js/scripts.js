// ---- Preloader ----
window.addEventListener('load', function () {
  var preloader = document.getElementById('preloader');
  preloader.classList.add('fade-out');
  setTimeout(function () { preloader.style.display = 'none'; }, 500);
});

var carrusel;

$(document).ready(function () {

  // Cambio de logo al hacer click
  const logos = ["imagenes/logo.png", "RecursosOrbec/Logos/Logo orbe-12.png"];
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

  // ---- Carrusel YouTube ----
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

  // Reproducir video al clic
  $('.video-wrapper').on('click', function () {
    const wrapper = $(this);
    const videoId = wrapper.data('video-id');
    if (!wrapper.hasClass('playing')) {
      const iframe = $('<iframe>', {
        src: `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`,
        frameborder: 0,
        allowfullscreen: true,
        allow: 'autoplay'
      });
      wrapper.addClass('playing').append(iframe);
      carrusel.slick('slickPause');
    }
  });

  // Limpiar video al cambiar slide
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

  // ---- Carrusel Servicios ----
  $('#carrete-servicios').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'ease-in-out',
    dots: true,
    arrows: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    pauseOnDotsHover: false,
    waitForAnimate: false,
    customPaging: function (slider, i) {
      return '<button type="button" aria-label="Ir al servicio ' + (i + 1) + '"></button>';
    }
  });

  // Pausar cuando la pestaña no está visible
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      carrusel.slick('slickPause');
    } else {
      carrusel.slick('slickPlay');
    }
  });

});

// ---- Snap al carrusel de servicios ----
let isSnapping = false;
let lastScrollTop = 0;
window.addEventListener('scroll', function () {
  if (isSnapping) return;
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const isScrollingDown = currentScrollTop > lastScrollTop;
  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  if (!isScrollingDown) return;
  const carruselServicios = document.getElementById('carrete-servicios');
  if (!carruselServicios) return;
  const rect = carruselServicios.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  if (rect.top < windowHeight * 0.15 && rect.top > -windowHeight * 0.15) {
    isSnapping = true;
    carruselServicios.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isSnapping = false; }, 1000);
  }
});

// ---- Botón volver arriba ----
window.addEventListener('scroll', function () {
  const btn = document.getElementById('btn-volver-arriba');
  if (!btn) return;
  btn.classList.toggle('visible', window.pageYOffset > 300);
});

document.getElementById('btn-volver-arriba').addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Filtros Metrajes / Contenido vertical ----
function mostrarContenido(id, boton) {
  document.querySelectorAll('.contenido-trabajo').forEach(s => s.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
  document.querySelectorAll('.filtro-trabajo button').forEach(b => b.classList.remove('activo'));
  boton.classList.add('activo');

  if (id === 'redes' && !tiktoksYaCargados) {
    cargarTikToks();
    tiktoksYaCargados = true;
  }
}

// ---- TikTok carrusel (reproductor embebido, sin miniaturas) ----
const tiktokVideos = [
  'https://www.tiktok.com/@taqueria_andale/video/7571265003542695224',
  'https://www.tiktok.com/@ronilioo/video/7506991432322829574',
  'https://www.tiktok.com/@orbecfilms/video/7556403164396752184',
  'https://www.tiktok.com/@orbecfilms/video/7550498321232661816',
  'https://www.tiktok.com/@oilworks.sv/video/7662478289864297746',
  'https://www.tiktok.com/@oilworks.sv/video/7668365577592884488'
];
let tiktoksYaCargados = false;

function cargarTikToks() {
  const feed = document.getElementById('tiktok-feed');
  if (!feed) return;

  tiktokVideos.forEach(function (url) {
    const card = document.createElement('div');
    card.className = 'tiktok-card abajo';
    card.dataset.videoId = url.split('/video/')[1].split('?')[0];
    feed.appendChild(card);
  });

  iniciarCarruselTikTok();
}

function iniciarCarruselTikTok() {
  const cards = document.querySelectorAll('.tiktok-card');
  if (!cards.length) return;

  let current = 0;

  const btnUp = document.getElementById('tiktok-btn-up');
  const btnDown = document.getElementById('tiktok-btn-down');
  const counter = document.getElementById('tiktok-counter');

  function mostrar(index) {
    cards.forEach(function (c, i) {
      c.classList.remove('activo', 'arriba', 'abajo');
      if (i < index) c.classList.add('arriba');
      else if (i === index) c.classList.add('activo');
      else c.classList.add('abajo');

      const iframe = c.querySelector('iframe');

      if (i === index) {
        if (!iframe) {
          const nuevo = document.createElement('iframe');
          nuevo.src = 'https://www.tiktok.com/embed/v2/' + c.dataset.videoId;
          nuevo.allow = 'autoplay; fullscreen; encrypted-media';
          nuevo.allowFullscreen = true;
          nuevo.setAttribute('scrolling', 'no');
          nuevo.title = 'Video de TikTok';
          c.appendChild(nuevo);
        }
      } else if (iframe) {
        // se quita después de la animación para que no desaparezca de golpe
        setTimeout(function () {
          if (!c.classList.contains('activo')) {
            const f = c.querySelector('iframe');
            if (f) f.remove();
          }
        }, 500);
      }
    });

    if (counter) counter.textContent = (index + 1) + ' / ' + cards.length;
    current = index;
  }

  if (btnDown) btnDown.addEventListener('click', function () {
    mostrar((current + 1) % cards.length);
  });

  if (btnUp) btnUp.addEventListener('click', function () {
    mostrar((current - 1 + cards.length) % cards.length);
  });

  mostrar(0);
}
