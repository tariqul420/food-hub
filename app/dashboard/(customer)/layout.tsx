import { requireCustomer } from "@/lib/auth/guard";

export default async function CustomerLayout({ children }: Children) {
  await requireCustomer();

  return <>{children}</>;
}
