import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";

const API = "http://localhost:4000";

async function fetchProvider(id: string) {
  try {
    const res = await fetch(`${API}/providers/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function ProviderPage({ params }: { params: { id: string } }) {
  const provider: any = await fetchProvider(params.id);

  if (!provider) {
    return <div className="py-20 text-center text-muted-foreground">Provider not found.</div>;
  }

  return (
    <section className="py-10">
      <div className="mb-6 flex items-center gap-4">
        {provider.logo && (
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <Image src={provider.logo} alt={provider.name} fill className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{provider.name}</h1>
          <p className="text-sm text-muted-foreground">{provider.description}</p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-medium">Menu</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {provider.meals && provider.meals.length ? (
          provider.meals.map((meal: any) => (
            <Card key={meal.id} className="overflow-hidden">
              {meal.image && (
                <div className="h-44 w-full relative">
                  <Image src={meal.image} alt={meal.name} fill className="object-cover" />
                </div>
              )}
              <CardHeader>
                <CardTitle>{meal.name}</CardTitle>
                <CardDescription>{provider.name}</CardDescription>
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
          <div className="text-muted-foreground">No menu items available.</div>
        )}
      </div>
    </section>
  );
}
