"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTypeColor } from '../lib/utils';
import { cn } from "@/lib/utils";
import EvolutionChainDisplay from './EvolutionChainDisplay';

interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string;
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
  abilities: { name: string; isHidden: boolean }[];
  types: string[];
  description: string;
  evolutionChain: { id: number; name: string }[] | null;
}

interface PokemonDetailViewProps {
  pokemonName: string;
}

const formatStatName = (name: string): string => {
    return name
        .split(' ')
        .map(word => word === 'hp' ? 'HP' : word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const PokemonDetailView = ({ pokemonName }: PokemonDetailViewProps) => {
  const [detailData, setDetailData] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonName) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      setDetailData(null);
      try {
        const response = await fetch(`/api/pokemon/${encodeURIComponent(pokemonName)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch details for ${pokemonName}`);
        }
        const data: PokemonDetail = await response.json();
        setDetailData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [pokemonName]);

  if (isLoading) {
    return <PokemonDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8 bg-background rounded-lg">
        <p className="font-semibold text-lg mb-2">Error loading Pokémon details!</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!detailData) {
    return <div className="text-center text-muted-foreground p-8 bg-background rounded-lg">No data available.</div>;
  }

  const { id, name, imageUrl, height, weight, stats, abilities, types, description, evolutionChain } = detailData;
  const dominantType = types[0] || 'normal';
  const typeColor = getTypeColor(dominantType);

  return (
    <div className="bg-background text-foreground p-6 rounded-lg max-w-3xl mx-auto">
      <div
          className={cn(
              "rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-6 relative overflow-hidden",
              `bg-gradient-to-br ${typeColor.gradientFrom} ${typeColor.gradientTo} opacity-80 dark:opacity-100`
          )}
          style={{
              '--tw-gradient-from': `${typeColor.bgHex} var(--tw-gradient-from-position)`,
              '--tw-gradient-to': `${typeColor.bgHex && typeColor.bgHex != 'transparent' ? `${typeColor.bgHex}00` : 'transparent'} var(--tw-gradient-to-position)`,
              '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)`,
          } as React.CSSProperties}
      >
        <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 relative z-10">
          <Image
            src={imageUrl || '/placeholder.png'}
            alt={name}
            fill
            className="object-contain drop-shadow-xl"
            priority
            unoptimized
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
          />
        </div>
        <div className="flex-grow text-white z-10 text-center md:text-left">
          <p className="text-lg font-semibold opacity-80 mb-1">#{String(id).padStart(4, '0')}</p>
          <h2 className="text-4xl md:text-5xl font-bold capitalize mb-3">{name}</h2>
          <div className="flex justify-center md:justify-start gap-2 mb-4">
             {types.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="capitalize text-xs px-2.5 py-0.5 bg-white/20 border-white/30 hover:bg-white/30 text-white"
                >
                  {type}
                </Badge>
            ))}
          </div>
          <p className="text-sm opacity-90 mb-4 leading-relaxed">{description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
             <div>
                <p className="font-medium opacity-80">Height</p>
                <p className="font-semibold">{height.toFixed(1)} m</p>
             </div>
             <div>
                <p className="font-medium opacity-80">Weight</p>
                <p className="font-semibold">{weight.toFixed(1)} kg</p>
             </div>
          </div>
          <div>
             <p className="font-medium opacity-80 mb-1">Abilities</p>
             <div className="flex flex-wrap gap-2">
                {abilities.map((ability) => (
                    <Badge
                      key={ability.name}
                      variant="outline"
                      className={cn(
                        "capitalize text-xs px-2 py-0.5 bg-white/10 border-white/20 hover:bg-white/20 text-white",
                        ability.isHidden && "italic"
                      )}
                    >
                       {ability.name} {ability.isHidden && "(hidden)"}
                    </Badge>
                ))}
             </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 dark:bg-muted/80">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="bg-muted/30 dark:bg-muted/50 p-4 sm:p-6 rounded-b-lg min-h-[200px]">
          <h3 className="text-xl font-semibold mb-4">Base Stats</h3>
          <div className="space-y-3 sm:space-y-4">
            {stats.map((stat) => (
              <div key={stat.name} className="grid grid-cols-[auto,1fr,auto] sm:grid-cols-6 items-center gap-x-2 sm:gap-x-4 gap-y-1 text-sm">
                <span className="col-span-1 sm:col-span-2 font-medium text-muted-foreground capitalize truncate pr-2">
                  {formatStatName(stat.name)}
                </span>
                <div className="col-span-1 sm:col-span-3">
                  <Progress
                    value={stat.value}
                    max={255}
                    className="h-2"
                    style={{ '--progress-indicator-color': typeColor.bgHex } as React.CSSProperties}
                  />
                </div>
                <span className="col-span-1 sm:col-span-1 text-right font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="bg-muted/30 dark:bg-muted/50 p-6 rounded-b-lg min-h-[200px]">
           <h3 className="text-xl font-semibold mb-4">Evolution Chain</h3>
           <EvolutionChainDisplay chain={evolutionChain} currentPokemonId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PokemonDetailSkeleton = () => (
  <div className="bg-background text-foreground p-6 rounded-lg max-w-3xl mx-auto">
    <div className="rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-6 bg-muted/50 animate-pulse">
      <Skeleton className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded-md" />
      <div className="flex-grow space-y-3 w-full">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-8 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
         <div className="pt-2">
           <Skeleton className="h-4 w-1/5 mb-2" />
           <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
           </div>
         </div>
      </div>
    </div>

    <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 dark:bg-muted/80">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </TabsList>
        <TabsContent value="stats" className="bg-muted/30 dark:bg-muted/50 p-4 sm:p-6 rounded-b-lg min-h-[200px] animate-pulse">
           <Skeleton className="h-6 w-1/3 sm:w-1/4 mb-4" />
           <div className="space-y-3 sm:space-y-4">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="grid grid-cols-[auto,1fr,auto] sm:grid-cols-6 items-center gap-x-2 sm:gap-x-4 gap-y-1 text-sm">
                  <Skeleton className="h-4 col-span-1 sm:col-span-2" />
                  <Skeleton className="h-2 col-span-1 sm:col-span-3" />
                  <Skeleton className="h-4 col-span-1 sm:col-span-1" />
               </div>
             ))}
           </div>
        </TabsContent>
        <TabsContent value="evolution" className="bg-muted/30 dark:bg-muted/50 p-6 rounded-b-lg min-h-[200px] animate-pulse">
           <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                <Skeleton className="h-10 w-20 rounded-md" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-10 w-20 rounded-md" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-10 w-20 rounded-md" />
            </div>
        </TabsContent>
     </Tabs>
  </div>
);

export default PokemonDetailView; 