import { Check, Clock, Settings, Truck, X } from "lucide-react";

export function getStatusLabel(status?: string) {
  switch (status) {
    case "PLACED":
      return "Placed";
    case "PREPARING":
      return "Preparing";
    case "READY":
      return "Ready";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Unknown";
  }
}

export function getStatusColorClass(status?: string) {
  switch (status) {
    case "PLACED":
      return "text-amber-700 bg-amber-50";
    case "PREPARING":
      return "text-sky-700 bg-sky-50";
    case "READY":
      return "text-violet-700 bg-violet-50";
    case "DELIVERED":
      return "text-green-700 bg-green-50";
    case "CANCELLED":
      return "text-red-700 bg-red-50";
    default:
      return "text-muted-foreground";
  }
}

export default function getStatusIcon(status?: string) {
  switch (status) {
    case "PLACED":
      return <Clock className="h-4 w-4" />;
    case "PREPARING":
      return <Settings className="h-4 w-4" />;
    case "READY":
      return <Truck className="h-4 w-4" />;
    case "DELIVERED":
      return <Check className="h-4 w-4" />;
    case "CANCELLED":
      return <X className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}
