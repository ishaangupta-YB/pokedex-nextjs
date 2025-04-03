"use client";
import React from 'react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";  
import { cn } from "@/lib/utils";  
import { BackgroundGradient } from "@/components/ui/background-gradient"; // Assuming component is in ui


interface Pokemon {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
}

interface PokemonCardProps {
    pokemon: Pokemon;
}

const getTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
        case 'grass': return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30';
        case 'fire': return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30';
        case 'water': return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30';
        case 'bug': return 'bg-lime-500/20 text-lime-700 dark:text-lime-400 border-lime-500/30';
        case 'normal': return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30';
        case 'poison': return 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30';
        case 'electric': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
        case 'ground': return 'bg-amber-700/20 text-amber-800 dark:text-amber-500 border-amber-700/30';
        case 'fairy': return 'bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30';
        case 'fighting': return 'bg-orange-700/20 text-orange-800 dark:text-orange-500 border-orange-700/30';
        case 'psychic': return 'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/30';
        case 'rock': return 'bg-stone-500/20 text-stone-700 dark:text-stone-400 border-stone-500/30';
        case 'ghost': return 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';
        case 'ice': return 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30';
        case 'dragon': return 'bg-teal-500/20 text-teal-700 dark:text-teal-400 border-teal-500/30';
        case 'dark': return 'bg-neutral-700/20 text-neutral-800 dark:text-neutral-400 border-neutral-700/30';
        case 'steel': return 'bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-500/30';
        case 'flying': return 'bg-sky-500/20 text-sky-700 dark:text-sky-400 border-sky-500/30';
        default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30';
    }
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function PokemonCard({ pokemon }: PokemonCardProps) {

    return (
        <BackgroundGradient 
            containerClassName="rounded-[22px] h-full group"
            className="rounded-[22px] p-4 sm:p-6 bg-card dark:bg-zinc-900 shadow-lg group-hover:shadow-xl transition-all duration-300 h-full flex flex-col group-hover:scale-[1.02]"
        >
            <div className="flex-grow flex flex-col items-center">
                <Image
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    height={150}
                    width={150}
                    className="object-contain mb-4 h-[150px] w-[150px] transition-transform duration-300 group-hover:scale-110"
                    unoptimized // Necessary for external URLs if loader not configured
                    priority={pokemon.id <= 20} // Prioritize loading images for the first few Pokémon
                />
                <p className="text-xs text-muted-foreground">#{String(pokemon.id).padStart(3, '0')}</p>
                <p className="text-lg font-bold tracking-tight text-card-foreground capitalize mb-2 text-center truncate w-full">
                    {pokemon.name}
                </p>
            </div>
            <div className="flex justify-center gap-2 flex-wrap mt-auto pt-2">
                {pokemon.types.map((type) => (
                    <Badge
                        key={type}
                        className={cn("border text-xs font-medium", getTypeColor(type))}
                        variant="outline"
                    >
                        {capitalize(type)}
                    </Badge>
                ))}
            </div>
        </BackgroundGradient>
    );
} 