import MealCard from "@/components/cards/MealCard";
import { api } from "@/lib/fetcher";

type Meal = {
  id: string;
  title: string;
  image?: string | null;
  price?: number | string;
  description?: string | null;
  providerProfileId?: string;
  provider?: { name?: string } | null;
};

export default async function Featured() {
  const res = await api.get<{ data?: Meal[] }>("/meals");
  const meals = (res as { data?: Meal[] }).data ?? [];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Featured Meals</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {meals.length ? (
          meals.map((m) => (
            <MealCard
              key={m.id}
              id={m.id}
              title={m.title}
              providerName={m.provider?.name}
              image={m.image ?? undefined}
              price={m.price}
              description={m.description}
              providerProfileId={m.providerProfileId}
            />
          ))
        ) : (
          <div className="text-muted-foreground">No meals found.</div>
        )}
      </div>
    </section>
  );
}
