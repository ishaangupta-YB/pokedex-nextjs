import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PokemonCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0 items-center justify-center">
        <Skeleton className="h-32 w-32 rounded-full my-4" /> 
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4 mx-auto" /> 
        <div className="flex justify-center gap-2 pt-2">
          <Skeleton className="h-5 w-1/4" /> 
          <Skeleton className="h-5 w-1/4" /> 
        </div>
      </CardContent>
    </Card>
  );
} 