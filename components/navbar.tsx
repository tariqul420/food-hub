"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { Search } from "lucide-react";
import Link from "next/link";
import { InputField } from "./fields/input-field";

export default function Navbar() {
  const session = useSession();

  const user = session?.data?.user;
  const avatarSrc = user?.image ?? "/images/avatar-placeholder.png";
  const displayName = user?.name ?? user?.email ?? "User";
  const initial = displayName.charAt(0).toUpperCase();

  async function handleSignOut() {
    try {
      await signOut();
    } catch (e) {
      console.error("sign out error", e);
    }
  }

  const navItems = [
    { label: "Meals", href: "/meals" },
    { label: "Providers", href: "/providers" },
    ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/75 backdrop-blur-sm">
      <div className="mx-auto flex w-[95vw] max-w-7xl items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold">
            FoodHub
          </Link>

          <InputField
            placeholder="Search meals, cuisines, providers..."
            className="w-[36ch]"
          />
        </div>

        <nav className="flex items-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-md px-3 py-2 text-sm font-medium hover:bg-accent md:inline-flex"
            >
              {item.label}
            </Link>
          ))}

          {/* <Link
            href="/cart"
            aria-label="Cart"
            className="rounded-md px-2 py-2 hover:bg-accent"
          >
            🧺
          </Link> */}

          {user ? (
            <>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2"
              >
                <Avatar>
                  <AvatarImage src={avatarSrc} alt={displayName} />
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
              </Link>

              <button
                onClick={handleSignOut}
                className="text-sm rounded-md px-3 py-2 hover:bg-accent"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:inline-flex text-sm">
                Log in
              </Link>

              <Link href="/register">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>

              <Link href="/provider/signup">
                <Button size="sm">Become a Provider</Button>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* mobile search */}
      <div className="mx-auto w-[95vw] max-w-7xl py-2 md:hidden">
        <form action="/meals" className="flex gap-2">
          <div className="flex w-full items-center gap-2 rounded-md border px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Search meals..."
              className="w-full border-0 bg-transparent p-0 focus:ring-0"
            />
          </div>
          <Button asChild>
            <button type="submit">Go</button>
          </Button>
        </form>
      </div>
    </header>
  );
}
