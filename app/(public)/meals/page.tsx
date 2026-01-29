import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";

const API = "http://localhost:4000";

async function fetchMeals() {
  try {
    const res = await fetch(`${API}/meals`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function MealsPage() {
  const meals: any[] = await fetchMeals();

  return (
    <section className="py-10">
      <h1 className="mb-6 text-2xl font-semibold">Browse Meals</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meals && meals.length ? (
          meals.map((meal) => (
            <Card key={meal.id} className="overflow-hidden">
              {meal.image && (
                <div className="h-44 w-full relative">
                  <Image src={meal.image} alt={meal.name} fill className="object-cover" />
                </div>
              )}
              <CardHeader>
                <CardTitle>{meal.name}</CardTitle>
                <CardDescription>{meal.providerName ?? meal.provider}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{meal.description}</p>
              </CardContent>
              <CardAction>
                <Link href={`/meals/${meal.id}`} className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                  View
                </Link>
              </CardAction>
            </Card>
          ))
        ) : (
          <div className="text-muted-foreground">No meals found.</div>
        )}
      </div>
    </section>
  );
}
