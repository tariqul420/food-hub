import { IconMapKey } from "@/components/dashboard/dashboard-sidebar";

export const ADMIN = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: "LayoutDashboard" as IconMapKey,
  },
  {
    title: "Users",
    url: "/dashboard/admin/users",
    icon: "Users" as IconMapKey,
  },
  {
    title: "Orders",
    url: "/dashboard/admin/orders",
    icon: "ShoppingCart" as IconMapKey,
  },
  {
    title: "Categories",
    url: "/dashboard/admin/categories",
    icon: "Tag" as IconMapKey,
  },
];

export const PROVIDER = [
  {
    title: "Dashboard",
    url: "/dashboard/provider",
    icon: "LayoutDashboard" as IconMapKey,
  },
  {
    title: "Menu",
    url: "/dashboard/provider/menu",
    icon: "FolderKanban" as IconMapKey,
  },
  {
    title: "Orders",
    url: "/dashboard/provider/orders",
    icon: "ShoppingCart" as IconMapKey,
  },
  {
    title: "Profile",
    url: "/dashboard/provider/profile",
    icon: "User" as IconMapKey,
  },
];

export const CUSTOMER = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard" as IconMapKey,
  },
  {
    title: "Cart",
    url: "/dashboard/cart",
    icon: "ShoppingCart" as IconMapKey,
  },
  {
    title: "Checkout",
    url: "/dashboard/checkout",
    icon: "CreditCard" as IconMapKey,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: "List" as IconMapKey,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: "User" as IconMapKey,
  },
];

export const sidebar = {
  ADMIN,
  PROVIDER,
  CUSTOMER,
};
