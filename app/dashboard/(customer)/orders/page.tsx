"use client";

import ReviewModal from "@/components/review/review-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Order = {
  id: string;
  deliveryAddress: string;
  total: number;
  status: string;
  placedAt: string;
  items: {
    id: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    meal: {
      id: string;
      title: string;
      image?: string;
    } | null;
  }[];
  provider: {
    id: string;
    name: string;
  } | null;
};

type ApiResponse = {
  success: boolean;
  data: Order[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<{
    id: string;
    title?: string;
  } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse>("/v1/orders");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "PREPARING":
        return "bg-blue-100 text-blue-700";
      case "READY":
        return "bg-purple-100 text-purple-700";
      case "PLACED":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-semibold">No orders yet</h2>
        <p className="text-muted-foreground">
          Start ordering some delicious meals!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          View and track your orders
        </p>
      </header>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(order.placedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Items:</p>
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="text-sm text-muted-foreground flex justify-between"
                    >
                      <span>
                        {item.meal?.title || "Unknown Meal"} × {item.quantity}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>${item.subtotal.toFixed(2)}</span>
                        {item.meal?.id && (
                          <button
                            className="text-sm text-primary underline"
                            onClick={() => {
                              setCurrentMeal({
                                id: item.meal?.id ?? item.id,
                                title: item.meal?.title,
                              });
                              setReviewOpen(true);
                            }}
                          >
                            Leave review
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Delivery Address:
                  </span>
                  <span className="font-medium">{order.deliveryAddress}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {currentMeal && (
        <ReviewModal
          mealId={currentMeal.id}
          mealTitle={currentMeal.title}
          open={reviewOpen}
          onOpenChange={(o) => setReviewOpen(o)}
          onSuccess={() => {
            // refresh orders to reflect review availability/status
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}
