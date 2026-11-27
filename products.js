/*
 * CATÁLOGO DE PRODUCTOS — KEYBOX IMPORTS
 * ---------------------------------------------------------
 * Edita este archivo para agregar, quitar o actualizar productos.
 * Cada producto es un objeto dentro de la lista PRODUCTS.
 *
 * Campos:
 *  id            -> identificador único (texto, sin espacios)
 *  category      -> "macbooks" | "fundas" | "cargadores" | "otros"
 *  name          -> nombre del producto
 *  condition     -> "Nuevo" | "Usado"
 *  specs         -> especificaciones principales (texto corto)
 *  price         -> precio actual en soles (número) o null si aún no hay precio
 *  originalPrice -> precio anterior en soles (número) si está en oferta, o null
 *  availability  -> "disponible" | "pocas" | "consultar"
 *  icon          -> "macbook" | "case" | "charger" | "other" (ilustración de respaldo)
 *  badge         -> texto corto opcional (ej: "Más vendido"), o "" si no aplica
 *                   (si hay originalPrice, se muestra "Oferta" automáticamente)
 *  photos        -> lista de rutas a FOTOS REALES del equipo, en el orden en que se
 *                   deben mostrar (ej: ["assets/products/macbook-pro-2020-13-1.jpg", ...]).
 *                   Lista vacía [] si todavía no hay fotos (se muestra un ícono de respaldo).
 *                   Para agregar fotos: coloca los archivos dentro de assets/products/
 *                   y lista aquí sus rutas en el orden deseado. Con 2 o más fotos se
 *                   muestra una galería (miniaturas + flechas) al abrir el detalle.
 *
 * Los textos marcados [EDITAR] son de ejemplo y deben ser reemplazados
 * por KEYBOX IMPORTS con información real antes de publicar.
 *
 * ---------------------------------------------------------
 * PLANTILLA EN BLANCO — para agregar un producto nuevo:
 * 1) Copia desde la llave { de abajo hasta la llave } (incluida la coma final).
 * 2) Pégala dentro de la lista PRODUCTS, antes del ]; que la cierra.
 * 3) Rellena cada campo reemplazando el texto en MAYÚSCULAS.
 * 4) Si no tienes fotos todavía, deja photos: [] (vacío).
 *
 *   {
 *     id: "ID-UNICO-SIN-ESPACIOS",
 *     category: "macbooks", // o "fundas" | "cargadores" | "otros"
 *     name: "NOMBRE DEL PRODUCTO",
 *     condition: "Usado", // o "Nuevo"
 *     specs: "ESPECIFICACIONES PRINCIPALES",
 *     price: 0, // número en soles, o null si aún no hay precio
 *     originalPrice: null, // número si está en oferta, o null
 *     availability: "disponible", // o "pocas" | "consultar"
 *     icon: "macbook", // o "case" | "charger" | "other"
 *     photos: [
 *       "assets/products/NOMBRE-DE-LA-FOTO-1.webp",
 *       "assets/products/NOMBRE-DE-LA-FOTO-2.webp",
 *     ],
 *     badge: "",
 *   },
 * ---------------------------------------------------------
 */

