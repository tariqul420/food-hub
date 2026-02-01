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

  const stats = { incoming: 5, preparing: 3, ready: 2 };
  const recent = [
    { id: "ORD-101", customer: "Sam W.", total: "$14.00", status: "PREPARING" },
    { id: "ORD-102", customer: "Lina M.", total: "$9.50", status: "PLACED" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Provider Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your menu and orders
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm">{user?.name}</p>
          <p className="text-xs text-muted-foreground">PROVIDER</p>
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
              Ready for pickup/delivery
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
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.customer}</TableCell>
                    <TableCell>{r.total}</TableCell>
                    <TableCell>{r.status}</TableCell>
                  </TableRow>
                ))}
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
