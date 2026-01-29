import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background/50 py-8">
      <div className="mx-auto w-[95vw] max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <div className="text-lg font-semibold">FoodHub</div>
            <div className="mt-2 text-sm text-muted-foreground">
              © {new Date().getFullYear()} FoodHub. All rights reserved.
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Admin accounts seeded for demo
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <div className="mb-2 font-semibold">Product</div>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/meals" className="text-muted-foreground">
                  Meals
                </Link>
                <Link href="/providers" className="text-muted-foreground">
                  Providers
                </Link>
              </div>
            </div>

            <div>
              <div className="mb-2 font-semibold">Legal</div>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/terms" className="text-muted-foreground">
                  Terms
                </Link>
                <Link href="/privacy" className="text-muted-foreground">
                  Privacy
                </Link>
              </div>
            </div>

            <div>
              <div className="mb-2 font-semibold">Help</div>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/contact" className="text-muted-foreground">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
