/**
 * KULTRUMM AUDIO LABS — Catálogo
 * app.js
 *
 * ─────────────────────────────────────────────────────────────
 *  CÓMO MIGRAR A JSON EXTERNO (cuando tengas muchos productos):
 *
 *  1. Creá un archivo  data/products.json  con el mismo formato
 *     que el array PRODUCTS de abajo.
 *
 *  2. Reemplazá la llamada  initCatalog(PRODUCTS)  al final por:
 *
 *     fetch('data/products.json')
 *       .then((res) => res.json())
 *       .then((data) => initCatalog(data))
 *       .catch((err) => console.error('Error cargando productos:', err));
 *
 *  El resto del código no necesita cambios.
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ── CONFIGURACIÓN ──────────────────────────────────────────── */
const CONFIG = {
  /** Número de WhatsApp en formato internacional, sin + ni espacios */
  whatsappNumber: '5491135980929',

  /**
   * Mensaje que se pre-rellena al abrir WhatsApp.
   * @param {string} productName - Nombre del producto clickeado
   * @returns {string}
   */
  whatsappMessage: (productName) =>
    `Hola, me interesa consultar sobre el *${productName}*. ¿Me podés dar más información?`,
};

/* ── DATOS DE PRODUCTOS ─────────────────────────────────────── */
/**
 * Cada producto puede tener:
 *   id          {number}  — Identificador único
 *   name        {string}  — Nombre del producto (se usa en el mensaje de WA)
 *   tagline     {string}  — Frase corta / slogan
 *   description {string}  — Descripción breve
 *   category    {string}  — Categoría para el filtro
 *   price       {string}  — Precio o "Consultar"
 *   image       {string|null} — Ruta a la imagen. null = muestra placeholder.
 *                               Ruta recomendada: "assets/images/nombre.jpg"
 *   url         {string|null} — Enlace externo "Ver más"
 */
const PRODUCTS = [
  {
    id: 1,
    name: "KULTRUMM 436C SELK'NAM",
    tagline: 'La naturaleza de lo intangible',
    description:
      'Compresor/limitador de tubo de alta gama, inspirado en el clásico UA 436C. ' +
      'Construido con componentes seleccionados a mano para capturar el carácter único ' +
      'de los preamplificadores de los años 60.',
    category: 'Compresores',
    price: 'Consultar',
    image: null,
    url: 'https://kultrumm.com/kultrumm-436-selk-n-na/',
  },
  {
    id: 2,
    name: 'KULTRUMM 1566A',
    tagline: 'La belleza de lo simple',
    description:
      'Preamplificador valvular de diseño elegante y sonido excepcional. ' +
      'Inspirado en los mejores preamps de tubo de la era dorada del audio, ' +
      'optimizado para salas de grabación modernas.',
    category: 'Preamp',
    price: 'Consultar',
    image: null,
    url: 'https://kultrumm.com/kultrumm-1566a-preamplificador-valvular/',
  },
  {
    id: 3,
    name: 'KULTRUMM 176 MASTERING EDITION',
    tagline: 'La naturaleza de lo intangible II',
    description:
      'Versión especial de mastering del 176 Tube Limiter. Mayor precisión de control, ' +
      'transformadores de mayor calidad y circuitería optimizada para el procesamiento ' +
      'de la mezcla final.',
    category: 'Compresores',
    price: 'Consultar',
    image: null,
    url: 'https://kultrumm.com/kultrumm-176-mastering-edition/',
  },
  {
    id: 4,
    name: 'KULTRUMM 176 TUBE LIMITER',
    tagline: 'Predecesor del reconocido UREI 1176',
    description:
      'Limitador de tubo inspirado en el legendario UA 176. Aporta calidez y carácter ' +
      'analógico a cualquier fuente, con la dinámica característica de los circuitos ' +
      'de los años 50.',
    category: 'Compresores',
    price: 'Consultar',
    image: null,
    url: 'https://kultrumm.com/kultrumm-176-tube-limiter/',
  },
  {
    id: 5,
    name: 'CHANNEL STRIP 1977',
    tagline: 'Preamp discreto con EQ y compresor',
    description:
      'Canal completo en estado sólido con preamplificador discreto, ecualizador ' +
      'pasivo y compresor integrados. La herramienta definitiva para grabar ' +
      'con color y control total.',
    category: 'Channel Strip',
    price: 'Consultar',
    image: null,
    url: 'https://kultrumm.com/kultrumm-channel-strip-1977/',
  },
  {
    id: 6,
    name: 'KULTRUMM 376',
    tagline: 'TAB 376 — El amo del estado sólido',
    description:
      'Revisión del mítico TAB 376, el preamplificador de estado sólido que definió ' +
      'el sonido de innumerables grabaciones clásicas. Potencia, transparencia y ' +
      'presencia inigualables.',
    category: 'Preamp',
    price: 'Consultar',
    image: null,
    url: 'https://kultrumm.com/kultrumm-v376/',
  },
  {
    id: 7,
    name: 'KULTRUMM EQ 295',
    tagline: 'El Siemens 295 volviendo al futuro',
    description:
      'Ecualizador pasivo basado en el legendario Siemens W295. Un EQ con ' +
      'transformadores de salida que moldea el sonido con una musicalidad ' +
      'difícil de conseguir en el mundo digital.',
    category: 'Ecualizadores',
    price: 'Consultar',
    image: null,
    url: 'https://kultrumm.com/kultrumm-w295-eq/',
  },
  {
    id: 8,
    name: 'COMPONENTES CUSTOM',
    tagline: 'Transformadores custom · Válvulas NOS',
    description:
      'Transformadores bobinados a medida y válvulas NOS (New Old Stock) seleccionadas. ' +
      'Para técnicos y constructores que buscan los mejores componentes para sus ' +
      'proyectos de audio vintage.',
    category: 'Componentes',
    price: 'Consultar',
    image: null,
    url: 'https://kultrumm.com/kultrumm-componentes/',
  },
];

