/* KEYBOX IMPORTS — lógica de interfaz */

const WHATSAPP_NUMBER = "51967777077"; // +51 967 777 077

function waLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

const PRODUCT_ICONS = {
  macbook: `<svg viewBox="0 0 24 24" fill="none" stroke="#0b0d10" stroke-width="1.6"><path d="M4 5h16v10H4z"/><path d="M2 18h20l-2 2H4z" fill="#0b0d10" stroke="none"/></svg>`,
  case: `<svg viewBox="0 0 24 24" fill="#0b0d10"><rect x="5" y="3" width="14" height="18" rx="2"/></svg>`,
  charger: `<svg viewBox="0 0 24 24" fill="#0b0d10"><rect x="7" y="2" width="10" height="14" rx="2"/><rect x="10" y="16" width="4" height="6"/></svg>`,
  other: `<svg viewBox="0 0 24 24" fill="#0b0d10"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>`,
};

function formatPrice(price) {
  if (price === null || price === undefined) return null;
  return `S/ ${price.toLocaleString("es-PE")}`;
}

function productCard(product) {
  const priceText = formatPrice(product.price);
  const waMessage = `Hola, vi "${product.name}" en la web de KEYBOX IMPORTS. ¿Podrían confirmarme si está disponible?`;
  const originalPriceText = formatPrice(product.originalPrice);
  const badgeText = product.badge || (originalPriceText ? "Oferta" : "");

  return `
    <article class="product-card" data-category="${product.category}">
      <div class="product-media">
        <span class="badge ${product.condition === "Nuevo" ? "badge-new" : "badge-used"}">${product.condition}</span>
        ${badgeText ? `<span class="badge-tag">${badgeText}</span>` : ""}
        ${PRODUCT_ICONS[product.icon] || PRODUCT_ICONS.other}
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="product-specs">${product.specs}</p>
        <div class="product-meta">
          <span class="price-group">
            ${originalPriceText ? `<span class="product-price-original">${originalPriceText}</span>` : ""}
            ${priceText
              ? `<span class="product-price">${priceText}</span>`
              : `<span class="product-price muted">Consultar precio</span>`}
          </span>
          <span class="availability av-${product.availability}">${AVAILABILITY_LABELS[product.availability]}</span>
        </div>
        <a class="btn btn-whatsapp" href="${waLink(waMessage)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 32 32" class="icon-wa" aria-hidden="true"><path d="M16.001 3C9.1 3 3.5 8.6 3.5 15.5c0 2.4.65 4.65 1.9 6.6L3 29l7.1-2.35A12.4 12.4 0 0 0 16 28.5c6.9 0 12.5-5.6 12.5-12.5S22.9 3 16 3Zm0 22.6c-2.05 0-4-.55-5.7-1.6l-.4-.25-4.2 1.4 1.4-4.1-.25-.4a10.3 10.3 0 0 1-1.6-5.5C5.3 9.7 10.2 4.8 16 4.8c5.8 0 10.5 4.9 10.5 10.7S21.8 25.6 16 25.6Zm5.95-7.95c-.3-.15-1.8-.9-2.1-1-.3-.1-.5-.15-.7.15-.2.3-.8 1-1 1.2-.2.2-.35.25-.65.1-.9-.45-1.85-1-2.65-1.75-.7-.65-1.2-1.4-1.6-2.1-.15-.3 0-.45.15-.6.15-.15.35-.4.5-.6.15-.2.2-.35.3-.55.1-.2.05-.4-.05-.55-.1-.15-.65-1.55-.9-2.1-.2-.5-.4-.45-.6-.45-.15 0-.4 0-.6.05-.2.05-.5.15-.75.45-.3.35-1.1 1.1-1.1 2.65 0 1.55 1.1 3.05 1.3 3.3.2.25 2.1 3.2 5.1 4.35 2.5 1 2.5.7 2.95.65.45-.05 1.8-.75 2.05-1.45.25-.7.25-1.3.2-1.45-.05-.15-.25-.25-.55-.4Z"/></svg>
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  `;
}

function renderProducts(filter = "all") {
  const grid = document.getElementById("product-grid");
  const items = PRODUCTS.filter((p) => filter === "all" || p.category === filter);
  grid.innerHTML = items.map(productCard).join("");
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

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupFilters();
  setupMobileMenu();
  setupWhatsappLinks();
  document.getElementById("year").textContent = new Date().getFullYear();
});
