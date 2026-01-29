import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const API = "http://localhost:4000";

async function fetchMeal(id: string) {
  try {
    const res = await fetch(`${API}/meals/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function MealPage({ params }: { params: { id: string } }) {
  const meal: any = await fetchMeal(params.id);

  if (!meal) {
    return <div className="py-20 text-center text-muted-foreground">Meal not found.</div>;
  }

  return (
    <div className="py-10">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="w-full sm:w-1/2">
          {meal.image && (
            <div className="relative h-80 w-full rounded-lg overflow-hidden">
              <Image src={meal.image} alt={meal.name} fill className="object-cover" />
            </div>
          )}
        </div>
        <div className="w-full sm:w-1/2">
          <h1 className="text-2xl font-semibold">{meal.name}</h1>
          <p className="mt-2 text-muted-foreground">{meal.providerName ?? meal.provider}</p>
          <p className="mt-6 text-base leading-7">{meal.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="text-xl font-semibold">${meal.price ?? "-"}</div>
            <Button asChild>
              <Link href="#">Add to cart</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