/* ── ESTADO REACTIVO ────────────────────────────────────────── */
const state = {
  activeCategory: 'Todos',
  searchQuery: '',
};

/* ── REFERENCIAS AL DOM ─────────────────────────────────────── */
const grid      = document.getElementById('products-grid');
const noResults = document.getElementById('no-results');
const filterNav = document.getElementById('filter-tabs');
const searchEl  = document.getElementById('search-input');
const footerYear = document.getElementById('footer-year');

/* ── UTILIDADES ─────────────────────────────────────────────── */

/**
 * Escapa texto para usarlo dentro de innerHTML sin riesgo de XSS.
 * @param {string} str
 * @returns {string}
 */
function sanitize(str) {
  const el = document.createElement('div');
  el.textContent = String(str);
  return el.innerHTML;
}

/**
 * Valida una URL y devuelve '#' si el protocolo no es seguro.
 * Previene inyecciones con esquemas  javascript:  o  data:
 * @param {string} url
 * @returns {string}
 */
function sanitizeURL(url) {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) return '#';
    return parsed.href;
  } catch {
    return '#';
  }
}

/**
 * Genera la URL de WhatsApp con el mensaje pre-armado.
 * @param {string} productName
 * @returns {string}
 */
function buildWhatsAppURL(productName) {
  const message = CONFIG.whatsappMessage(productName);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Extrae todas las categorías únicas de los productos y agrega "Todos" al inicio.
 * @param {Array} products
 * @returns {string[]}
 */
function getCategories(products) {
  return ['Todos', ...new Set(products.map((p) => p.category))];
}

/* ── RENDER: TARJETA ────────────────────────────────────────── */

/** SVG del ícono de WhatsApp (reutilizable) */
const WA_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
</svg>`;

/**
 * Crea y devuelve un elemento <article> con la tarjeta del producto.
 * @param {Object} product
 * @returns {HTMLElement}
 */
function renderCard(product) {
  const waURL = buildWhatsAppURL(product.name);

  // Imagen: si existe la ruta, renderiza el <img> encima del placeholder.
  // El placeholder siempre está visible como fondo hasta que la foto cargue.
  const imageTag = product.image
    ? `<img
        class="card__image"
        src="${sanitizeURL(product.image)}"
        alt="Foto del producto ${sanitize(product.name)}"
        loading="lazy"
        width="400"
        height="300"
      />`
    : '';

  // Enlace externo opcional
  const moreLink = product.url
    ? `<a
        href="${sanitizeURL(product.url)}"
        class="card__more-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ver más sobre ${sanitize(product.name)}"
      >Ver detalles ↗</a>`
    : '';

  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.category = product.category;
  // Normalizado para la búsqueda
  card.dataset.search = [product.name, product.description, product.tagline]
    .join(' ')
    .toLowerCase();

  card.innerHTML = `
    <div class="card__image-wrapper">
      <span class="card__image-placeholder" aria-hidden="true">
        ${sanitize(product.name.charAt(0))}
      </span>
      ${imageTag}
      <span class="card__badge">${sanitize(product.category)}</span>
    </div>
    <div class="card__body">
      <h2 class="card__title">${sanitize(product.name)}</h2>
      <p class="card__tagline">${sanitize(product.tagline)}</p>
      <p class="card__description">${sanitize(product.description)}</p>
      <div class="card__divider"></div>
      <div class="card__meta">
        <span class="card__price">${sanitize(product.price)}</span>
        ${moreLink}
      </div>
      <a
        href="${waURL}"
        class="btn-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar por ${sanitize(product.name)} vía WhatsApp"
      >
        ${WA_ICON_SVG}
        Consultar por WhatsApp
      </a>
    </div>
  `;

  return card;
}

/* ── RENDER: FILTROS ────────────────────────────────────────── */

/**
 * Renderiza los botones de categoría en el nav de filtros.
 * @param {string[]} categories
 */
function renderFilters(categories) {
  filterNav.innerHTML = '';

  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn' + (cat === state.activeCategory ? ' active' : '');
    btn.textContent = cat;
    btn.setAttribute('role', 'tab');
    btn.setAttribute(
      'aria-selected',
      cat === state.activeCategory ? 'true' : 'false'
    );

    btn.addEventListener('click', () => {
      state.activeCategory = cat;
      renderFilters(categories);
      renderGrid(PRODUCTS);
    });

    filterNav.appendChild(btn);
  });
}

/* ── RENDER: GRILLA ─────────────────────────────────────────── */

/**
 * Filtra los productos según el estado actual (categoría + búsqueda)
 * y los renderiza en la grilla.
 * @param {Array} products
 */
function renderGrid(products) {
  const query = state.searchQuery.trim().toLowerCase();

  const filtered = products.filter((p) => {
    const inCategory =
      state.activeCategory === 'Todos' || p.category === state.activeCategory;

    const inSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tagline.toLowerCase().includes(query);

    return inCategory && inSearch;
  });

  // Limpiar grilla
  grid.innerHTML = '';

  if (filtered.length === 0) {
    noResults.hidden = false;
    return;
  }

  noResults.hidden = true;
  filtered.forEach((product) => grid.appendChild(renderCard(product)));
}

/* ── BÚSQUEDA ───────────────────────────────────────────────── */
searchEl.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  renderGrid(PRODUCTS);
});

/* ── AÑO DINÁMICO EN FOOTER ─────────────────────────────────── */
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

/* ── INICIALIZACIÓN ─────────────────────────────────────────── */

/* ── HAMBURGER + NAV MÓVIL ──────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const mainNav   = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Abrir menú de navegación' : 'Cerrar menú de navegación'
    );
    mainNav.classList.toggle('main-nav--open', !isOpen);
  });

  // Cerrar al hacer clic en un enlace (UX móvil)
  mainNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      mainNav.classList.remove('main-nav--open');
    });
  });

  // Cerrar al hacer clic fuera del nav
  document.addEventListener('click', (e) => {
    if (
      mainNav.classList.contains('main-nav--open') &&
      !mainNav.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      mainNav.classList.remove('main-nav--open');
    }
  });
}

/* ── NAV SCROLL SPY ─────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

function updateActiveNavLink() {
  const scrollY = window.scrollY + 100;
  let current = null;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section && section.offsetTop <= scrollY) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      'active',
      link.getAttribute('href').slice(1) === current
    );
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink();

/* ── POBLAR SELECT DE PRODUCTOS EN EL FORMULARIO ─────────────── */
function populateProductSelect(products) {
  const select = document.getElementById('form-product');
  if (!select) return;

  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.name;
    option.textContent = product.name;
    select.appendChild(option);
  });
}

/* ── FORMULARIO DE CONTACTO ─────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const errorEl = document.getElementById('form-error');
  if (!form || !errorEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.elements['name'].value.trim();
    const email   = form.elements['email'].value.trim();
    const product = form.elements['product'].value.trim();
    const message = form.elements['message'].value.trim();

    // Limpiar estado anterior
    errorEl.hidden = true;
    form.querySelectorAll('.is-invalid').forEach((el) =>
      el.classList.remove('is-invalid')
    );

    // Validación básica en cliente
    let firstInvalid = null;

    if (!name) {
      form.elements['name'].classList.add('is-invalid');
      firstInvalid = firstInvalid || form.elements['name'];
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.elements['email'].classList.add('is-invalid');
      firstInvalid = firstInvalid || form.elements['email'];
    }

    if (!message) {
      form.elements['message'].classList.add('is-invalid');
      firstInvalid = firstInvalid || form.elements['message'];
    }

    if (firstInvalid) {
      errorEl.textContent =
        'Por favor, completá los campos obligatorios correctamente.';
      errorEl.hidden = false;
      firstInvalid.focus();
      return;
    }

    // Construir mensaje de WhatsApp a partir del formulario
    const productLine = product ? `*Equipo:* ${product}\n` : '';
    const waMessage =
      `Hola, me comunico desde el catálogo web.\n\n` +
      `*Nombre:* ${name}\n` +
      `*Email:* ${email}\n` +
      `${productLine}` +
      `*Mensaje:* ${message}`;

    const waURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
    window.open(waURL, '_blank', 'noopener,noreferrer');
  });
}

/**
 * Punto de entrada principal.
 * Recibe el array de productos (o el resultado de un fetch a JSON).
 * @param {Array} products
 */
function initCatalog(products) {
  const categories = getCategories(products);
  renderFilters(categories);
  renderGrid(products);
  populateProductSelect(products);
  initContactForm();
}

initCatalog(PRODUCTS);
