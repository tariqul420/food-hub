"use client";

import SelectField from "@/components/fields/select-field";
import api from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StatusChangeSelectProps {
  orderId: string | number;
  currentStatus: string;
  className?: string;
}

const STATUSES = [
  { label: "Placed", value: "PLACED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function StatusChangeSelect({
  orderId,
  currentStatus,
  className,
}: StatusChangeSelectProps) {
  const router = useRouter();

  const handleStatusUpdate = async (newStatusLower: string) => {
    const newStatus = newStatusLower as string;
    if (!newStatus) return toast.error("Invalid status");
    if (!orderId) return toast.error("Order ID is missing");

    toast.promise(api.patch(`/orders/${orderId}`, { status: newStatus }), {
      loading: "Updating order status...",
      success: () => {
        router.refresh();
        return "Order status updated successfully";
      },
      error: "Failed to update order status",
    });
  };

  return (
    <SelectField
      defaultValue={currentStatus}
      onValueChange={(value) => {
        if (typeof value === "string") {
          handleStatusUpdate(value);
        }
      }}
      placeholder="Select status"
      options={STATUSES}
      className={className}
    />
  );
}
