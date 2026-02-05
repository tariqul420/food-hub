import ProviderCard from "@/components/cards/ProviderCard";
import SearchBar from "@/components/global/url/search-bar";
import SortSelect from "@/components/global/url/sort-select";
import api from "@/lib/fetcher";
import { TriangleAlertIcon } from "lucide-react";

interface ProviderItem {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
}

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { search, sort, page } = await searchParams;

  const res = await api.get<{ data?: ProviderItem[] }>("/providers", {
    search,
    sort,
    page,
  });
  const providers = (res as { data?: ProviderItem[] }).data ?? [];

  return (
    <section className="py-10">
      <div className="container">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 md:mr-4">
            <SearchBar placeholder="Search providers..." />
          </div>
          <div className="w-full md:w-48">
            <SortSelect
              items={[
                { value: "", label: "Default" },
                { value: "newest", label: "Newest" },
              ]}
            />
          </div>
        </div>

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
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground col-span-full">
              <TriangleAlertIcon size={28} className="mb-3 opacity-70" />
              <div className="text-lg font-medium">No providers found.</div>
              <div className="text-sm">
                Try adjusting your search or filters.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
