"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CART_KEY, type CartItem } from "@/lib/cart-types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  ready: boolean;
  addItem: (sessionId: string, quantity: number) => void;
  updateItem: (sessionId: string, quantity: number) => void;
  removeItem: (sessionId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw) as CartItem[]);
      } catch {
        window.localStorage.removeItem(CART_KEY);
      }
    }
    setReady(true);
  }, []);

  const persist = (next: CartItem[]) => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
    setItems(next);
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem(sessionId, quantity) {
        persist((() => {
          const existing = items.find((item) => item.sessionId === sessionId);
          if (existing) {
            return items.map((item) =>
              item.sessionId === sessionId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          }
          return [...items, { sessionId, quantity }];
        })());
      },
      updateItem(sessionId, quantity) {
        persist(
          items
            .map((item) => (item.sessionId === sessionId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem(sessionId) {
        persist(items.filter((item) => item.sessionId !== sessionId));
      },
      clear() {
        persist([]);
      },
    }),
    [items, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("CartProvider is missing");
  }
  return value;
}
