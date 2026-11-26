import type { CartItem } from "./types";

export const cart: CartItem[] = [];

export function add(id: CartItem["id"]) {
  const existing = cart.find((p) => p.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
}

export function decrement(id: CartItem["id"]) {
  const existing = cart.find((p) => p.id === id);
  if (!existing) return;
  if (existing.quantity > 1) {
    existing.quantity -= 1;
  } else {
    remove(id);
  }
}

export function remove(id: CartItem["id"]) {
  const index = cart.findIndex((p) => p.id === id);
  if (index !== -1) {
    cart.splice(index, 1);
  }
}

export function clear() {
  cart.length = 0;
}
