import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const API = "http://localhost:4000";

type Meal = {
  id: string | number;
  name: string;
  image?: string;
  description?: string;
  providerName?: string;
  provider?: string;
  price?: number;
};

async function fetchFeaturedMeals(): Promise<Meal[]> {
  try {
    const res = await fetch(`${API}/meals`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data.slice(0, 6) as Meal[]) : [];
  } catch (err) {
    // keep error visible during server logs
    console.error("fetchFeaturedMeals error:", err);
    return [];
  }
}

const CATEGORIES = [
  "Pizza",
  "Burgers",
  "Sushi",
  "Salads",
  "Desserts",
  "Drinks",
];

export default async function Home() {
  const featured: Meal[] = await fetchFeaturedMeals();

  return (
    <div className="py-12">
      {/* Hero */}
      <section className="mb-12 rounded-lg bg-card p-8 shadow-sm">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold leading-tight">
                FoodHub — Discover & Order Delicious Meals
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Browse menus from local providers, order your favorites, and
                track delivery — all in one place.
              </p>

              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <Link href="/meals">Explore Meals</Link>
                </Button>
                <Link
                  href="/providers/1"
                  className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Browse Providers
                </Link>
              </div>
            </div>

            <div className="hidden w-1/2 items-center justify-end gap-6 lg:flex">
              <div className="relative h-40 w-40 overflow-hidden rounded-lg">
                <Image
                  src="/next.svg"
                  alt="FoodHub"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Categories</h2>
        <div className="flex gap-3 overflow-auto pb-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/meals?category=${encodeURIComponent(c)}`}
              className="rounded-md bg-background/60 px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured meals */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Meals</h2>
          <Link
            href="/meals"
            className="text-sm text-muted-foreground hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured && featured.length ? (
            featured.map((meal: Meal) => (
              <Card key={meal.id} className="overflow-hidden">
                {meal.image && (
                  <div className="h-44 w-full relative">
                    <Image
                      src={meal.image}
                      alt={meal.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{meal.name}</CardTitle>
                  <CardDescription>
                    {meal.providerName ?? meal.provider}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {meal.description}
                  </p>
                </CardContent>
                <CardAction>
                  <Link
                    href={`/meals/${meal.id}`}
                    className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                  >
                    View
                  </Link>
                </CardAction>
              </Card>
            ))
          ) : (
            <div className="text-muted-foreground">
              No featured meals available right now.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

