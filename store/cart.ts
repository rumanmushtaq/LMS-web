import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  title: string;
  image?: string;
  price: number; // major units, as stored on Product
  size: string;
  quantity: number;
  sizes?: string[];
}

/** One cart line per product+size: the same shirt in two sizes is two lines. */
function keyOf(productId: string, size: string) {
  return `${productId}::${size}`;
}

interface CartState {
  items: CartLine[];
  add: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  remove: (key: string) => void;
  setQty: (key: string, quantity: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (line) =>
        set((state) => {
          const key = keyOf(line.productId, line.size);
          const existing = state.items.find(
            (i) => keyOf(i.productId, i.size) === key,
          );
          const addQty = line.quantity ?? 1;
          if (existing) {
            return {
              items: state.items.map((i) =>
                keyOf(i.productId, i.size) === key
                  ? { ...i, quantity: i.quantity + addQty }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...line, quantity: addQty }] };
        }),
      remove: (key) =>
        set((state) => ({
          items: state.items.filter((i) => keyOf(i.productId, i.size) !== key),
        })),
      setQty: (key, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              keyOf(i.productId, i.size) === key
                ? { ...i, quantity: Math.max(1, quantity) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "varona-cart" },
  ),
);

export const cartKey = keyOf;
