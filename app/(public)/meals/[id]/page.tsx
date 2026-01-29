import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
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
    providerId: "p1",
    provider: "Pizza Palace",
    description:
      "Classic margherita with fresh tomatoes, mozzarella and basil.",
    price: "6.99",
    rating: 4.7,
    eta: "30-45 min",
  },
  {
    id: "m2",
    name: "Classic Burger",
    providerId: "p2",
    provider: "Burger Corner",
    description:
      "Juicy beef patty with lettuce, tomato and our signature sauce.",
    price: "5.50",
    rating: 4.5,
    eta: "20-35 min",
  },
];

export default function MealPage({ params }: { params: { id: string } }) {
  const meal = DUMMY_MEALS.find((m) => m.id === params.id) ?? DUMMY_MEALS[0];

  if (!meal) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Meal not found.
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-xl bg-muted h-72 flex items-center justify-center text-muted-foreground">
            Image
          </div>

          <Card className="mt-6">
            <CardContent>
              <h2 className="text-lg font-semibold">About this meal</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {meal.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{meal.name}</CardTitle>
                <CardDescription>{meal.provider}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold">${meal.price}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {meal.eta}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 text-amber-500" />{" "}
                    <span className="font-medium">{meal.rating}</span>
                  </div>
                  <Badge className="mt-2">Popular</Badge>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button asChild>
                  <Link href="#">Add to cart</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/providers/${meal.providerId}`}>
                    View provider
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
