export const dynamic = "force-dynamic";

import { requireCustomer } from "@/lib/auth/guard";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCustomer();
  return <>{children}</>;
}
