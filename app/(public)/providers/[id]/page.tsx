import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const DUMMY_PROVIDERS = [
  {
    id: "p1",
    name: "Pizza Palace",
    cuisine: "Pizza",
    description:
      "Hand-tossed pizzas with premium ingredients and fast delivery.",
    meals: [
      { id: "m1", name: "Margherita Pizza", price: "6.99" },
      { id: "m5", name: "Pepperoni Feast", price: "7.99" },
    ],
  },
  {
    id: "p2",
    name: "Burger Corner",
    cuisine: "Burgers",
    description: "Classic and gourmet burgers made to order.",
    meals: [{ id: "m2", name: "Classic Burger", price: "5.50" }],
  },
];

export default function ProviderPage({ params }: { params: { id: string } }) {
  const provider =
    DUMMY_PROVIDERS.find((p) => p.id === params.id) ?? DUMMY_PROVIDERS[0];

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
          Logo
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{provider.name}</h1>
          <p className="text-sm text-muted-foreground">
            {provider.description}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge>{provider.cuisine}</Badge>
          <Button asChild size="sm">
            <Link href="#">Follow</Link>
          </Button>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-medium">Menu</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {provider.meals && provider.meals.length ? (
          provider.meals.map(
            (meal: { id: string; name: string; price?: string }) => (
              <Card key={meal.id} className="overflow-hidden">
                <div className="h-44 w-full bg-muted flex items-center justify-center text-muted-foreground">
                  Image
                </div>
                <CardHeader>
                  <CardTitle>{meal.name}</CardTitle>
                  <CardDescription>{provider.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Simple description for {meal.name}.
                  </p>
                </CardContent>
                <CardAction>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/meals/${meal.id}`}
                      className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                    >
                      View
                    </Link>
                    <Button variant="outline" size="sm">
                      Add
                    </Button>
                  </div>
                </CardAction>
              </Card>
            ),
          )
        ) : (
          <div className="text-muted-foreground">No menu items available.</div>
        )}
      </div>
    </section>
  );
}
