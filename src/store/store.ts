import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../../sanity.types";

export interface BasketItem {
  product: Product;
  quantity: number;
}

interface BasketState {
  items: BasketItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearBasket: () => void;
  getTotalPrice: () => string;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => BasketItem[];
}

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [...state.items, { product, quantity: 1 }],
            };
          }
        }),
      removeItem: (productId: string) =>
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.product._id === productId) {
                if (item.quantity > 1) {
                  return { ...item, quantity: item.quantity - 1 };
                }
                return null;
              }
              return item;
            })
            .filter((item): item is BasketItem => item !== null),
        })),
      clearBasket: () => set({ items: [] }),
      getTotalPrice: () => {
        const state = get();
        return state.items
          .reduce((total, item) => {
            const price = item.product.price ?? 0;
            return total + price * item.quantity;
          }, 0)
          .toFixed(2);
      },
      getItemCount: (productId: string) => {
        const state = get();
        const item = state.items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => {
        const state = get();
        return state.items;
      },
    }),
    {
      name: "basket-store",
    }
  )
);

export default useBasketStore;
