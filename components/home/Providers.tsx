import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const PROVIDERS = [
  { id: "p1", name: "Pizza Palace", cuisine: "Pizza" },
  { id: "p2", name: "Burger Corner", cuisine: "Burgers" },
  { id: "p3", name: "Sushi House", cuisine: "Sushi" },
];

export default function Providers() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Featured Providers</h2>
        <Link
          href="/providers"
          className="text-sm text-muted-foreground hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDERS.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar size="lg" />
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.cuisine}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link href={`/providers/${p.id}`} className="text-sm">
                View menu
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
