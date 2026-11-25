/*
 * CATÁLOGO DE PRODUCTOS — KEYBOX IMPORTS
 * ---------------------------------------------------------
 * Edita este archivo para agregar, quitar o actualizar productos.
 * Cada producto es un objeto dentro de la lista PRODUCTS.
 *
 * Campos:
 *  id          -> identificador único (texto, sin espacios)
 *  category    -> "macbooks" | "fundas" | "cargadores" | "otros"
 *  name        -> nombre del producto
 *  condition   -> "Nuevo" | "Usado"
 *  specs       -> especificaciones principales (texto corto)
 *  price       -> número en soles (ej: 1850) o null si aún no hay precio
 *  availability-> "disponible" | "pocas" | "consultar"
 *  icon        -> "macbook" | "case" | "charger" | "other" (ilustración)
 *  badge       -> texto corto opcional (ej: "Más vendido"), o "" si no aplica
 *
 * TODOS los textos marcados [EDITAR] son de ejemplo y deben ser
 * reemplazados por KEYBOX IMPORTS con información real antes de publicar.
 */

const PRODUCTS = [
  {
    id: "macbook-air-m1",
    category: "macbooks",
    name: "MacBook Air M1",
    condition: "Usado",
    specs: "13\" · 8GB RAM · 256GB SSD — [EDITAR: confirmar specs reales]",
    price: null,
    availability: "consultar",
    icon: "macbook",
    badge: "",
  },
  {
    id: "macbook-pro-m2",
    category: "macbooks",
    name: "MacBook Pro M2",
    condition: "Usado",
    specs: "13\" · 8GB RAM · 512GB SSD — [EDITAR: confirmar specs reales]",
    price: null,
    availability: "pocas",
    icon: "macbook",
    badge: "Pocas unidades",
  },
  {
    id: "macbook-pro-14-m3",
    category: "macbooks",
    name: "MacBook Pro 14\" M3",
    condition: "Usado",
    specs: "14\" · 16GB RAM · 512GB SSD — [EDITAR: confirmar specs reales]",
    price: null,
    availability: "consultar",
    icon: "macbook",
    badge: "",
  },
  {
    id: "funda-macbook-air-13",
    category: "fundas",
    name: "Funda protectora MacBook Air 13\"",
    condition: "Nuevo",
    specs: "Compatible con MacBook Air 13\" · Varios colores — [EDITAR]",
    price: null,
    availability: "disponible",
    icon: "case",
    badge: "",
  },
  {
    id: "funda-macbook-pro-14",
    category: "fundas",
    name: "Funda protectora MacBook Pro 14\"",
    condition: "Nuevo",
    specs: "Compatible con MacBook Pro 14\" · Varios colores — [EDITAR]",
    price: null,
    availability: "disponible",
    icon: "case",
    badge: "",
  },
  {
    id: "cargador-usb-c-61w",
    category: "cargadores",
    name: "Cargador USB-C 61W",
    condition: "Usado",
    specs: "Compatible con MacBook Air / Pro — [EDITAR: confirmar modelo]",
    price: null,
    availability: "disponible",
    icon: "charger",
    badge: "",
  },
  {
    id: "cargador-usb-c-96w",
    category: "cargadores",
    name: "Cargador USB-C 96W",
    condition: "Usado",
    specs: "Compatible con MacBook Pro — [EDITAR: confirmar modelo]",
    price: null,
    availability: "consultar",
    icon: "charger",
    badge: "",
  },
  {
    id: "otro-producto-ejemplo",
    category: "otros",
    name: "[EDITAR: nombre del producto]",
    condition: "Nuevo",
    specs: "[EDITAR: especificaciones principales]",
    price: null,
    availability: "consultar",
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
