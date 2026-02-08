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
import { getProvider } from "@/lib/auth/guard";
import api from "@/lib/fetcher";
import Link from "next/link";

interface OrderItem {
  id: string;
  mealId?: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  meal: {
    id: string;
    title: string;
  } | null;
}

type OrderStatus = "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
  } | null;
  placedAt: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

export default async function page() {
  const provider = await getProvider();

  if (!provider) {
    return (
      <section className="py-10">
        <Card>
          <CardHeader>
            <CardTitle>Complete your provider profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We could not find a provider profile for your account. To use the
              provider dashboard and receive orders, please complete your
              provider profile.
            </p>
            <div className="mt-4">
              <Link href="/dashboard/provider/profile">
                <Button>Complete profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const res = await api.get<{ data?: { orders?: Order[] } }>(
    `/v1/orders/provider/${provider.id}`,
  );

  const stats = {
    incoming:
      res.data?.orders?.filter((o) => o.status === "PLACED").length ?? 0,
    preparing:
      res.data?.orders?.filter((o) => o.status === "PREPARING").length ?? 0,
    ready: res.data?.orders?.filter((o) => o.status === "READY").length ?? 0,
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {provider?.name}!</h1>
          <p className="text-sm text-muted-foreground">
            Manage your menu and orders
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Incoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.incoming}</div>
            <p className="text-sm text-muted-foreground mt-2">
              New orders to accept
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preparing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.preparing}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Orders being prepared
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.ready}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Orders ready for delivery
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Placed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {res.data?.orders?.length ? (
                  res.data.orders.slice(0, 6).map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{o.customer?.name ?? "Guest"}</TableCell>
                      <TableCell>${o.total.toFixed(2)}</TableCell>
                      <TableCell>{o.status}</TableCell>
                      <TableCell>
                        {new Date(o.placedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No recent orders.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <Link href="/dashboard/provider/orders">
                <Button variant="link">Manage orders</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
