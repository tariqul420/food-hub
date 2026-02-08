import ProviderForm from "@/features/provider/components/provider-form";
import { getUser } from "@/lib/auth/guard";
import api from "@/lib/fetcher";

interface Provider {
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

export default async function page() {
  await getUser();

  try {
    const res = await api.get<{ data?: Provider } | Provider>(
      "/v1/providers/me",
    );
    const provider = (res as { data?: Provider } | Provider).hasOwnProperty(
      "data",
    )
      ? (res as { data?: Provider }).data
      : (res as Provider | undefined);

    return (
      <main>
        <h1 className="text-2xl font-bold mb-4">Provider Profile</h1>
        <ProviderForm provider={provider} />
      </main>
    );
  } catch (err: unknown) {
    console.error("Fetch provider error:", err);
    return (
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Provider Profile</h1>
        <ProviderForm />
      </main>
    );
  }
}
