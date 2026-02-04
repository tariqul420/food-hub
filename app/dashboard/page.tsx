import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireCustomer } from "@/lib/auth/guard";
import Link from "next/link";

export default async function page() {
  const user = await requireCustomer();

  const role = user?.role;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview and quick links
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You are signed in as{" "}
              <strong className="capitalize">
                {role?.toLowerCase() || "user"}
              </strong>
              .
            </p>
            <div className="mt-4">
              {role === "ADMIN" && (
                <Link
                  href="/dashboard/admin"
                  className="text-sm font-medium text-primary"
                >
                  Go to Admin Dashboard →
                </Link>
              )}
              {role === "PROVIDER" && (
                <Link
                  href="/dashboard/provider"
                  className="text-sm font-medium text-primary"
                >
                  Go to Provider Dashboard →
                </Link>
              )}
              {role === "CUSTOMER" && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-primary"
                >
                  Go to Customer Dashboard →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage your account information and preferences.
            </p>
            <div className="mt-4">
              <Link
                href="/dashboard/profile"
                className="text-sm font-medium text-primary"
              >
                Profile →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Help</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Documentation and support links for the dashboard.
            </p>
            <div className="mt-4">
              <Link href="/" className="text-sm font-medium text-primary">
                Visit site →
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
