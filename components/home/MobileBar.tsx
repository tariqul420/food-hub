"use client";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function MobileBar() {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto block w-[95vw] max-w-3xl md:hidden">
      <Card className="rounded-full p-2">
        <div className="flex items-center justify-between gap-3 px-3">
          <div className="text-sm font-medium">Hungry? Browse meals</div>
          <Link href="/meals" className="text-sm">
            Order now
          </Link>
        </div>
      </Card>
    </div>
  );
}
