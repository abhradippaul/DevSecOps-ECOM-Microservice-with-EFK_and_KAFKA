import { CartStoreActionsType, CartStoreStateType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,
      addToCart: (product) =>
        set((state) => {
          const isExist = state.cart.findIndex(
            ({ id, selectedSize, selectedColor }) =>
              id === product.id &&
              selectedSize === product.selectedSize &&
              selectedColor === product.selectedColor
          );

          if (isExist !== -1) {
            const updatedCart = [...state.cart];
            updatedCart[isExist].quantity += product.quantity || 1;
            return { cart: updatedCart };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...product,
                  quantity: product.quantity || 1,
                  selectedSize: product.selectedSize,
                  selectedColor: product.selectedColor,
                },
              ],
            };
          }
        }),
      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter(
            ({ id, selectedSize, selectedColor }) =>
              !(
                id === product.id &&
                selectedSize === product.selectedSize &&
                selectedColor === product.selectedColor
              )
          ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);

export default useCartStore;
