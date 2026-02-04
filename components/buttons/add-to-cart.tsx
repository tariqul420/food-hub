"use client";

import { CartItem, useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface AddToCartProps {
  id: string;
  title: string;
  price?: number | string;
  image?: string | null;
  providerName?: string | null;
  providerProfileId?: string;
}

export default function AddToCart({
  id,
  title,
  price,
  image,
  providerName,
  providerProfileId,
}: AddToCartProps) {
  const { data: session } = useSession();
  const addItem = useCart(
    (state: { addItem: (item: Omit<CartItem, "id" | "quantity">) => void }) =>
      state.addItem,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isCustomer = !!session && (session?.user as any)?.role === "CUSTOMER";
  const isLoggedIn = !!session;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to add items to the cart");
      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can add items to the cart");
      return;
    }

    const numPrice = typeof price === "string" ? parseFloat(price) : price || 0;

    addItem({
      mealId: id,
      title,
      price: numPrice,
      image,
      providerName,
      providerProfileId,
    });

    toast.success("Added to cart successfully");
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddToCart}
      >
        Add to cart
      </Button>
    </div>
  );
}
