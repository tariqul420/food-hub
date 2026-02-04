import ProviderCard from "@/components/cards/ProviderCard";
import api from "@/lib/fetcher";

interface ProviderItem {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
}

export default async function ProvidersPage() {
  const res = await api.get<{ data?: ProviderItem[] }>("/providers");
  const providers = (res as { data?: ProviderItem[] }).data ?? [];

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(providers) && providers.length ? (
          providers.map((p) => (
            <ProviderCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description ?? undefined}
              logo={p.logo ?? undefined}
            />
          ))
        ) : (
          <div className="text-muted-foreground">No providers found.</div>
        )}
      </div>
    </section>
  );
}
