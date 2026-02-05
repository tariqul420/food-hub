"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/fetcher";
import { BadgeCheck, CreditCard, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [provider, setProvider] = useState<{
    id: string;
    name: string;
    logo?: string | null;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{
          data?: { id: string; name: string; logo?: string | null }[];
        }>("/providers", { limit: 1 });
        const list =
          (
            res as {
              data?: { id: string; name: string; logo?: string | null }[];
            }
          ).data || [];
        if (list.length) setProvider(list[0]);
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <section className="rounded-2xl bg-linear-to-tr from-accent/5 to-primary/5 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2">
            <Badge>New</Badge>
            <span className="text-sm text-muted-foreground">
              Now with faster delivery
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight">
            Hungry? Find the best local meals in minutes.
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            FoodHub connects you with trusted local providers. Order for
            delivery or pickup — real-time tracking, cash on delivery, and
            curated picks every day.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="ghost">
              <Link href="/meals">Browse meals</Link>
            </Button>
            <Button asChild>
              <Link href="/register?role=PROVIDER">Become a provider</Link>
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <CreditCard className="size-4" /> <span>COD</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Truck className="size-4" /> <span>Fast delivery</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <BadgeCheck className="size-4" /> <span>Verified providers</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-end">
          <div className="relative w-80">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <div className="rounded-full bg-linear-to-tr from-accent/10 to-primary/5 h-64 w-64 flex items-center justify-center">
                <Image
                  src="/images/pizza.webp"
                  alt="Dish"
                  width={200}
                  height={200}
                  className="rounded-full"
                />
              </div>
            </div>

            <Link
              href={`/providers/${provider?.id ?? ""}`}
              className="absolute -left-8 -bottom-6"
            >
              <Card className="w-72">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {provider?.logo ? (
                        <AvatarImage src={provider.logo} alt={provider.name} />
                      ) : (
                        <AvatarImage
                          src="/images/provider-placeholder.png"
                          alt={provider?.name ?? "P"}
                        />
                      )}
                      <AvatarFallback>
                        {provider?.name?.charAt(0) ?? "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {provider?.name ?? "Popular provider"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Provider • Rating
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      30–40 min
                    </div>
                    <div className="font-semibold">$6.99</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <div className="absolute right-0 -top-6">
              <Card className="w-56">
                <CardContent>
                  <div className="text-sm font-medium">Limited offer</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Free delivery today
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
