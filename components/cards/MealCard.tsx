import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface MealCardProps {
  id: string;
  title: string;
  providerName?: string | null;
  image?: string | null;
  price?: number | string;
  description?: string | null;
}

export default function MealCard({
  id,
  title,
  providerName,
  image,
  price,
  description,
}: MealCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-44 w-full bg-muted flex items-center justify-center text-muted-foreground">
        <Link href={`/meals/${id}`} className="block w-full h-full">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              Image
            </div>
          )}
        </Link>
      </div>

      <CardHeader className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <CardTitle className="text-base">
            <Link href={`/meals/${id}`} className="hover:underline">
              {title}
            </Link>
          </CardTitle>
          {providerName && (
            <div className="text-sm text-muted-foreground mt-1">
              {providerName}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="mt-1 font-semibold">${price ?? "--"}</div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>

      <CardFooter>
        <div className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            Add to cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
