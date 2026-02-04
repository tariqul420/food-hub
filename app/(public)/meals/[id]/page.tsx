import AddToCart from "@/components/buttons/add-to-cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/fetcher";
import Link from "next/link";

interface MealDetail {
  id: string;
  title: string;
  description?: string | null;
  price?: number | string;
  image?: string | null;
  isAvailable?: boolean;
  providerProfileId?: string;
}

export default async function MealPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const res = await api.get<{ data?: MealDetail }>(`/meals/${id}`);
  const meal = (res as { data?: MealDetail }).data;

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
            {meal.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={meal.image}
                alt={meal.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div>Image</div>
            )}
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
                <CardTitle>{meal.title}</CardTitle>
                <CardDescription></CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold">${meal.price}</div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className="mt-2">
                    {meal.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <AddToCart
                  id={meal.id}
                  title={meal.title}
                  price={meal.price}
                  image={meal.image}
                  providerName={meal.providerProfileId}
                  providerProfileId={meal.providerProfileId}
                />
                {meal.providerProfileId && (
                  <Button variant="outline" asChild>
                    <Link href={`/providers/${meal.providerProfileId}`}>
                      View provider
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
