import { IconMapKey } from "@/components/dashboard/dashboard-sidebar";

export const ADMIN = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: "LayoutDashboard" as IconMapKey,
  },
  {
    title: "Projects",
    url: "/dashboard/admin/projects",
    icon: "FolderKanban" as IconMapKey,
  },
  {
    title: "Blogs",
    url: "/dashboard/admin/blogs",
    icon: "Newspaper" as IconMapKey,
  },
  {
    title: "Contacts",
    url: "/dashboard/admin/contacts",
    icon: "Mail" as IconMapKey,
  },
  {
    title: "URL Shortener",
    url: "/dashboard/admin/url-shortener",
    icon: "Link2" as IconMapKey,
  },
];

export const CUSTOMER = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard" as IconMapKey,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: "User" as IconMapKey,
  },
];

export const sidebar = {
  ADMIN,
  CUSTOMER,
};
