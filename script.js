/* KEYBOX IMPORTS — lógica de interfaz */

const WHATSAPP_NUMBER = "51993807070"; // +51 993 807 070

function waLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function formatPrice(price) {
  if (price === null || price === undefined) return null;
  return `S/ ${price.toLocaleString("es-PE")}`;
}

function waMessageFor(product) {
  return `Hola, vi "${product.name}" en la web de KEYBOX IMPORTS. ¿Podrían confirmarme si está disponible?`;
}

function renderAccessibleList(items) {
  const list = document.getElementById("product-list-sr");
  list.innerHTML = items
    .map((p) => {
      const price = formatPrice(p.price) || "Consultar precio";
      return `<li>${p.name} — ${p.condition} — ${p.specs} — ${price} — ${AVAILABILITY_LABELS[p.availability]}</li>`;
    })
    .join("");
}

let carousel = null;

function updateCarouselInfo(product) {
  if (!product) return;
  document.getElementById("carousel-name").textContent = product.name;
  const price = formatPrice(product.price) || "Consultar precio";
  document.getElementById("carousel-specs").textContent = `${product.specs} · ${price}`;
  const wa = document.getElementById("carousel-wa");
  wa.href = waLink(waMessageFor(product));
}

function renderProducts(filter = "all") {
  const items = PRODUCTS.filter((p) => filter === "all" || p.category === filter);
  renderAccessibleList(items);
  if (!carousel) {
    const mount = document.getElementById("product-carousel");
    carousel = new ProductWarpCarousel(mount, {
      background: "#121826",
      interval: 3.4,
      step: 2,
      onFront: updateCarouselInfo,
      onFrontClick: (product) => {
        if (Array.isArray(product.photos) && product.photos.length) {
          openPhotoLightbox(product.photos, 0);
        }
      },
    });
    document.getElementById("carousel-prev").addEventListener("click", () => carousel.goTo(-1));
    document.getElementById("carousel-next").addEventListener("click", () => carousel.goTo(1));
  }
  carousel.setCards(items);
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderProducts(btn.dataset.filter);
    });
  });
}

function setupMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-mobile");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function setupWhatsappLinks() {
  document.querySelectorAll(".wa-link").forEach((el) => {
    el.href = waLink(el.dataset.waMessage || "Hola, quisiera más información sobre los productos de KEYBOX IMPORTS.");
  });
  const header = document.getElementById("header-whatsapp");
  if (header) header.href = waLink("Hola, quisiera más información sobre los productos de KEYBOX IMPORTS.");
}

function setupHeroParallax() {
  const visual = document.getElementById("heroVisual");
  const devices = [
    { el: document.getElementById("heroDeviceAir"), mx: -14, my: -10 },
    { el: document.getElementById("heroDevicePro"), mx: 18, my: 12 },
    { el: document.getElementById("heroDeviceIpadPro"), mx: 24, my: -16 },
    { el: document.getElementById("heroDeviceIpadMini"), mx: -22, my: 14 },
    { el: document.getElementById("heroDeviceAirpodsMax"), mx: 14, my: -18 },
    { el: document.getElementById("heroDevicePhone"), mx: -16, my: 10 },
    { el: document.getElementById("heroDeviceAirpodsPro"), mx: 20, my: 16 },
    { el: document.getElementById("heroDeviceKeyboard"), mx: -18, my: 12 },
  ].filter((d) => d.el);
  if (!visual || !devices.length) return;
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduced || !canHover) return;

  visual.addEventListener("pointermove", (e) => {
    const r = visual.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    devices.forEach((d) => {
      d.el.style.transform = `translate(${px * d.mx}px, ${py * d.my}px)`;
    });
  });
  visual.addEventListener("pointerleave", () => {
    devices.forEach((d) => {
      d.el.style.transform = "";
    });
  });
}

const MODAL_FALLBACK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v10H4z"/><path d="M2 18h20l-2 2H4z" fill="currentColor" stroke="none"/></svg>`;

