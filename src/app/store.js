import {
  merchantById,
  nextDay,
  remainingStock,
  todayInBolivia,
} from "./catalog.js";

export const STORAGE_KEY = "rebocado.demo.v1";
export const emptyState = () => ({ favorites: [], orders: [], name: "" });

export function sanitizeState(raw) {
  if (!raw || typeof raw !== "object") return emptyState();
  const orders = Array.isArray(raw.orders)
    ? raw.orders
        .filter(
          (order) =>
            order &&
            typeof order.id === "string" &&
            typeof order.code === "string" &&
            merchantById(order.merchantId) &&
            /^\d{4}-\d{2}-\d{2}$/.test(order.date) &&
            !Number.isNaN(Date.parse(`${order.date}T12:00:00Z`)) &&
            Number.isInteger(order.quantity) &&
            order.quantity > 0 &&
            order.quantity <= 5 &&
            ["reserved", "collected", "cancelled"].includes(order.status) &&
            ["cash", "qr-demo"].includes(order.method) &&
            ["pending", "simulated"].includes(order.payment),
        )
        .slice(0, 200)
    : [];
  return {
    favorites: [
      ...new Set(
        Array.isArray(raw.favorites)
          ? raw.favorites.filter((id) => merchantById(id))
          : [],
      ),
    ],
    orders,
    name: typeof raw.name === "string" ? raw.name.slice(0, 40) : "",
  };
}

export function loadState(storage) {
  try {
    return sanitizeState(JSON.parse(storage.getItem(STORAGE_KEY)));
  } catch {
    return emptyState();
  }
}

export function createReservation(
  state,
  { merchantId, quantity, date, method, accepted },
  now = new Date(),
) {
  const merchant = merchantById(merchantId);
  const today = todayInBolivia(now);
  if (!merchant || ![today, nextDay(today)].includes(date))
    throw new Error("Elige hoy o mañana para probar la reserva.");
  if (!accepted)
    throw new Error(
      "Confirma el horario de recojo y la información sobre alérgenos.",
    );
  if (!["cash", "qr-demo"].includes(method))
    throw new Error("Selecciona una forma de pago.");
  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > remainingStock(merchant, state.orders, date)
  )
    throw new Error("No quedan suficientes packs para esa cantidad.");
  const id = crypto.randomUUID();
  const order = {
    id,
    code: `RB-${id.replaceAll("-", "").slice(0, 6).toUpperCase()}`,
    merchantId,
    quantity,
    date,
    method,
    payment: method === "qr-demo" ? "simulated" : "pending",
    status: "reserved",
    createdAt: now.toISOString(),
  };
  return { ...state, orders: [order, ...state.orders] };
}

export function changeOrder(state, id, action) {
  return {
    ...state,
    orders: state.orders.map((order) => {
      if (order.id !== id || order.status !== "reserved") return order;
      if (action === "cancel") return { ...order, status: "cancelled" };
      if (action === "pay") return { ...order, payment: "simulated" };
      if (action === "collect" && order.payment === "simulated")
        return { ...order, status: "collected" };
      return order;
    }),
  };
}
