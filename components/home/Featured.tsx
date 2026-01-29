"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Meal = {
  id: string;
  name: string;
  image?: string;
  price: string;
  cuisine?: string;
  rating?: number;
};

type Provider = {
  id: string;
  name: string;
  logo?: string;
  cuisine?: string;
};

const MEALS: Meal[] = [
  {
    id: "m1",
    name: "Margherita Pizza",
    image: "",
    price: "6.99",
    cuisine: "Pizza",
    rating: 4.7,
  },
  {
    id: "m2",
    name: "Classic Burger",
    image: "",
    price: "5.50",
    cuisine: "Burgers",
    rating: 4.5,
  },
  {
    id: "m3",
    name: "Salmon Sushi",
    image: "",
    price: "8.25",
    cuisine: "Sushi",
    rating: 4.8,
  },
  {
    id: "m4",
    name: "Caesar Salad",
    image: "",
    price: "4.99",
    cuisine: "Salads",
    rating: 4.3,
  },
];

const PROVIDERS: Provider[] = [
  { id: "p1", name: "Pizza Palace", logo: "", cuisine: "Pizza" },
  { id: "p2", name: "Burger Corner", logo: "", cuisine: "Burgers" },
  { id: "p3", name: "Sushi House", logo: "", cuisine: "Sushi" },
];

export default function Featured() {
  const [tab, setTab] = useState<"meals" | "providers">("meals");

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Featured</h2>
        <div className="flex gap-2">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "meals" | "providers")}
          >
            <TabsList>
              <TabsTrigger value="meals">Meals</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {tab === "meals" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {MEALS.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <div className="relative h-40 w-full bg-muted">
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Skeleton className="h-full" />
                )}
              </div>

              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">{m.name}</h3>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {m.cuisine}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="size-4 text-amber-500" />{" "}
                      <span className="font-medium">{m.rating}</span>
                    </div>
                    <div className="mt-2 font-semibold">${m.price}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/meals/${m.id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {PROVIDERS.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar size="lg" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {p.cuisine}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link href={`/providers/${p.id}`}>
                  <Button size="sm">View menu</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