function macbooksModalItem(product) {
  const price = formatPrice(product.price);
  const hasPhotos = Array.isArray(product.photos) && product.photos.length > 0;
  const photo = hasPhotos
    ? `<img src="${product.photos[0]}" alt="${product.name}" loading="lazy">`
    : MODAL_FALLBACK_ICON;
  return `
    <article class="modal-item">
      <div class="modal-item-photo${hasPhotos ? " has-photo" : ""}" ${hasPhotos ? `data-product-id="${product.id}"` : ""}>${photo}</div>
      <div class="modal-item-info">
        <h4>${product.name}</h4>
        <p class="modal-item-specs">${product.specs}</p>
        <div class="modal-item-meta">
          <span class="modal-badge ${product.condition === "Nuevo" ? "is-new" : "is-used"}">${product.condition}</span>
          ${price
            ? `<span class="modal-item-price">${price}</span>`
            : `<span class="modal-item-price muted">Consultar precio</span>`}
          <span class="modal-availability is-${product.availability}">${AVAILABILITY_LABELS[product.availability]}</span>
        </div>
      </div>
      <div class="modal-item-action">
        <a class="btn btn-whatsapp" href="${waLink(waMessageFor(product))}" target="_blank" rel="noopener">Consultar</a>
      </div>
    </article>
  `;
}

function renderProductModal(modalId, bodyId, filterFn) {
  const body = document.getElementById(bodyId);
  const items = PRODUCTS.filter(filterFn);
  body.innerHTML = items.length
    ? items.map(macbooksModalItem).join("")
    : `<p class="modal-empty">Aún no hay equipos cargados en esta categoría.</p>`;
}

function setupProductModal({ modalId, closeId, bodyId, triggerClass, filterFn }) {
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeId);
  if (!modal || !closeBtn) return;

  const open = () => {
    renderProductModal(modalId, bodyId, filterFn);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };
  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(`.${triggerClass}`).forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const nav = document.getElementById("nav-mobile");
      const toggle = document.getElementById("menu-toggle");
      if (nav && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
      open();
    });
  });

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.getElementById(bodyId).addEventListener("click", (e) => {
    const photoEl = e.target.closest(".modal-item-photo[data-product-id]");
    if (!photoEl) return;
    const product = PRODUCTS.find((p) => p.id === photoEl.dataset.productId);
    if (product && Array.isArray(product.photos) && product.photos.length) {
      openPhotoLightbox(product.photos, 0);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
}

function setupMacbooksModal() {
  setupProductModal({
    modalId: "macbooksModal",
    closeId: "macbooksModalClose",
    bodyId: "macbooksModalBody",
    triggerClass: "js-open-macbooks",
    filterFn: (p) => p.category === "macbooks",
  });
}

function setupOtrosModal() {
  setupProductModal({
    modalId: "otrosModal",
    closeId: "otrosModalClose",
    bodyId: "otrosModalBody",
    triggerClass: "js-open-otros",
    filterFn: (p) => p.category !== "macbooks",
  });
}

let lightboxPhotos = [];
let lightboxIndex = 0;

function renderLightbox() {
  const img = document.getElementById("lightboxImage");
  const counter = document.getElementById("lightboxCounter");
  const thumbs = document.getElementById("lightboxThumbs");
  img.src = lightboxPhotos[lightboxIndex];
  counter.textContent = `${lightboxIndex + 1} / ${lightboxPhotos.length}`;
  thumbs.innerHTML = lightboxPhotos
    .map(
      (src, i) =>
        `<button class="lightbox-thumb${i === lightboxIndex ? " is-active" : ""}" data-index="${i}" aria-label="Ver foto ${i + 1}"><img src="${src}" alt=""></button>`
    )
    .join("");
}

function openPhotoLightbox(photos, startIndex) {
  lightboxPhotos = photos;
  lightboxIndex = startIndex || 0;
  renderLightbox();
  const lightbox = document.getElementById("photoLightbox");
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closePhotoLightbox() {
  document.getElementById("photoLightbox").hidden = true;
  document.body.style.overflow = "";
}

function setupPhotoLightbox() {
  const lightbox = document.getElementById("photoLightbox");
  if (!lightbox) return;
  const step = (delta) => {
    lightboxIndex = (lightboxIndex + delta + lightboxPhotos.length) % lightboxPhotos.length;
    renderLightbox();
  };
  document.getElementById("lightboxClose").addEventListener("click", closePhotoLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => step(-1));
  document.getElementById("lightboxNext").addEventListener("click", () => step(1));
  document.getElementById("lightboxThumbs").addEventListener("click", (e) => {
    const thumb = e.target.closest(".lightbox-thumb");
    if (!thumb) return;
    lightboxIndex = Number(thumb.dataset.index);
    renderLightbox();
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closePhotoLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closePhotoLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupFilters();
  setupMobileMenu();
  setupWhatsappLinks();
  setupHeroParallax();
  setupMacbooksModal();
  setupOtrosModal();
  setupPhotoLightbox();
  document.getElementById("year").textContent = new Date().getFullYear();
});
