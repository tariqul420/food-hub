import Link from "next/link";

export default function RootLayout({ children }: Children) {
  return (
    <>
      <header className="border-b bg-background/50 backdrop-blur-sm">
        <div className="mx-auto w-[90vw] max-w-7xl flex items-center justify-between gap-4 py-4">
          <Link href="/" className="text-lg font-semibold">
            FoodHub
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/meals"
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
            >
              Meals
            </Link>
            <Link
              href="/providers/1"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              Providers
            </Link>
            <Link href="/" className="text-sm text-muted-foreground">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-[90vw] max-w-7xl h-auto overflow-x-hidden min-h-screen">
        {children}
      </main>
      {/* <Footer /> */}
    </>
  );
}
