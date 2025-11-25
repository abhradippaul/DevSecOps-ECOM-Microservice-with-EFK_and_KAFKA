"use client";

import useCartStore from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

function ShoppingCartIcon() {
  const { cart } = useCartStore();

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="size-4 text-gray-600" />
      <span className="absolute -top-3 -right-3 bg-amber-400 text-gray-600 rounded-full size-4 flex items-center justify-center text-xs font-medium">
        {cart.length}
      </span>
    </Link>
  );
}

export default ShoppingCartIcon;
