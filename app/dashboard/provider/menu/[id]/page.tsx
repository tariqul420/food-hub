import { Card, CardContent } from "@/components/ui/card";
import MenuForm from "@/features/menu/components/menu-form";
import api from "@/lib/fetcher";

interface MealData {
  id: string;
  title: string;
  description?: string | null;
  categoryId?: string;
  image?: string | null;
  price?: number;
  currency?: string;
  isAvailable?: boolean;
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const res = await api.get<{ data?: MealData }>(`/v1/meals/${id}`);

  return (
    <Card>
      <CardContent>
        <MenuForm menu={res.data} />
      </CardContent>
    </Card>
  );
}
