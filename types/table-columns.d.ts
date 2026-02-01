import { BaseRecord } from "@/components/dashboard/data-table";

type AdminUserRecord = BaseRecord & {
  name: string;
  image?: string | null;
  email: string;
  role: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type ProviderMealRecord = BaseRecord & {
  title: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};
