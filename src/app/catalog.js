// Todos los comercios, precios, horarios y disponibilidades son ficticios.
// Las fotos son ilustrativas; nunca representan inventario confirmado.
export const categories = [
  { id: "todos", label: "Todo", emoji: "✦" },
  { id: "restaurantes", label: "Restaurantes", emoji: "🍲" },
  { id: "panaderias", label: "Panaderías", emoji: "🥐" },
  { id: "cafeterias", label: "Cafeterías", emoji: "☕" },
];

export const merchants = [
  {
    id: "mesa-verde",
    name: "Mesa Verde",
    category: "restaurantes",
    area: "Zona Cala Cala",
    address: "Zona Cala Cala · ubicación de ejemplo",
    image: "/assets/meal.webp",
    imageAlt: "Porción ilustrativa de arroz, pollo y vegetales",
    pack: "Un almuerzo con otra oportunidad",
    price: 20,
    originalPrice: 40,
    stock: 5,
    pickup: ["19:00", "20:00"],
    hours: "Lunes a sábado · 12:00–20:00",
    description:
      "Comida casera, hecha con cariño. Un pack con porciones del menú del día que aún están en buen estado y no se vendieron.",
    contents: [
      "Una porción de comida preparada",
      "Puede incluir arroz, verduras y una proteína",
      "El contenido exacto depende del excedente del día",
    ],
    allergens: "Puede contener gluten, leche, huevo y soya.",
    tag: "Comida casera",
    color: "sage",
  },
  {
    id: "horno-barrio",
    name: "Horno de Barrio",
    category: "panaderias",
    area: "Zona Queru Queru",
    address: "Zona Queru Queru · ubicación de ejemplo",
    image: "/assets/food-hero.webp",
    imageAlt: "Bolsa ilustrativa con panes dorados y croissants",
    pack: "Una bolsa de felicidad recién horneada",
    price: 15,
    originalPrice: 30,
    stock: 4,
    pickup: ["18:00", "19:00"],
    hours: "Lunes a sábado · 07:00–19:00",
    description:
      "El pan del día merece una mesa, no una bolsa de basura. Descubre una selección sorpresa de panes y bollería del horno.",
    contents: [
      "Una selección de panes o bollería",
      "Puede incluir piezas dulces y saladas",
      "Las cantidades y piezas cambian cada día",
    ],
    allergens: "Contiene gluten. Puede contener leche, huevo y frutos secos.",
    tag: "Recién horneado",
    color: "peach",
  },
  {
    id: "pausa-cafe",
    name: "Pausa Café",
    category: "cafeterias",
    area: "Zona Centro",
    address: "Zona Centro · ubicación de ejemplo",
    image: "/assets/cafe.webp",
    imageAlt: "Caja ilustrativa con torta, un sándwich y pastelería",
    pack: "Tu próxima pausa, con sorpresa",
    price: 18,
    originalPrice: 36,
    stock: 3,
    pickup: ["17:30", "18:30"],
    hours: "Lunes a sábado · 08:00–18:30",
    description:
      "Pequeños antojos que todavía tienen mucho para dar. Rescata una caja con bocados de nuestra vitrina del día.",
    contents: [
      "Pastelería, un sándwich o bocados de vitrina",
      "La selección puede ser dulce o salada",
      "Bebidas no incluidas",
    ],
    allergens: "Puede contener gluten, leche, huevo, soya y frutos secos.",
    tag: "Dulce y salado",
    color: "rose",
  },
];

export const merchantById = (id) =>
  merchants.find((merchant) => merchant.id === id);
export const money = (amount) =>
  `Bs ${Number(amount).toLocaleString("es-BO", { maximumFractionDigits: 2 })}`;
export const pickupLabel = (merchant) =>
  `${merchant.pickup[0]}–${merchant.pickup[1]}`;

export function todayInBolivia(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const read = (type) => parts.find((part) => part.type === type).value;
  return `${read("year")}-${read("month")}-${read("day")}`;
}

export function nextDay(date) {
  return new Date(new Date(`${date}T12:00:00Z`).getTime() + 86400000)
    .toISOString()
    .slice(0, 10);
}

export function dateLabel(date) {
  return new Intl.DateTimeFormat("es-BO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export function remainingStock(merchant, orders, date) {
  return Math.max(
    0,
    merchant.stock -
      orders
        .filter(
          (order) =>
            order.merchantId === merchant.id &&
            order.date === date &&
            order.status !== "cancelled",
        )
        .reduce((sum, order) => sum + order.quantity, 0),
  );
}
