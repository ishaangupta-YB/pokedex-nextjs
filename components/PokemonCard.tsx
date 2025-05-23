"use client";
import React, { KeyboardEvent } from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";  
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
    onClick?: () => void;
}

const getTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
        case 'grass': return 'bg-green-500/15 text-green-700 dark:bg-green-500/25 dark:text-green-300 border-green-500/30';
        case 'fire': return 'bg-red-500/15 text-red-700 dark:bg-red-500/25 dark:text-red-300 border-red-500/30';
        case 'water': return 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/25 dark:text-blue-300 border-blue-500/30';
        case 'bug': return 'bg-lime-500/15 text-lime-700 dark:bg-lime-500/25 dark:text-lime-300 border-lime-500/30';
        case 'normal': return 'bg-gray-500/15 text-gray-700 dark:bg-gray-500/25 dark:text-gray-300 border-gray-500/30';
        case 'poison': return 'bg-purple-500/15 text-purple-700 dark:bg-purple-500/25 dark:text-purple-300 border-purple-500/30';
        case 'electric': return 'bg-yellow-500/15 text-yellow-700 dark:bg-yellow-500/25 dark:text-yellow-300 border-yellow-500/30';
        case 'ground': return 'bg-amber-700/15 text-amber-800 dark:bg-amber-600/25 dark:text-amber-300 border-amber-700/30';
        case 'fairy': return 'bg-pink-500/15 text-pink-700 dark:bg-pink-500/25 dark:text-pink-300 border-pink-500/30';
        case 'fighting': return 'bg-orange-700/15 text-orange-800 dark:bg-orange-600/25 dark:text-orange-300 border-orange-700/30';
        case 'psychic': return 'bg-fuchsia-500/15 text-fuchsia-700 dark:bg-fuchsia-500/25 dark:text-fuchsia-300 border-fuchsia-500/30';
        case 'rock': return 'bg-stone-500/15 text-stone-700 dark:bg-stone-500/25 dark:text-stone-300 border-stone-500/30';
        case 'ghost': return 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300 border-indigo-500/30';
        case 'ice': return 'bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/25 dark:text-cyan-300 border-cyan-500/30';
        case 'dragon': return 'bg-teal-500/15 text-teal-700 dark:bg-teal-500/25 dark:text-teal-300 border-teal-500/30';
        case 'dark': return 'bg-neutral-700/15 text-neutral-800 dark:bg-neutral-600/25 dark:text-neutral-300 border-neutral-700/30';
        case 'steel': return 'bg-slate-500/15 text-slate-700 dark:bg-slate-500/25 dark:text-slate-300 border-slate-500/30';
        case 'flying': return 'bg-sky-500/15 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300 border-sky-500/30';
        default: return 'bg-gray-500/15 text-gray-700 dark:bg-gray-500/25 dark:text-gray-300 border-gray-500/30';
    }
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {

    // Handler for keyboard interaction
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        // Trigger onClick if Enter or Space is pressed and onClick is defined
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault(); // Prevent default space scroll behavior
            onClick();
        }
    };

    // Apply conditional classes and props to the wrapper div
    const wrapperProps = onClick
        ? {
            role: "button" as const,
            tabIndex: 0,
            onClick: onClick,
            onKeyDown: handleKeyDown,
            'aria-label': `View details for ${pokemon.name}`,
            className: "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-[22px] h-full group", // Combine focus styles and existing container styles
          }
        : { className: "rounded-[22px] h-full group" }; // Default styles if not clickable

    // Floating animation variants
    const floatingAnimation = {
      initial: { y: 0 },
      animate: {
        y: [0, -8, 0],
        transition: {
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",
        },
      },
    };

    return (
        // Wrapper div takes the event handlers and accessibility props
        <div {...wrapperProps}>
            <BackgroundGradient
                containerClassName="rounded-[22px] h-full"
                className="rounded-[22px] p-4 sm:p-6 bg-card dark:bg-zinc-900 shadow-lg group-hover:shadow-xl transition-all duration-300 h-full flex flex-col group-hover:scale-[1.02]"
            >
                <div className="flex-grow flex flex-col items-center pointer-events-none">
                    {/* Wrap Image with motion.div for floating animation */}
                    <motion.div
                      initial="initial"
                      animate="animate" 
                      variants={floatingAnimation}
                      className="relative w-[150px] h-[150px] mb-4"
                    >
                        <Image
                            src={pokemon.imageUrl}
                            alt={pokemon.name}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-110"
                            unoptimized
                            priority={pokemon.id <= 20}
                        />
                    </motion.div>
                    <p className="text-xs text-muted-foreground">#{String(pokemon.id).padStart(3, '0')}</p>
                    <p className="text-lg font-bold tracking-tight text-card-foreground capitalize mb-2 text-center truncate w-full">
                        {pokemon.name}
                    </p>
                </div>
                <div className="flex justify-center gap-2 flex-wrap mt-auto pt-2 pointer-events-none">
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
        </div>
    );
} 