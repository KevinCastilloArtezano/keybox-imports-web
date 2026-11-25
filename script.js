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
      background: "#0b0d10",
      interval: 3.4,
      step: 2,
      onFront: updateCarouselInfo,
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

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupFilters();
  setupMobileMenu();
  setupWhatsappLinks();
  document.getElementById("year").textContent = new Date().getFullYear();
});
