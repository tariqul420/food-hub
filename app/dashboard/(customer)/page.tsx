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
import { api } from "@/lib/fetcher";
import Link from "next/link";

type Order = {
  id: string;
  deliveryAddress: string;
  total: number;
  status: string;
  placedAt: string;
  items: {
    id: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    meal: {
      id: string;
      title: string;
    } | null;
  }[];
};

type ApiResponse = {
  success: boolean;
  data: Order[];
  message?: string;
};

export default async function page() {
  const user = await getUser();

  // Fetch real orders data
  let orders: Order[] = [];
  try {
    const response = await api.get<ApiResponse>("/orders", {
      customerId: user?.id,
    });
    orders = response.data || [];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  // Calculate stats
  const stats = {
    orders: orders.length,
    saved: 0, // TODO: Implement saved meals functionality
  };

  // Get recent orders (last 5)
  const recentOrders = orders
    .sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
    )
    .slice(0, 5)
    .map((order) => ({
      id: order.id,
      items: order.items.length,
      total: `$${order.total.toFixed(2)}`,
      status: order.status,
    }));

  // TODO: Fetch saved meals from API when implemented
  const savedMeals: { id: string; name: string; provider: string }[] = [];

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
                {recentOrders.length > 0 ? (
                  recentOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">
                        {o.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{o.items}</TableCell>
                      <TableCell>{o.total}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            o.status === "DELIVERED"
                              ? "bg-green-100 text-green-700"
                              : o.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {o.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No orders yet
                    </TableCell>
                  </TableRow>
                )}
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
              {savedMeals.length > 0 ? (
                savedMeals.map((m) => (
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
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No saved meals yet
                </div>
              )}
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
