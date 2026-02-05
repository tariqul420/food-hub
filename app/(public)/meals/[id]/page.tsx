import AddToCart from "@/components/buttons/add-to-cart";
import ContentContainer from "@/components/content-container";
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
type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer?: { id: string; name?: string | null } | null;
};

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

  // fetch reviews for this meal
  const reviewsRes = await api.get<{ data?: Review[] }>(`/reviews/meal/${id}`);
  const reviews = (reviewsRes as { data?: Review[] }).data || [];
  const avgRating = reviews.length
    ? Math.round(
        (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) *
          10,
      ) / 10
    : null;

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
          <div className="rounded-xl bg-muted flex items-center justify-center text-muted-foreground aspect-square w-full overflow-hidden max-h-[70vh]">
            {meal.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={meal.image}
                alt={meal.title}
                className="w-full h-full object-cover"
                style={{ maxHeight: "70vh" }}
              />
            ) : (
              <div className="text-muted-foreground">Image</div>
            )}
          </div>

          <Card className="mt-6">
            <CardContent>
              <ContentContainer
                content={meal.description || "No description provided."}
              />
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
                  {reviews.length > 0 ? (
                    <div className="text-sm text-muted-foreground mt-1">
                      Rating: {avgRating} • {reviews.length} review
                      {reviews.length > 1 ? "s" : ""}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">
                      No reviews yet
                    </div>
                  )}
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
          {reviews.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  {reviews.length} review{reviews.length > 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="border-b pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          {r.customer?.name ?? "Anonymous"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {r.rating} / 5
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {r.comment}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
