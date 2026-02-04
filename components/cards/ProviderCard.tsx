import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ProviderCardProps {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
}

export default function ProviderCard({
  id,
  name,
  description,
  logo,
}: ProviderCardProps) {
  return (
    <Link href={`/providers/${id}`} className="block">
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            {logo ? (
              <AvatarImage src={logo} alt={name} />
            ) : (
              <AvatarImage src="/images/provider-placeholder.png" alt={name} />
            )}
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <CardHeader className="p-0">
              <CardTitle className="text-lg">{name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {description}
              </p>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}
