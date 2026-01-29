import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Deals() {
  return (
    <section>
      <Card className="bg-accent/5 p-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold">Weekend Meal Deals</h3>
            <p className="text-sm text-muted-foreground">
              Limited-time offers across popular providers — save more!
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/meals">
              <Button>See deals</Button>
            </Link>
            <Link href="/providers">
              <Button variant="outline">Partner with us</Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
