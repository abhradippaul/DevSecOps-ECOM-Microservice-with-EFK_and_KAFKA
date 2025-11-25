import { CartStoreActionsType, CartStoreStateType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const isExist = state.cart.findIndex(
            ({ id, selectedSize, selectedColor }) =>
              id === product.id &&
              selectedSize === product.selectedSize &&
              selectedColor === product.selectedColor
          );

          if (isExist) {
            const updatedCart = [...state.cart];
            updatedCart[isExist].quantity += product.quantity || 1;
            return { cart: updatedCart };
          } else {
            return { cart: [...state.cart, product] };
          }
        }),
      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter(({ id }) => id !== product.id),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: "cart", storage: createJSONStorage(() => localStorage) }
  )
);

export default useCartStore;
