import ProviderForm from "@/features/provider/components/provider-form";
import { getUser } from "@/lib/auth/guard";
import api from "@/lib/fetcher";
import * as React from "react";

export default async function page() {
  await getUser();

  try {
    const res = await api.get("/providers/me");
    const provider = (res as unknown as { data?: unknown }).data ?? res;
    const p = provider as
      | {
          id: string;
          name: string;
          description?: string;
          phone?: string;
          email?: string;
          address?: string;
          city?: string;
          country?: string;
          logo?: string;
          isActive?: boolean;
        }
      | null
      | undefined;

    return (
      <React.Fragment>
        <ProviderForm provider={p} />
      </React.Fragment>
    );
  } catch (err: unknown) {
    // If provider not found (404) or other error, render empty form so user can create one
    console.error("Fetch provider error:", err);
    return (
      <React.Fragment>
        <ProviderForm />
      </React.Fragment>
    );
  }
}
