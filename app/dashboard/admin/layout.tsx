import { requireAdmin } from "@/lib/auth/guard";

export default async function AdminLayout({ children }: Children) {
  await requireAdmin();

  return <>{children}</>;
}
