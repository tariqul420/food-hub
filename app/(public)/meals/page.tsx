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
import { Star } from "lucide-react";
import Link from "next/link";

const DUMMY_MEALS = [
  {
    id: "m1",
    name: "Margherita Pizza",
    provider: "Pizza Palace",
    description:
      "Classic margherita with fresh tomatoes, mozzarella and basil.",
    price: "6.99",
    rating: 4.7,
  },
  {
    id: "m2",
    name: "Classic Burger",
    provider: "Burger Corner",
    description:
      "Juicy beef patty with lettuce, tomato and our signature sauce.",
    price: "5.50",
    rating: 4.5,
  },
  {
    id: "m3",
    name: "Salmon Sushi",
    provider: "Sushi House",
    description: "Fresh salmon nigiri served with wasabi and pickled ginger.",
    price: "8.25",
    rating: 4.8,
  },
  {
    id: "m4",
    name: "Caesar Salad",
    provider: "Green Bowl",
    description:
      "Crisp romaine, parmesan, croutons and creamy Caesar dressing.",
    price: "4.99",
    rating: 4.3,
  },
];

export default function MealsPage() {
  const meals = DUMMY_MEALS;

  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Browse Meals</h1>
        <div className="flex items-center gap-3">
          <Badge>Popular</Badge>
          <Button asChild size="sm">
            <Link href="/meals">Explore all</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal) => (
          <Card key={meal.id} className="overflow-hidden">
            <div className="h-44 w-full bg-muted flex items-center justify-center text-muted-foreground">
              Image
            </div>

            <CardHeader>
              <div>
                <CardTitle>{meal.name}</CardTitle>
                <CardDescription>{meal.provider}</CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-sm">
                  <Star className="size-4 text-amber-500" />{" "}
                  <span className="font-medium">{meal.rating}</span>
                </div>
                <div className="mt-2 font-semibold">${meal.price}</div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {meal.description}
              </p>
            </CardContent>

            <CardAction>
              <div className="flex gap-2">
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
        ))}
      </div>
    </section>
  );
}
