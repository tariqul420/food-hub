export const dynamic = "force-dynamic";

import { requireProvider } from "@/lib/auth/guard";

export default async function ProviderLayout({ children }: Children) {
  await requireProvider();

  return <>{children}</>;
}
