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
    let thumbnail = 'imagenes/logo.png';
    let autor = video.url.split('@')[1].split('/')[0];

    try {
    const apiUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(video.url)}`;
const res = await fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(apiUrl));
const info = await res.json();
      thumbnail = info.thumbnail_url;
      autor = info.author_name;
    } catch (e) {
      console.warn('Thumbnail no disponible para:', video.url);
    }

    const card = document.createElement('div');
    card.className = 'tiktok-card abajo';
    card.innerHTML = `
      <a href="${video.url}" target="_blank" rel="noopener">
        <div class="tiktok-thumb">
          <img src="${thumbnail}" alt="Video TikTok"
            onerror="this.src='imagenes/logo.png'">
          <div class="tiktok-overlay">
            <i class="fa-brands fa-tiktok"></i>
            <span>Ver en TikTok</span>
          </div>
          <div class="tiktok-autor">@${autor}</div>
        </div>
      </a>
    `;
    feed.appendChild(card);
  }

  iniciarCarruselTikTok();
}

function iniciarCarruselTikTok() {
  const cards = document.querySelectorAll('.tiktok-card');
  if (!cards.length) return;

  let current = 0;
  let autoTimer = null;

  const wrapper = document.getElementById('tiktok-carousel-wrapper');
  const btnUp = document.getElementById('tiktok-btn-up');
  const btnDown = document.getElementById('tiktok-btn-down');
  const counter = document.getElementById('tiktok-counter');

  function mostrar(index) {
    cards.forEach((c, i) => {
      c.classList.remove('activo', 'arriba', 'abajo');
      if (i < index) c.classList.add('arriba');
      else if (i === index) c.classList.add('activo');
      else c.classList.add('abajo');
    });
    if (counter) counter.textContent = `${index + 1} / ${cards.length}`;
    current = index;
  }

  function siguiente() {
    mostrar((current + 1) % cards.length);
  }

  function anterior() {
    mostrar((current - 1 + cards.length) % cards.length);
  }

  function iniciarAuto() {
    autoTimer = setInterval(siguiente, 6000);
  }

  function pararAuto() {
    clearInterval(autoTimer);
  }

  if (btnDown) btnDown.addEventListener('click', () => { pararAuto(); siguiente(); iniciarAuto(); });
  if (btnUp) btnUp.addEventListener('click', () => { pararAuto(); anterior(); iniciarAuto(); });

  if (wrapper) {
    wrapper.addEventListener('mouseenter', pararAuto);
    wrapper.addEventListener('mouseleave', iniciarAuto);
  }

  mostrar(0);
  iniciarAuto();
}
