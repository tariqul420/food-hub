"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, CreditCard, Truck } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="rounded-lg bg-card p-8 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">
            FoodHub 🍱 — Discover & Order Delicious Meals Near You
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Browse menus from local providers, order for delivery or pickup, pay
            on delivery, and track your order in real-time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/meals">
              <Button size="lg">Browse Meals</Button>
            </Link>
            <Link href="/provider/signup">
              <Button variant="outline" size="lg">
                Become a Provider
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Badge>
              <CreditCard className="size-4" />{" "}
              <span className="ml-1">COD available</span>
            </Badge>
            <Badge>
              <Truck className="size-4" />{" "}
              <span className="ml-1">Fast delivery</span>
            </Badge>
            <Badge>
              <BadgeCheck className="size-4" />{" "}
              <span className="ml-1">Verified providers</span>
            </Badge>
          </div>
        </div>

        <div className="hidden items-center justify-end lg:flex">
          <div className="aspect-4/3 w-95 rounded-lg bg-linear-to-tr from-accent/10 to-primary/5 p-6">
            <div className="h-full w-full rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </section>
  );
}
