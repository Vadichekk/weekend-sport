export type CartChild = {
  name: string;
  age: string;
};

export type CartItem = {
  sessionId: string;
  quantity: number;
};

export const CART_KEY = "weekend-cart";
