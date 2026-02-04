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

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Provider = {
  id: string;
  name: string;
  isActive: boolean;
};

type Meal = {
  id: string;
  title: string;
  price: number;
  isAvailable: boolean;
};

type Order = {
  id: string;
  deliveryAddress: string;
  total: number;
  status: string;
  placedAt: string;
  customer: User | null;
  items: {
    id: string;
    mealTitle: string;
    quantity: number;
  }[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export default async function page() {
  const user = await getUser();

  // Fetch real data from API
  let users: User[] = [];
  let providers: Provider[] = [];
  let meals: Meal[] = [];
  let orders: Order[] = [];

  try {
    const [usersRes, providersRes, mealsRes, ordersRes] = await Promise.all([
      api
        .get<ApiResponse<{ users: User[] }>>("/users/admin")
        .catch(() => ({ success: false, data: { users: [] } })),
      api
        .get<ApiResponse<Provider[]>>("/providers")
        .catch(() => ({ success: false, data: [] })),
      api
        .get<ApiResponse<Meal[]>>("/meals")
        .catch(() => ({ success: false, data: [] })),
      api
        .get<ApiResponse<{ orders: Order[] }>>("/orders/admin")
        .catch(() => ({ success: false, data: { orders: [] } })),
    ]);

    users = usersRes.data?.users || [];
    providers = providersRes.data || [];
    meals = mealsRes.data || [];
    orders = ordersRes.data?.orders || [];
  } catch (error) {
    console.error("Failed to fetch admin dashboard data:", error);
  }

  const stats = {
    users: users.length,
    providers: providers.filter((p) => p.isActive).length,
    meals: meals.length,
    orders: orders.length,
  };

  const recentOrders = orders
    .sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
    )
    .slice(0, 5)
    .map((order) => ({
      id: order.id,
      customer: order.customer?.name || "Guest",
      total: `$${order.total.toFixed(2)}`,
      status: order.status,
    }));

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
                  {recentOrders.length > 0 ? (
                    recentOrders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">
                          {o.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>{o.customer}</TableCell>
                        <TableCell>{o.total}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              o.status === "DELIVERED"
                                ? "bg-green-100 text-green-700"
                                : o.status === "CANCELLED"
                                  ? "bg-red-100 text-red-700"
                                  : o.status === "PREPARING"
                                    ? "bg-blue-100 text-blue-700"
                                    : o.status === "READY"
                                      ? "bg-purple-100 text-purple-700"
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
