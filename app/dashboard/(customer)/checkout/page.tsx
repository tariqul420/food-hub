"use client";

import { InputField } from "@/components/fields/input-field";
import TextareaField from "@/components/fields/textarea-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "@/lib/auth/auth-client";
import { api } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      address: "",
      city: "",
      notes: "",
    },
  });

  const totalPrice = getTotalPrice();
  const deliveryFee = 2.0;
  const tax = totalPrice * 0.1;
  const finalTotal = totalPrice + deliveryFee + tax;

  const handleSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const itemsByProvider = items.reduce(
        (acc, item) => {
          const providerId = item.providerProfileId || "unknown";
          if (!acc[providerId]) {
            acc[providerId] = [];
          }
          acc[providerId].push(item);
          return acc;
        },
        {} as Record<string, typeof items>,
      );

      // Create order for each provider
      const orderPromises = Object.entries(itemsByProvider).map(
        async ([providerId, providerItems]) => {
          const orderData = {
            deliveryAddress: `${data.address}, ${data.city}`,
            items: providerItems.map((item) => ({
              mealId: item.mealId,
              mealTitle: item.title,
              unitPrice: item.price,
              quantity: item.quantity,
            })),
            providerProfileId: providerId !== "unknown" ? providerId : null,
          };

          return api.post("/orders", orderData);
        },
      );

      await Promise.all(orderPromises);

      toast.success("Order placed successfully!", {
        description: "Your order has been received and is being processed.",
      });

      clearCart();
      router.push("/dashboard/orders");
    } catch (error) {
      console.error("Order creation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to place order", {
        description: errorMessage || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Add some items to your cart before checkout
        </p>
        <Button onClick={() => router.push("/meals")}>Browse Meals</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          Complete your order information
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      name="name"
                      label="Full Name"
                      placeholder="John Doe"
                      requiredMark
                    />

                    <InputField
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      requiredMark
                    />
                  </div>

                  <InputField
                    name="email"
                    label="Email"
                    type="email"
                    readOnly
                  />

                  <TextareaField
                    name="address"
                    label="Delivery Address"
                    placeholder="Street address, apartment number, etc."
                  />

                  <InputField
                    name="city"
                    label="City"
                    placeholder="New York"
                    requiredMark
                  />

                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for delivery..."
                      rows={3}
                      {...form.register("notes")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.title} × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Delivery Fee
                      </span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Back to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
