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
 *  icon          -> "macbook" | "case" | "charger" | "other" (ilustración)
 *  badge         -> texto corto opcional (ej: "Más vendido"), o "" si no aplica
 *                   (si hay originalPrice, se muestra "Oferta" automáticamente)
 *
 * Los textos marcados [EDITAR] son de ejemplo y deben ser reemplazados
 * por KEYBOX IMPORTS con información real antes de publicar.
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
    badge: "",
  },
  {
    id: "cargador-usb-c-86w",
    category: "cargadores",
    name: "Cargador USB-C 86W",
    condition: "Usado",
    specs: "Compatible con MacBook Pro",
    price: 189,
    originalPrice: null,
    availability: "disponible",
    icon: "charger",
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
