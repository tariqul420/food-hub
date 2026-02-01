import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUser } from "@/lib/auth/guard";
import Link from "next/link";

export default async function page() {
  const user = await getUser();

  // Placeholder stats and recent orders — replace with real API calls when available
  const stats = {
    users: 124,
    providers: 18,
    meals: 482,
    orders: 73,
  };

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Jane D.",
      total: "$18.50",
      status: "DELIVERED",
    },
    {
      id: "ORD-002",
      customer: "Mike P.",
      total: "$24.00",
      status: "PREPARING",
    },
    { id: "ORD-003", customer: "Anna K.", total: "$12.75", status: "PLACED" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Platform overview and management
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm">{user?.name}</p>
          <p className="text-xs text-muted-foreground">ADMIN</p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.users}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Registered customers and providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.providers}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Active food providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.meals}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Total menu items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.orders}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Orders in the last 30 days
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{o.id}</TableCell>
                      <TableCell>{o.customer}</TableCell>
                      <TableCell>{o.total}</TableCell>
                      <TableCell>{o.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Link href="/dashboard/admin/orders">
                  <Button variant="link">View all orders</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link href="/dashboard/admin/users">
                <Button>Manage users</Button>
              </Link>
              <Link href="/dashboard/admin/categories">
                <Button variant="outline">Manage categories</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
