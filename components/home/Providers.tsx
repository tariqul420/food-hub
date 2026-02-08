import ProviderCard from "@/components/cards/ProviderCard";
import api from "@/lib/fetcher";
import Link from "next/link";

export default async function Providers() {
  const res = await api.get<{
    data?: {
      id: string;
      name: string;
      description?: string | null;
      logo?: string | null;
    }[];
  }>("/v1/providers", { limit: 6 });

  const providers =
    (
      res as {
        data?: {
          id: string;
          name: string;
          description?: string | null;
          logo?: string | null;
        }[];
      }
    ).data ?? [];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Featured Providers</h2>
        <Link
          href="/providers"
          className="text-sm text-muted-foreground hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {providers.length ? (
          providers.map((p) => (
            <ProviderCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              logo={p.logo}
            />
          ))
        ) : (
          <div className="text-muted-foreground">No providers found.</div>
        )}
      </div>
    </section>
  );
}
