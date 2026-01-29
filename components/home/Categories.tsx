"use client";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

const CATEGORIES = [
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "burger", label: "Burgers", emoji: "🍔" },
  { id: "sushi", label: "Sushi", emoji: "🍣" },
  { id: "salad", label: "Salads", emoji: "🥗" },
  { id: "dessert", label: "Desserts", emoji: "🍰" },
  { id: "drinks", label: "Drinks", emoji: "🥤" },
  { id: "vegan", label: "Vegan", emoji: "🥬" },
];

export default function Categories() {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Quick Categories</h2>
        <Link
          href="/meals"
          className="text-sm text-muted-foreground hover:underline"
        >
          See all
        </Link>
      </div>

      <ScrollArea className="mt-4">
        <div className="flex gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/meals?category=${c.id}`}
              className="inline-flex items-center gap-3 rounded-full px-4 py-2 bg-muted/60 hover:bg-muted transition-colors duration-150"
            >
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/5 text-lg">
                <span aria-hidden>{c.emoji}</span>
              </div>

              <div className="text-sm font-medium">{c.label}</div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
