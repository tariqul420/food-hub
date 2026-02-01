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

  const stats = { orders: 6, saved: 12 };
  const recentOrders = [
    { id: "ORD-900", items: 2, total: "$22.00", status: "DELIVERED" },
    { id: "ORD-901", items: 1, total: "$8.50", status: "DELIVERED" },
  ];

  const savedMeals = [
    { id: "MEAL-01", name: "Chicken Biryani", provider: "Royal Kitchen" },
    { id: "MEAL-02", name: "Veg Thali", provider: "Green Leaf" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Customer dashboard overview
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.orders}</div>
            <p className="text-sm text-muted-foreground mt-2">Orders placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.saved}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Meals you saved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage your profile, addresses and payment methods.
            </p>
            <div className="mt-4">
              <Link href="/profile">
                <Button variant="link">Manage profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.id}</TableCell>
                    <TableCell>{o.items}</TableCell>
                    <TableCell>{o.total}</TableCell>
                    <TableCell>{o.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <Link href="/dashboard/orders">
                <Button variant="link">View orders</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {savedMeals.map((m) => (
                <li key={m.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.provider}
                    </div>
                  </div>
                  <Link
                    href={`/meals/${m.id}`}
                    className="text-sm text-primary"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <Link href="/meals">
                <Button variant="link">Browse meals</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
