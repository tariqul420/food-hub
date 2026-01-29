import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    short: "Fast, cheesy goodness",
  },
  {
    id: "p2",
    name: "Burger Corner",
    cuisine: "Burgers",
    short: "Burgers made right",
  },
  {
    id: "p3",
    name: "Sushi House",
    cuisine: "Sushi",
    short: "Fresh cuts and rolls",
  },
  {
    id: "p4",
    name: "Green Bowl",
    cuisine: "Salads",
    short: "Healthy & hearty",
  },
];

export default function ProvidersPage() {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Popular Providers</h1>
        <div className="flex items-center gap-3">
          <Badge>Top rated</Badge>
          <Button asChild size="sm">
            <Link href="/providers">All providers</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DUMMY_PROVIDERS.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src="/images/provider-placeholder.png"
                  alt={p.name}
                />
                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardHeader className="p-0">
                  <CardTitle>{p.name}</CardTitle>
                  <CardDescription>{p.cuisine}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground">{p.short}</p>
                </CardContent>
              </div>
            </div>

            <CardAction>
              <div className="mt-4 flex justify-end">
                <Link href={`/providers/${p.id}`}>
                  <Button size="sm">View menu</Button>
                </Link>
              </div>
            </CardAction>
          </Card>
        ))}
      </div>
    </section>
  );
}