const PRODUCTS = [
  {
    id: "macbook-pro-2020-13",
    category: "macbooks",
    name: "MacBook Pro 2020 13\"",
    condition: "Usado",
    specs: "13\" · Core i7 · 16GB RAM · 512GB SSD",
    price: 2199,
    originalPrice: 2999,
    availability: "disponible",
    icon: "macbook",
    photos: [
      "assets/products/macbook-pro-2020-13-1.webp",
      "assets/products/macbook-pro-2020-13-2.webp",
      "assets/products/macbook-pro-2020-13-3.webp",
      "assets/products/macbook-pro-2020-13-4.webp",
      "assets/products/macbook-pro-2020-13-5.webp",
      "assets/products/macbook-pro-2020-13-6.webp",
    ],
    badge: "",
  },
  {
    id: "macbook-pro-2019-16",
    category: "macbooks",
    name: "MacBook Pro 2019 16\"",
    condition: "Usado",
    specs: "16\" · Core i7 · 16GB RAM · 512GB SSD",
    price: 2099,
    originalPrice: 2899,
    availability: "disponible",
    icon: "macbook",
    photos: [
      "assets/products/macbook-pro-2019-16-1.webp",
      "assets/products/macbook-pro-2019-16-2.webp",
      "assets/products/macbook-pro-2019-16-3.webp",
      "assets/products/macbook-pro-2019-16-4.webp",
      "assets/products/macbook-pro-2019-16-5.webp",
      "assets/products/macbook-pro-2019-16-6.webp",
      "assets/products/macbook-pro-2019-16-7.webp",
    ],
    badge: "",
  },
  {
    id: "macbook-air-2017",
    category: "macbooks",
    name: "MacBook Air 2017",
    condition: "Usado",
    specs: "13\" · Core i5 · 8GB RAM · 128GB SSD",
    price: 749,
    originalPrice: 999,
    availability: "disponible",
    icon: "macbook",
    photos: [
      "assets/products/macbook-air-2017-1.webp",
      "assets/products/macbook-air-2017-2.webp",
      "assets/products/macbook-air-2017-3.webp",
      "assets/products/macbook-air-2017-4.webp",
      "assets/products/macbook-air-2017-5.webp",
    ],
    badge: "",
  },
  {
    id: "funda-macbook-pro-13",
    category: "fundas",
    name: "Funda protectora MacBook Pro 13\"",
    condition: "Nuevo",
    specs: "Compatible con MacBook Pro 13\"",
    price: 40,
    originalPrice: null,
    availability: "disponible",
    icon: "case",
    photos: [
      "assets/products/funda-macbook-pro-13-1.webp",
      "assets/products/funda-macbook-pro-13-2.webp",
      "assets/products/funda-macbook-pro-13-3.webp",
      "assets/products/funda-macbook-pro-13-4.webp",
    ],
    badge: "",
  },
  {
    id: "funda-macbook-pro-15",
    category: "fundas",
    name: "Funda protectora MacBook Pro 15\"",
    condition: "Nuevo",
    specs: "Compatible con MacBook Pro 15\"",
    price: 50,
    originalPrice: null,
    availability: "disponible",
    icon: "case",
    photos: [
      "assets/products/funda-macbook-pro-15-1.webp",
      "assets/products/funda-macbook-pro-15-2.webp",
      "assets/products/funda-macbook-pro-15-3.webp",
      "assets/products/funda-macbook-pro-15-4.webp",
    ],
    badge: "",
  },
  {
    id: "cargador-usb-c-61w",
    category: "cargadores",
    name: "Cargador USB-C 61W",
    condition: "Usado",
    specs: "Compatible con MacBook Air / Pro",
    price: 169,
    originalPrice: null,
    availability: "disponible",
    icon: "charger",
    photos: [
      "assets/products/cargador-usb-c-61w-1.webp",
      "assets/products/cargador-usb-c-61w-2.webp",
      "assets/products/cargador-usb-c-61w-3.webp",
      "assets/products/cargador-usb-c-61w-4.webp",
      "assets/products/cargador-usb-c-61w-5.webp",
    ],
    badge: "",
  },
  {
    id: "cargador-usb-c-87w",
    category: "cargadores",
    name: "Cargador USB-C 87W",
    condition: "Usado",
    specs: "Compatible con MacBook Pro",
    price: 189,
    originalPrice: null,
    availability: "disponible",
    icon: "charger",
    photos: [
      "assets/products/cargador-usb-c-87w-1.webp",
      "assets/products/cargador-usb-c-87w-2.webp",
      "assets/products/cargador-usb-c-87w-3.webp",
    ],
    badge: "",
  },
  {
    id: "teclado-apple",
    category: "otros",
    name: "Apple Magic Keyboard",
    condition: "Usado", // [EDITAR: confirmar si es nuevo o usado]
    specs: "Modelo A1644",
    price: 199,
    originalPrice: 399,
    availability: "disponible",
    icon: "other",
    photos: [
      "assets/products/teclado-apple-1.webp",
      "assets/products/teclado-apple-2.webp",
    ],
    badge: "",
  },
];

const CATEGORY_LABELS = {
  macbooks: "MacBooks usadas",
  fundas: "Fundas nuevas",
  cargadores: "Cargadores usados",
  otros: "Otros productos",
};

const AVAILABILITY_LABELS = {
  disponible: "Disponible",
  pocas: "Pocas unidades",
  consultar: "Consultar stock",
};
