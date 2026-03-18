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
    dots: false,
    arrows: true,
    prevArrow: '<div class="carousel-prev">&#10094;</div>',
    nextArrow: '<div class="carousel-next">&#10095;</div>',
    waitForAnimate: false
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

// ---- Filtros Metrajes / Micro metrajes ----
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

// ---- TikTok dinámico via oEmbed ----
const tiktokVideos = [
  { url: 'https://www.tiktok.com/@taqueria_andale/video/7571265003542695224' },
  { url: 'https://www.tiktok.com/@ronilioo/video/7506991432322829574' },
  { url: 'https://www.tiktok.com/@orbecfilms/video/7556403164396752184' },
  { url: 'https://www.tiktok.com/@orbecfilms/video/7550498321232661816' }
];

let tiktoksYaCargados = false;

async function cargarTikToks() {
  const feed = document.getElementById('tiktok-feed');
  if (!feed) return;

  for (const video of tiktokVideos) {
    try {
      const proxy = 'https://api.allorigins.win/get?url=';
      const apiUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(video.url)}`;
      const res = await fetch(proxy + encodeURIComponent(apiUrl));
      const data = await res.json();
      const info = JSON.parse(data.contents);

      const card = document.createElement('a');
      card.className = 'tiktok-card';
      card.href = video.url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.innerHTML = `
        <div class="tiktok-thumb">
          <img src="${info.thumbnail_url}" alt="${info.title || 'Video TikTok'}">
          <div class="tiktok-overlay">
            <i class="fa-brands fa-tiktok"></i>
            <span>Ver en TikTok</span>
          </div>
          <div class="tiktok-autor">@${info.author_name}</div>
        </div>
      `;
      feed.appendChild(card);
    } catch (e) {
      console.warn('No se pudo cargar TikTok:', video.url);
    }
  }
}
