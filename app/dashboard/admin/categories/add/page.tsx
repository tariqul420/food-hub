import { Card, CardContent } from "@/components/ui/card";
import CategoryForm from "@/features/category/components/category-form";

export default function page() {
  return (
    <Card>
      <CardContent>
        <CategoryForm />
      </CardContent>
    </Card>
  );
}
