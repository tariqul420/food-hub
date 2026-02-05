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
  id: string;
  title: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type ProviderOrderRecord = BaseRecord & {
  customer: {
    name: string;
    email: string;
  };
  provider: {
    name: string;
    email: string;
  };
  total: number;
  currency: string;
  status: string;
  deliveryAddress: string;
  total: number;
  status: string;
  placedAt: string | Date;
  updatedAt: string | Date;
};

type AdminCategoryRecord = BaseRecord & {
  name: string;
  description?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};
