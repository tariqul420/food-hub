import { Card } from "@/components/ui/card";
import { CreditCard, MapPin, ShoppingCart } from "lucide-react";

export default function HowItWorks() {
  const STEPS = [
    {
      id: 1,
      title: "Browse Meals",
      desc: "Choose from menus across local providers",
      icon: <ShoppingCart />,
    },
    {
      id: 2,
      title: "Checkout (COD)",
      desc: "Cash on delivery or other payments",
      icon: <CreditCard />,
    },
    {
      id: 3,
      title: "Track Order",
      desc: "Real-time updates until delivery",
      icon: <MapPin />,
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">How it works</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {STEPS.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-background/30 p-2">{s.icon}</div>
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {s.desc}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
