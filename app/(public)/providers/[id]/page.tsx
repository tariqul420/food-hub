import MealCard from "@/components/cards/MealCard";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/fetcher";

interface ProviderDetail {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  meals?: {
    id: string;
    title?: string;
    price?: number | string;
    image?: string | null;
    description?: string | null;
  }[];
}

export default async function ProviderPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const res = await api.get<{ data?: ProviderDetail }>(`/providers/${id}`);
  const provider = (res as { data?: ProviderDetail }).data;

  if (!provider) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Provider not found.
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted flex items-center justify-center text-muted-foreground">
          {provider.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.logo}
              alt={provider.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div>Logo</div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{provider.name}</h1>
          <p className="text-sm text-muted-foreground">
            {provider.description}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge>Provider</Badge>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-medium">Menu</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {provider.meals && provider.meals.length ? (
          provider.meals.map((meal) => (
            <MealCard
              key={meal.id}
              id={meal.id}
              image={meal.image}
              title={meal.title ?? "Untitled"}
              description={meal.description}
              price={meal.price}
            />
          ))
        ) : (
          <div className="text-muted-foreground">No menu items available.</div>
        )}
      </div>
    </section>
  );
}
