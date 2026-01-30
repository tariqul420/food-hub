import { BaseRecord } from "@/components/dashboard/data-table";

type AdminUserRecord = BaseRecord & {
  name: string;
  image?: string | null;
  email: string;
  role: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};
