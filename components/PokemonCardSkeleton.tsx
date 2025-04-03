import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PokemonCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0 items-center justify-center">
        <Skeleton className="h-32 w-32 rounded-full my-4" /> {/* Image placeholder */}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4 mx-auto" /> {/* Name placeholder */}
        <div className="flex justify-center gap-2 pt-2">
          <Skeleton className="h-5 w-1/4" /> {/* Type 1 placeholder */}
          <Skeleton className="h-5 w-1/4" /> {/* Type 2 placeholder */}
        </div>
      </CardContent>
    </Card>
  );
} 