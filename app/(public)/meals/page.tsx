import MealCard from "@/components/cards/MealCard";
import api from "@/lib/fetcher";

interface MealItem {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  price?: number | string;
  provider?: { id: string; name: string } | null;
}

export default async function MealsPage() {
  const res = await api.get<{ data?: MealItem[] }>("/meals");
  const meals = (res as { data?: MealItem[] }).data ?? [];

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.isArray(meals) && meals.length ? (
          meals.map((meal: MealItem) => (
            <MealCard
              key={meal.id}
              id={meal.id}
              title={meal.title}
              image={meal.image ?? undefined}
              price={meal.price}
              description={meal.description ?? undefined}
            />
          ))
        ) : (
          <div className="text-muted-foreground">No meals found.</div>
        )}
      </div>
    </section>
  );
}
