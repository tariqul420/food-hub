"use client";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

const CATEGORIES = [
  { id: "pizza", label: "Pizza" },
  { id: "burger", label: "Burgers" },
  { id: "sushi", label: "Sushi" },
  { id: "salad", label: "Salads" },
  { id: "dessert", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
  { id: "vegan", label: "Vegan" },
];

export default function Categories() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Quick Categories</h2>
      <ScrollArea className="rounded-md border px-3 py-2">
        <div className="flex gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/meals?category=${c.id}`}
              className="inline-flex items-center gap-2"
            >
              <Badge>{c.label}</Badge>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
