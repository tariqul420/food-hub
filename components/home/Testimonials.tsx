import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/fetcher";

type RecentReview = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer?: { id: string; name?: string | null } | null;
  meal?: { id: string; title?: string } | null;
};

export default async function Testimonials() {
  const res = await api.get<{ data?: RecentReview[] }>(
    "/reviews/recent?limit=3",
  );
  const reviews = (res as { data?: RecentReview[] }).data || [];

  if (!reviews.length) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Latest Reviews</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {reviews.map((r) => (
          <Card key={r.id} className="p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-sm">
                {r.customer?.name ?? "Anonymous"}
              </CardTitle>
              <CardDescription className="text-xs">
                {r.meal?.title ?? "Meal"} — {r.rating} / 5
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <p className="text-sm text-muted-foreground">
                {r.comment ?? "No comment"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
