import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const TESTIMONIALS = [
  { id: 1, text: "Fast delivery and great taste!", author: "Ayesha" },
  { id: 2, text: "Easy ordering and helpful providers.", author: "Rahim" },
  { id: 3, text: "Great value and reliable delivery.", author: "Sohana" },
];

export default function Testimonials() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Testimonials</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar />
              <div>
                <blockquote className="text-sm">{t.text}</blockquote>
                <div className="mt-2 text-sm font-medium text-muted-foreground">
                  — {t.author}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
